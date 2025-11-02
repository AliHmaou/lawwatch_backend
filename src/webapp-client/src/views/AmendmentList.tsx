import React, { useState, useEffect, useMemo } from 'react';
import { Amendment, Filter } from '../types';
import { useFilteredAmendments } from '../hooks/useFilteredAmendments';
import AmendmentCard from '../components/Common/AmendmentCard';
import AmendmentDetailModal from '../components/Common/AmendmentDetailModal';
import FilterComponent from '../components/Common/FilterComponent';

const ITEMS_PER_PAGE = 12;

const AmendmentList: React.FC<{ allAmendments: Amendment[], amendments: Amendment[] }> = ({ allAmendments, amendments }) => {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAmendment, setSelectedAmendment] = useState<Amendment | null>(null);

  const filteredAmendments = useFilteredAmendments(amendments, activeFilters, searchText);
  
  useEffect(() => {
      setCurrentPage(1);
  }, [activeFilters, searchText, amendments]);

  const paginatedAmendments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAmendments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAmendments, currentPage]);

  const totalPages = Math.ceil(filteredAmendments.length / ITEMS_PER_PAGE);

  return (
    <div className="card list-card">
      <div className="table-header">
        <h3>Liste des Amendements ({filteredAmendments.length})</h3>
        <FilterComponent
            amendments={allAmendments}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            searchText={searchText}
            setSearchText={setSearchText}
        />
      </div>
      <div className="amendment-list">
        {paginatedAmendments.map((am, index) => (
          <AmendmentCard key={`${am.num}-${index}`} amendment={am} onViewDetails={setSelectedAmendment} />
        ))}
        {paginatedAmendments.length === 0 && <p>Aucun amendement ne correspond à vos critères de recherche.</p>}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <span className="material-icons">chevron_left</span>
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      )}
      {selectedAmendment && <AmendmentDetailModal amendment={selectedAmendment} onClose={() => setSelectedAmendment(null)} />}
    </div>
  );
};

export default AmendmentList;
