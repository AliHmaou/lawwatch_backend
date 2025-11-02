import React from 'react';
import { Amendment } from '../../types';
import { getStatusClass } from '../../utils/helpers';

interface AmendmentCardProps {
  amendment: Amendment;
  onViewDetails: (amendment: Amendment) => void;
}

const AmendmentCard: React.FC<AmendmentCardProps> = ({ amendment, onViewDetails }) => {
  const tags = [
      amendment.ia_theme, 
      amendment.ia_type_mesure
  ].filter(Boolean);

  return (
    <div className="amendment-card">
      <div className="card-header">
         <h4 className="amendment-title">{amendment.ia_resume_mesure || 'Titre non disponible'}</h4>
         <div className="header-meta">
            <span className="amendment-number">{amendment.num}</span>
            <span className={`status-badge ${getStatusClass(amendment.sort)}`}>
              {amendment.sort || 'Statut inconnu'}
            </span>
         </div>
      </div>
      <div className="card-body">
        <div className="author-info">Auteur: <strong>{amendment.auteur}</strong> ({amendment.groupe})</div>
        <div className="article-info">Article: {amendment.article}</div>
        {amendment.ia_acteur_gagnant && <div className="actor-info winner">Gagnant : <strong>{amendment.ia_acteur_gagnant}</strong></div>}
        {amendment.ia_acteur_perdant && <div className="actor-info loser">Perdant : <strong>{amendment.ia_acteur_perdant}</strong></div>}
      </div>
      <div className="card-footer">
        <div className="ai-tags">
          {tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)}
        </div>
        <button onClick={() => onViewDetails(amendment)} className="details-button" aria-label="Voir les détails">
            <span className="material-icons">visibility</span>
        </button>
      </div>
    </div>
  );
};

export default AmendmentCard;
