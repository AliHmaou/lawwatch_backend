import React from 'react';

interface Organe {
    prefixe: string;
    libelle: string;
    longLibelle: string;
}

interface NavItem {
    id: string;
    label: string;
}

interface HeaderProps {
    lastUpdateDate: string | null;
    loading: boolean;
    amendmentsExist: boolean;
    organesExamen: Organe[];
    organeCounts: Record<string, number>;
    selectedOrgane: string;
    onOrganeSelect: (organe: string) => void;
    navItems: NavItem[];
    activeView: string;
    onNavClick: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    lastUpdateDate,
    loading,
    amendmentsExist,
    organesExamen,
    organeCounts,
    selectedOrgane,
    onOrganeSelect,
    navItems,
    activeView,
    onNavClick
}) => {
    return (
        <header className="app-header">
            <div className="app-banner">
                <div className="banner-left">
                    <h1>Loi de Finances 2026</h1>
                    <p>Suivi des amendements en première lecture du PLF 2026 à l'Assemblée nationale</p>
                </div>
                {lastUpdateDate && !loading && (
                    <div className="last-update-info">
                        Dernière situation : <strong>{lastUpdateDate}</strong>
                    </div>
                )}
            </div>
            {!loading && amendmentsExist && (
                <div className="organe-selector-container">
                    <div className="organe-selector">
                        {organesExamen.filter(o => o.prefixe === 'TOUS' || organeCounts[o.prefixe]).map(organe => (
                            <button
                                key={organe.prefixe}
                                title={organe.longLibelle}
                                className={`organe-selector-button ${selectedOrgane === organe.prefixe ? 'active' : ''}`}
                                onClick={() => onOrganeSelect(organe.prefixe)}
                            >
                                {organe.libelle} ({organeCounts[organe.prefixe] || 0})
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <nav className="main-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`main-nav-button ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onNavClick(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Header;
