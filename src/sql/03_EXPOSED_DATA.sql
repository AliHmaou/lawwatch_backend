---------------------------------------------------------------
--- Mise en forme finale du dataset
---------------------------------------------------------------
create or replace view agr_amendements_analyses as 
select 
derniere_situation tmstmp_derniere_situation,
"Numéro de l'amendement" amendemement_numero,
prefixeOrganeExamen amendement_prefixe_organe_examen,
CASE 
    WHEN prefixeOrganeExamen = 'CION_AFETR' THEN 'Commission des affaires étrangères, de la défense et des forces armées'
	WHEN prefixeOrganeExamen = 'AN'          THEN 'Assemblée nationale (séance plénière)'
	WHEN prefixeOrganeExamen = 'CION_FIN'    THEN 'Commission des finances, de l’économie générale et du contrôle budgétaire'
	WHEN prefixeOrganeExamen = 'CION-ECO'    THEN 'Commission des affaires économiques'
	WHEN prefixeOrganeExamen = 'CION_DEF'    THEN 'Commission de la défense nationale et des forces armées'
	WHEN prefixeOrganeExamen = 'CION_LOIS'   THEN 'Commission des lois constitutionnelles, de la législation et de l''administration générale de la République'
	WHEN prefixeOrganeExamen = 'CION-CEDU'   THEN 'Commission des affaires culturelles et de l''éducation'
	WHEN prefixeOrganeExamen = 'CION-DVP'    THEN 'Commission du développement durable et de l''aménagement du territoire'
    ELSE prefixeOrganeExamen  -- ou NULL, selon ce que tu veux faire pour les autres cas
END AS amendement_libelle_organe_examen,
"URL Amendement" amendement_url_page_presentation,
"URL Amendement format XML" amendement_url_xml,
"Partie de l'amendement" texte_amende_partie,
min("Désignation de l'article") texte_amende_article,
Auteur auteur_nom_prenom,
"Groupe politique (complet)" auteur_groupe_politique_libelle_clair,
"Groupe politique (abrégé)" auteur_groupe_politique_libelle_abrege,
"Sort de l'amendement" amendement_sort_courant,
est_rejet_art40 amendement_est_rejet_article_40,
min(moment_premier_depot) amendement_date_depot,
moment_est_traite amendement_date_sort_est_traite,
moment_est_adopte amendement_date_sort_est_adopte,
moment_est_rejete amendement_date_sort_est_rejete,
moment_est_non_soutenu amendement_date_sort_est_soutenu,
moment_est_tombe amendement_date_sort_est_tombe,
moment_est_retire amendement_date_sort_est_retire,
numeroLong amendement_numerolong,
exposesommaire amendement_exposesommaire_brut,
cartoucheinformatif amendement_cartouche_informatif,
resume_mesure amendemement_ia_resume_mesure,
constructivite amendemement_ia_constructivite,
realisme amendemement_ia_realisme,
impact_financier amendemement_ia_impact_financier,
acteur_gagnant amendemement_ia_acteur_gagnant,
acteur_perdant amendemement_ia_acteur_perdant,
type_mesure amendemement_ia_type_mesure,
sensibilite amendemement_ia_sensibilite,
type_politique amendemement_ia_type_politique,
theme amendemement_ia_theme
from agr_suivi_amendements_exposes_sommaires a left outer join llm_results b on (a."Numéro de l'amendement" = b.id_amendement)
group by all;

create or replace view agr_amendements_analyses_notext as (from agr_amendements_analyses select * exclude amendement_exposesommaire_brut);


---------------------------------------------------------------
---- Exports
---------------------------------------------------------------

create or replace table agr_amendements_analyses_notext_tab as select * from agr_amendements_analyses_notext;
create or replace table agr_amendements_analyses_tab as select * from agr_amendements_analyses;

copy agr_amendements_analyses_tab to "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_ANALYSE_AMENDEMENTS.csv";
copy agr_amendements_analyses_tab to "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_ANALYSE_AMENDEMENTS.parquet";
copy agr_amendements_analyses_tab to "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_ANALYSE_AMENDEMENTS.json";
copy agr_amendements_analyses_notext_tab to "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_ANALYSE_AMENDEMENTS_NOTEXT.csv";
copy (select * from agr_amendements_analyses_notext_tab ) to "/Users/alihmaou/Projets/hackathon/lawwatch/data/PLF2026/LECTURE_1/PLF2026_LECTURE_1_ANALYSE_AMENDEMENTS_NOTEXT.json";


from agr_amendements_analyses_tab
select distinct 
regexp_extract(amendemement_numero,'-([A-Z]+)',1) code_numero_amendement,
amendement_prefixe_organe_examen,
amendement_libelle_organe_examen, count(*) , max(amendement_url_page_presentation)
group by all;


from agr_amendements_analyses_tab;
