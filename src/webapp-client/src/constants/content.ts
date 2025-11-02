export const sourcesContent = `Les données brutes proviennent du site de l'Assemblée Nationale :
- **Suivi des amendements**: \`https://data.assemblee-nationale.fr/static/openData/repository/17/dossiers_legislatifs_opendata/52428/libre_office.csv\`
- **Liste des députés**: \`https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_csv_opendata/liste_deputes_libre_office.csv\`
- **Texte des amendements (JSON)**: Les URLs sont générées dynamiquement à partir des données de suivi.`;

export const datasetContent = `Le jeu de données complet, incluant les enrichissements par IA, est disponible publiquement sur la plateforme Hugging Face.

Vous pouvez le consulter et le télécharger à l'adresse suivante :
[Dataset sur Hugging Face](https://huggingface.co/datasets/alihmaou/plf2026_amendements)

## Description du dataset

Ce fichier contient des données relatives aux amendements proposés à l'Assemblée Nationale, incluant des informations sur les auteurs, les dates de dépôt et de traitement, ainsi que des analyses basées sur l'intelligence artificielle (IA) concernant les impacts et les thématiques des amendements.

## Champs Notables

- \`tmstmp_derniere_situation\`: Horodatage de la dernière situation de l'amendement.
- \`auteur_nom_prenom\`: Nom et prénom de l'auteur de l'amendement.
- \`amendement_date_depot\`: Date de dépôt de l'amendement.
- \`amendemement_ia_resume_mesure\`: Résumé de la mesure proposée par l'amendement selon l'analyse IA.
- \`amendemement_ia_theme\`: Thématique de l'amendement selon l'analyse IA.

## Exemples d'Analyses Possibles

- Analyse temporelle des amendements : Étudier la fréquence et la nature des amendements déposés au fil du temps.
- Impact des amendements : Examiner les résultats des amendements (adoptés, rejetés, tombés) et leur impact potentiel.
- Thématiques des amendements : Identifier les thématiques les plus fréquentes et leur évolution.

## Mots Clés

#AssembléeNationale #Amendements #AnalyseDeDonnées #IntelligenceArtificielle #Législation #Politique #Gouvernement #DonnéesOuvertes`;

export const codeContent = `Cette application est un projet open-source. Le code est disponible sur GitHub et toute contribution est la bienvenue.

Que ce soit pour corriger un bug, proposer une nouvelle fonctionnalité ou améliorer le design, n'hésitez pas à ouvrir une *issue* ou une *pull request*.

[Voir le code sur GitHub](https://github.com/alihmaou/lawWatch)`;

export const aboutContent = `# LawWatch - Démo sur le PLF2026

## Stack Technologique

- **Backend**:
  - **Scripts Shell**: Pour l'automatisation du téléchargement des données.
  - **DuckDB**: Pour le traitement et l'analyse des données.
  - **L'extension duckdb Flock**: Pour l'enrichissement des données via un modèle de langage local.
  - **Groq**: Fournisseseur d'inférence pour le modèle de langage.
  - **Llama4**: Modèle de langage utilisé pour l'analyse des amendements.
  - **Crontab**: Pour l'historisation des données toutes les 15 minutes.
  - **Hugging Face**: Pour le stockage des données finales.
- **Frontend**:
  - **Google AI Studio**: Pour la génération du code de l'application à partir du jeu de données final.

## Pipeline de Données

Le pipeline de données est orchestré par des scripts shell et SQL. Voici un aperçu du flux de données :

1.  **Téléchargement des données**: Les scripts \`download_data.sh\` et \`download_amendments.sh\` téléchargent les données depuis le site de l'Assemblée Nationale.
2.  **Traitement et nettoyage**: Le script \`01_LOAD_CLEAN.sql\` charge les données dans DuckDB, les nettoie et les agrège.
3.  **Enrichissement IA**: Le script \`02_LLM_COMPLETE.sql\` utilise l'extension duckdb Flock pour analyser le texte des amendements et générer des informations supplémentaires (résumé, thème, etc.).
4.  **Export des données**: Le script \`03_EXPOSED_DATA.sql\` exporte les données enrichies aux formats CSV, Parquet et JSON. Ces données sont ensuite hébergées sur Hugging Face.

## Enrichissement IA

L'enrichissement des données est réalisé via l'extension \`Flock\` pour DuckDB, qui appelle le modèle \`meta-llama/llama-4-maverick-17b-128e-instruct\` à travers le fournisseur d'inférence \`Groq\`.

Le prompt suivant est utilisé pour analyser chaque amendement :

\`\`\`sql
Instruction : 
our chaque amendement soumis, générer un objet JSON unique contenant les champs suivants.
**Structure JSON requise :**

{
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

**Description des champs :**
  * **resume\\_mesure** : Synthèse concise EN 10 mots max commençant à l infinitif de la mesure proposée.
  * **constructivite** : \`true\` si l amendement constitue une proposition de fond, \`false\` s il relève de l obstruction.
  * **realisme** : \`true\` si l amendement est proportionné et démontre une recherche de compromise.
  * **impact\\_financier** : \`positif\` pour un gain de recettes, \`negatif\` pour une augmentation des dépenses.
  * **acteur\\_gagnant** : Identification du bénéficiaire principal de la mesure.
  * **acteur\\_perdant** : Identification de l entité principalement impactée négativement.
  * **type\\_mesure** : Qualification de la nature de la mesure (3 mots maximum).
  * **sensibilite** : \`Gauche\` ou \`Droite\`.
  * **type\\_politique** : Qualification idéologique ou sectorielle de la mesure.
  - **thème** : Renseigné par l objet fiscal, ou le dispositif principal concerné lorsqu il y en a un.'
\`\`\``;
