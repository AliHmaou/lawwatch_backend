import React, { useState, useMemo } from 'react';
import { Amendment, Filter } from '../types';
import { useFilteredAmendments } from '../hooks/useFilteredAmendments';
import FilterComponent from '../components/Common/FilterComponent';
import KpiCard from '../components/Common/KpiCard';
import AmendmentsByGroupChart from '../components/Charts/AmendmentsByGroupChart';
import ConstructivenessByGroupChart from '../components/Charts/ConstructivenessByGroupChart';
import TypeMesureChart from '../components/Charts/TypeMesureChart';
import TopNChart from '../components/Charts/TopNChart';

const StatsView: React.FC<{ allAmendments: Amendment[], amendments: Amendment[] }> = ({ allAmendments, amendments }) => {
    const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
    const [searchText, setSearchText] = useState('');
    const filteredAmendments = useFilteredAmendments(amendments, activeFilters, searchText);
    
    const examinedAmendments = useMemo(() => 
        filteredAmendments.filter(a => a.sort !== 'Non examiné'), 
    [filteredAmendments]);

    const adoptionRate = useMemo(() => {
        const adoptedCount = filteredAmendments.filter(a => a.sort === 'Adopté').length;
        if (examinedAmendments.length === 0) return '0.0';
        return ((adoptedCount / examinedAmendments.length) * 100).toFixed(1);
    }, [filteredAmendments, examinedAmendments]);

    const uniqueAuthors = useMemo(() => {
        return new Set(filteredAmendments.map(a => a.auteur)).size;
    }, [filteredAmendments]);

    return (
        <>
            <div className="stats-header">
                <h2>Statistiques Clés ({filteredAmendments.length})</h2>
                <FilterComponent
                    amendments={allAmendments}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </div>
            <div className="kpi-grid stats-kpi-grid">
                 <KpiCard icon="handshake" value={`${adoptionRate}%`} label="Taux d'adoption" iconClass="icon-constructiveness" />
                 <KpiCard icon="groups" value={uniqueAuthors} label="Signataires uniques" iconClass="icon-authors" />
            </div>
            <div className="dashboard-grid">
                <AmendmentsByGroupChart data={filteredAmendments} title="Amendements par groupe et par sort" />
                <ConstructivenessByGroupChart data={examinedAmendments} title="Constructivité par groupe politique" />
                <TypeMesureChart data={filteredAmendments} title="Répartition par type de mesure (IA)" />
                <TopNChart id='topThemesChart' title='Top 10 des thèmes abordés (IA)' data={filteredAmendments} dataKey='ia_theme' />
                <TopNChart id='topAuthorsChart' title='Top 10 Auteurs (tous amendements)' data={filteredAmendments} dataKey='auteur' />
                <TopNChart id='topWinnersChart' title='Top 10 Acteurs Gagnants (hors État)' data={filteredAmendments} dataKey='ia_acteur_gagnant' excludeValues={['Etat', 'État']} />
                <TopNChart id='topLosersChart' title='Top 10 Acteurs Perdants (hors État)' data={filteredAmendments} dataKey='ia_acteur_perdant' excludeValues={['Etat', 'État']} />
            </div>
        </>
    );
};

export default StatsView;
