-- OO1 : Lecture des fichiers de suivi des amendements après téléchargement via crontab/curl
create or replace view wrk_current_load as (
select substring(filename, 67,12).strptime('%Y%m%d%H%M') as moment, *
from read_csv("/data/*/*/2025*.csv", filename=true)
);




-- 002 : Lecture de la liste des députés depuis l'open data de l'AN
create or replace view wrk_current_deputies as 
select * from "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_csv_opendata/liste_deputes_libre_office.csv"
union 
select -1, '', 'Gouvernement', 'Ile-de-France','Paris','1','Gouvernement','Gouvernement','GOUV';

-- 003 : Enrichissement de la liste des amendements avec les informations sur les députés -- Le gouvernement aussi a déposé des amendements 
create or replace view agr_suivi_amendements as 
select 
(select max(moment) from wrk_current_load) derniere_situation,
a."Numéro de l'amendement",
"URL Amendement",
"URL Amendement format XML",
"Partie de l'amendement",
"Désignation de l'article",
Auteur,
"Groupe politique (complet)",
"Groupe politique (abrégé)",
derniere_situation."Sort de l'amendement",
min (moment) moment_premier_depot,
min(case when a."Sort de l'amendement" <> 'Non renseigné' then moment else null end) moment_est_traite,
min(case when a."Sort de l'amendement" == 'Adopté' then moment else null end) moment_est_adopte,
min(case when a."Sort de l'amendement" == 'Rejeté' then moment else null end) moment_est_rejete,
min(case when a."Sort de l'amendement" == 'Non soutenu' then moment else null end) moment_est_non_soutenu,
min(case when a."Sort de l'amendement" == 'Tombé' then moment else null end) moment_est_tombe,
min(case when a."Sort de l'amendement" == 'Retiré' then moment else null end) moment_est_retire,
from wrk_current_load  a 
left outer join wrk_current_deputies b on ((regexp_replace(a."Auteur",' (rapporteure|rapporteur général|rapporteur)$','')  = b."Nom" || ' ' || "Prénom" ) or (a."Auteur"='Gouvernement' and b."Nom"='Gouvernement'))
left outer join (
	select "Numéro de l'amendement", "Sort de l'amendement"
	from wrk_current_load
	where moment  = (select max(moment) from wrk_current_load)
) derniere_situation on (a."Numéro de l'amendement" = derniere_situation."Numéro de l'amendement")
group by all
 ;



-- 004-RERUN : Récupération de la liste des liens vers le détail des amendemendents pour téléchargement via Curl
copy(
from agr_suivi_amendements
select "Numéro de l'amendement", replace("URL Amendement format XML", 'xml','json') url_json
) to  "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_LIENS_TEXTES.json";


-- 005 : Extraction des informations intéressantes depuis le détail des amendements, surtout les exposés sommaires
create or replace view exposes_sommaires as (
from read_json("/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/TEXTES/*.json", union_by_name=True)
select identification.numeroLong, corps.contenuAuteur.exposesommaire, corps.cartoucheinformatif, identification.prefixeOrganeExamen
);

-- 006 : Création d'une vue complète avec exposés sommaire, récupération des rejets au titre de l'article 40
create or replace view agr_suivi_amendements_exposes_sommaires as (
from agr_suivi_amendements a left outer join exposes_sommaires b
on a."Numéro de l'amendement" = b.numeroLong
select *, case when b.cartoucheinformatif like '%article 40%' then 'OUI' else 'NON' end est_rejet_art40,
);

-- 007-RERUN : Matérialisation de la vue pour performances de la suite du traitement
create or replace table agr_suivi_amendements_exposes_sommaires_tab as select * from agr_suivi_amendements_exposes_sommaires;

copy agr_suivi_amendements_exposes_sommaires_tab to "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/agr_suivi_amendements_exposes_sommaires_tab.parquet";

from agr_suivi_amendements_exposes_sommaires_tab where "Auteur"='Gouvernement';

/*
select *
from wrk_current_load where moment = (select max(moment) from wrk_current_load)
order by 16 DESC;
*/