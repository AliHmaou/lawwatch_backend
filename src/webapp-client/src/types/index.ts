export interface Amendment {
  [key: string]: string;
  url: string;
  num: string;
  article: string;
  auteur: string;
  groupe: string;
  sort: string;
  amendement_date_depot: string;
  amendement_date_sort_est_traite: string;
  amendement_date_sort_est_adopte: string;
  amendement_date_sort_est_rejete: string;
  tmstmp_derniere_situation: string;
  ia_resume_mesure: string;
  ia_theme: string;
  ia_type_mesure: string;
  rejet_art_40: string;
  ia_constructivite: string;
  ia_acteur_gagnant: string;
  ia_acteur_perdant: string;
  organe_examen_prefixe: string;
}

export interface Filter {
    type: keyof Amendment;
    label: string;
    value: string;
}
