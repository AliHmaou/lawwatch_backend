import React, { useState, useMemo } from 'react';
import { Amendment } from './types';
import { useAmendments } from './hooks/useAmendments';

// Import Layout Components
import Header from './components/Layout/Header';
import MainContent from './components/Layout/MainContent';
import Footer from './components/Layout/Footer';

// Import Constants
import { organesExamen, navItems } from './constants/navigation';

const App = () => {
  const { amendments, loading, error } = useAmendments();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedOrgane, setSelectedOrgane] = useState('AN');

  const lastUpdateDate = useMemo(() => {
    if (amendments.length === 0) return null;
      
    const firstValidDateString = amendments.find(a =>
        a.tmstmp_derniere_situation &&
        !isNaN(new Date(a.tmstmp_derniere_situation.replace(' ', 'T')).getTime())
    )?.tmstmp_derniere_situation;

    if (!firstValidDateString) return null;

    const date = new Date(firstValidDateString.replace(' ', 'T'));
    return date.toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short'
    });
  }, [amendments]);

  const organeCounts = useMemo(() => {
    const counts: Record<string, number> = { TOUS: amendments.length };
    amendments.forEach(am => {
        const prefixe = am.organe_examen_prefixe || 'NULL';
        counts[prefixe] = (counts[prefixe] || 0) + 1;
    });
    return counts;
  }, [amendments]);

  const filteredAmendments = useMemo(() => {
    if (selectedOrgane === 'TOUS') {
        return amendments;
    }
    return amendments.filter(am => am.organe_examen_prefixe === selectedOrgane);
  }, [amendments, selectedOrgane]);

  return (
    <div className="container">
      <Header
        lastUpdateDate={lastUpdateDate}
        loading={loading}
        amendmentsExist={amendments.length > 0}
        organesExamen={organesExamen}
        organeCounts={organeCounts}
        selectedOrgane={selectedOrgane}
        onOrganeSelect={setSelectedOrgane}
        navItems={navItems}
        activeView={activeView}
        onNavClick={setActiveView}
      />
      <main>
        <MainContent
          loading={loading}
          error={error}
          amendments={amendments}
          filteredAmendments={filteredAmendments}
          activeView={activeView}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;