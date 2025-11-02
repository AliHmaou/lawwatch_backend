import { Amendment } from '../types';

export const columnMapping: { [key: string]: keyof Amendment | string } = {
  'amendement_url_page_presentation': 'url',
  'amendemement_numero': 'num',
  'texte_amende_article': 'article',
  'auteur_nom_prenom': 'auteur',
  'auteur_groupe_politique_libelle_clair': 'groupe',
  'amendement_sort_courant': 'sort',
  'amendement_est_rejet_article_40': 'rejet_art_40',
  'amendement_date_depot': 'amendement_date_depot',
  'amendement_date_sort_est_traite': 'amendement_date_sort_est_traite',
  'amendement_date_sort_est_adopte': 'amendement_date_sort_est_adopte',
  'amendement_date_sort_est_rejete': 'amendement_date_sort_est_rejete',
  'tmstmp_derniere_situation': 'tmstmp_derniere_situation',
  'amendemement_ia_resume_mesure': 'ia_resume_mesure',
  'amendemement_ia_theme': 'ia_theme',
  'amendemement_ia_type_mesure': 'ia_type_mesure',
  'amendemement_ia_constructivite': 'ia_constructivite',
  'amendemement_ia_acteur_gagnant': 'ia_acteur_gagnant',
  'amendemement_ia_acteur_perdant': 'ia_acteur_perdant',
  'amendement_prefixe_organe_examen': 'organe_examen_prefixe',
};

export const cleanString = (str: any): string => {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') return String(str);
  return str.trim().replace(/^"|"$/g, '');
};

export const parseJSON = (jsonText: string): Amendment[] => {
  let rawData: any[];

  try {
    const parsed = JSON.parse(jsonText);
    rawData = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.warn("Standard JSON parsing failed, attempting to parse as JSON Lines.", error);
    try {
      const lines = jsonText.trim().split('\n').filter(line => line.trim() !== '');
      rawData = lines.map(line => JSON.parse(line));
    } catch (innerError) {
      console.error("Failed to parse JSON as standard or JSON Lines format.", innerError);
      throw new Error("Invalid JSON format");
    }
  }

  if (!rawData || rawData.length === 0) {
    return [];
  }

  return rawData.map(rawItem => {
    const amendment: Partial<Amendment> = {};
    for (const rawKey in columnMapping) {
      const internalKey = columnMapping[rawKey] as keyof Amendment;
      if (rawItem.hasOwnProperty(rawKey)) {
        amendment[internalKey] = cleanString(rawItem[rawKey]);
      }
    }
    
    if (amendment.rejet_art_40 === 'OUI') {
        amendment.sort = 'Rejeté Article 40';
    } else if (amendment.sort === 'Non renseigné') {
        amendment.sort = 'Non examiné';
    }

    return amendment as Amendment;
  });
};

export const getStatusClass = (status: string) => {
  switch (status) {
    case 'Adopté': return 'status-adopted';
    case 'Rejeté': return 'status-rejected';
    case 'Rejeté Article 40': return 'status-rejected';
    case 'Tombé': return 'status-fallen';
    case 'Retiré': return 'status-withdrawn';
    case 'Non soutenu': return 'status-notsupported';
    case 'Non examiné': return 'status-default';
    default: return 'status-default';
  }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Adopté': return '#28a745';
        case 'Rejeté': return '#dc3545';
        case 'Rejeté Article 40': return '#dc3545';
        case 'Tombé': return '#ffc107';
        case 'Retiré': return '#6c757d';
        case 'Non soutenu': return '#fd7e14';
        case 'Non examiné': return '#6c757d';
        default: return '#6c757d';
    }
};
