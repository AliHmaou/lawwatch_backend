
------ Enrichissement par IA via Flock

install flock from community;
load flock;


CREATE SECRET (
    TYPE OPENAI,
    BASE_URL 'https://api.groq.com/openai/v1/',
    API_KEY 'gsk_xxxx'
);

UPDATE MODEL(
   'IntelligentClassifier',
   'meta-llama/llama-4-maverick-17b-128e-instruct', 
   'openai', 
   {"tuple_format": "json", "batch_size": 5, "model_parameters": {"temperature": 1}}
);


CREATE PROMPT('analyse_amendement_v2', 
'Instruction : Pour chaque amendement soumis, générer un objet JSON unique contenant les champs suivants.
**Structure JSON requise :**
```json
{
  "id_amendement":"string"
  "resume_mesure": "string",
  "constructivite": "boolean",
  "realisme": "boolean",
  "impact_financier": "enum(positif, negatif)",
  "acteur_gagnant": "string",
  "acteur_perdant": "string",
  "type_mesure": "string",
  "sensibilite": "enum(Gauche, Droite)",
  "type_politique": "string",
  "theme": "string"
}
```
**Description des champs :**
  * **id\_amendement** : Rappel de l identifiant de l amendement analysé.
  * **resume\_mesure** : Synthèse concise EN 10 mots max commençant à l infinitif de la mesure proposée.
  * **constructivite** : `true` si l amendement constitue une proposition de fond, `false` s il relève de l obstruction.
  * **realisme** : `true` si l amendement est proportionné et démontre une recherche de compromis.
  * **impact\_financier** : `positif` pour un gain de recettes, `negatif` pour une augmentation des dépenses.
  * **acteur\_gagnant** : Identification du bénéficiaire principal de la mesure.
  * **acteur\_perdant** : Identification de l entité principalement impactée négativement.
  * **type\_mesure** : Qualification de la nature de la mesure (3 mots maximum).
  * **sensibilite** : `Gauche` ou `Droite`.
  * **type\_politique** : Qualification idéologique ou sectorielle de la mesure.
  * **thème** : Renseigné par l objet fiscal, ou le dispositif principal concerné lorsqu il y en a un.'
);


-- Initialisation du batch call
/* 

create or replace table tmp_llm_results as (
with test_data as (
	select 'AMD001' id_amendement, 'Tripler la TVA' texte_amendement
), ai_result as (
SELECT id_amendement,texte_amendement,llm_complete(
    {'model_name': 'IntelligentClassifier'},
    {'prompt_name': 'analyse_amendement_v2', 'version': 1, 'context_columns': [{'data': texte_amendement}]}
) AS json_resultat
FROM test_data
) 
select id_amendement, texte_amendement,
	json_resultat.id_amendement::VARCHAR AS id_amendement_ia,
	json_resultat.resume_mesure::VARCHAR AS resume_mesure,
    json_resultat.constructivite::VARCHAR AS constructivite,
    json_resultat.realisme::VARCHAR AS realisme,
    json_resultat.impact_financier::VARCHAR AS impact_financier,
    json_resultat.acteur_gagnant::VARCHAR AS acteur_gagnant,
    json_resultat.acteur_perdant::VARCHAR AS acteur_perdant,
    json_resultat.type_mesure::VARCHAR AS type_mesure,
    json_resultat.sensibilite::VARCHAR AS sensibilite,
    json_resultat.type_politique::VARCHAR AS type_politique,
    json_resultat.theme::VARCHAR AS theme
from ai_result
);

create or replace table llm_results as select * exclude id_amendement_ia from tmp_llm_results;
truncate llm_results;
*/

---------------------------------------------------------------
---------------------------------------------------------------
--- BATCH CALL AVEC FLOCKMTL 
--- Each run of 4 lines lasts about 1s, I use the refresh function of dbeaver to batch run it.
---------------------------------------------------------------
---------------------------------------------------------------
-- Calcul LLM pour les prochains amendements encore non traités

truncate tmp_llm_results;

insert into tmp_llm_results 
with test_data as (
	select "Numéro de l'amendement" id_amendement,  'CODE AMENDEMENT : ' || "Numéro de l'amendement" || ' EXPOSE A ANALYSER : ' || exposesommaire texte_amendement_ia, exposesommaire texte_amendement
	from agr_suivi_amendements_exposes_sommaires_tab a left outer join llm_results b on (a."Numéro de l'amendement"  = b.id_amendement)
	where b.id_amendement is null and exposesommaire is not null
	order by 1 desc
	limit 5
), ai_result as (
SELECT id_amendement,texte_amendement,llm_complete(
    {'model_name': 'IntelligentClassifier'},
    {'prompt_name': 'analyse_amendement_v2', 'version': 1, 'context_columns': [{'data': texte_amendement_ia}]}
) AS json_resultat
FROM test_data
) 
select id_amendement, texte_amendement,
	json_resultat.id_amendement::VARCHAR AS id_amendement_ia,
	json_resultat.resume_mesure::VARCHAR AS resume_mesure,
    json_resultat.constructivite::VARCHAR AS constructivite,
    json_resultat.realisme::VARCHAR AS realisme,
    json_resultat.impact_financier::VARCHAR AS impact_financier,
    json_resultat.acteur_gagnant::VARCHAR AS acteur_gagnant,
    json_resultat.acteur_perdant::VARCHAR AS acteur_perdant,
    json_resultat.type_mesure::VARCHAR AS type_mesure,
    json_resultat.sensibilite::VARCHAR AS sensibilite,
    json_resultat.type_politique::VARCHAR AS type_politique,
    json_resultat.theme::VARCHAR AS theme
from ai_result
;

-- Insertion des amendements avec résultat LLM non vide dans la table finale
insert into llm_results 
select * exclude id_amendement_ia from tmp_llm_results a
where a.resume_mesure is not null and (lower(a.resume_mesure) not in ('"null"', 'null','""')) and id_amendement_ia = '"'||id_amendement||'"'
and a.id_amendement not in (select distinct id_amendement from llm_results);



-- écriture de l'avancement dans la log 
select count(*), max(id_amendement), min(resume_mesure) from llm_results ;
---------------------------------------------------------------
---------------------------------------------------------------
------------------------- Fin du batch
---------------------------------------------------------------
---------------------------------------------------------------



