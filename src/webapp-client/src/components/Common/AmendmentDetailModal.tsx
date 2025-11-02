import React, { useEffect } from 'react';
import { Amendment } from '../../types';

interface AmendmentDetailModalProps {
  amendment: Amendment;
  onClose: () => void;
}

const AmendmentDetailModal: React.FC<AmendmentDetailModalProps> = ({ amendment, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const DetailItem = ({ label, value, isAI = false }: { label: string, value: string | undefined, isAI?: boolean }) => {
        if (!value) return null;
        return (
            <div className="detail-item">
                <span className="detail-label">{label} {isAI && <span className="ai-badge">IA</span>}</span>
                <span className="detail-value">{value}</span>
            </div>
        );
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Amendement N°{amendment.num}</h4>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Fermer">
                        <span className="material-icons">close</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p className="modal-title">{amendment.ia_resume_mesure}</p>
                    
                    <div className="detail-section">
                        <h5>Informations Générales</h5>
                        <DetailItem label="Article" value={amendment.article} />
                        <DetailItem label="Sort" value={amendment.sort} />
                        <DetailItem label="Rejeté Art. 40" value={amendment.rejet_art_40} />
                        <DetailItem label="Date de dépôt" value={amendment.amendement_date_depot ? new Date(amendment.amendement_date_depot).toLocaleDateString('fr-FR') : ''} />
                        <DetailItem label="Date de traitement" value={amendment.amendement_date_sort_est_traite ? new Date(amendment.amendement_date_sort_est_traite).toLocaleString('fr-FR') : ''} />
                    </div>

                    <div className="detail-section">
                        <h5>Auteur</h5>
                        <DetailItem label="Signataire" value={amendment.auteur} />
                        <DetailItem label="Groupe politique" value={amendment.groupe} />
                    </div>

                    <div className="detail-section ai-section">
                        <h5>Analyse par l'IA</h5>
                        <DetailItem label="Thème" value={amendment.ia_theme} isAI />
                        <DetailItem label="Type de mesure" value={amendment.ia_type_mesure} isAI />
                        <DetailItem label="Constructivité" value={amendment.ia_constructivite === 'true' ? 'Constructif' : 'Non constructif'} isAI />
                        <DetailItem label="Acteur gagnant" value={amendment.ia_acteur_gagnant} isAI />
                        <DetailItem label="Acteur perdant" value={amendment.ia_acteur_perdant} isAI />
                    </div>
                </div>
                <div className="modal-footer">
                     <a href={amendment.url} target="_blank" rel="noopener noreferrer" className="button-link">
                        <span className="material-icons">open_in_new</span>
                        Voir sur le site de l'Assemblée
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AmendmentDetailModal;
