import React from 'react';
import { Amendment } from '../../types';

// Import Views
import Dashboard from '../../views/Dashboard';
import AmendmentList from '../../views/AmendmentList';
import StatsView from '../../views/StatsView';
import StaticPage from '../Common/StaticPage';
import TestView from '../../views/TestView';

// Import content
import { sourcesContent, datasetContent, codeContent, aboutContent } from '../../constants/content';

interface MainContentProps {
    loading: boolean;
    error: string | null;
    amendments: Amendment[];
    filteredAmendments: Amendment[];
    activeView: string;
}

const MainContent: React.FC<MainContentProps> = ({ loading, error, amendments, filteredAmendments, activeView }) => {
    if (loading) {
        return <div className="loader"><div className="spinner"></div></div>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }
    if (amendments.length === 0 && !loading) {
        return <div className="card"><p>Aucun amendement trouvé dans les données.</p></div>
    }

    switch (activeView) {
        case 'dashboard':
            return <Dashboard amendments={filteredAmendments} />;
        case 'amendements':
            return <AmendmentList allAmendments={amendments} amendments={filteredAmendments} />;
        case 'stats':
            return <StatsView allAmendments={amendments} amendments={filteredAmendments} />;
        case 'sources':
            return <StaticPage content={sourcesContent} title="Les sources" />;
        case 'dataset':
            return <StaticPage content={datasetContent} title="Le dataset" />;
        case 'code':
            return <StaticPage content={codeContent} title="Le code" />;
        case 'about':
            return <StaticPage content={aboutContent} title="À propos" />;
        case 'test':
            return <TestView />;
        default:
            return <Dashboard amendments={filteredAmendments} />;
    }
};

export default MainContent;
