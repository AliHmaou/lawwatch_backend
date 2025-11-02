import React, { useMemo } from 'react';
import { Amendment } from '../types';
import KpiCard from '../components/Common/KpiCard';
import ExaminedAmendmentsTimelineChart from '../components/Charts/ExaminedAmendmentsTimelineChart';

const Dashboard: React.FC<{ amendments: Amendment[] }> = ({ amendments }) => {
  const kpis = useMemo(() => {
    const total = amendments.length;
    const examined = amendments.filter(a => a.sort !== 'Non examiné').length;
    const adopted = amendments.filter(a => a.sort === 'Adopté').length;
    const rejected = amendments.filter(a => a.sort.startsWith('Rejeté')).length;
    const fallen = amendments.filter(a => a.sort === 'Tombé').length;
    const notExamined = total - examined;
    return { total, examined, adopted, rejected, fallen, notExamined };
  }, [amendments]);

  return (
    <>
      <div className="kpi-grid">
        <KpiCard icon="summarize" value={kpis.total} label="Amendements déposés" iconClass="icon-total" />
        <KpiCard icon="gavel" value={kpis.examined} label="Amendements examinés" iconClass="icon-examined" />
        <KpiCard icon="check_circle" value={kpis.adopted} label="Adoptés" iconClass="icon-adopted" />
        <KpiCard icon="cancel" value={kpis.rejected} label="Rejetés" iconClass="icon-rejected" />
        <KpiCard icon="trending_down" value={kpis.fallen} label="Tombés" iconClass="icon-fallen" />
        <KpiCard icon="hourglass_empty" value={kpis.notExamined} label="Non examinés" iconClass="icon-non-examined" />
      </div>
      <ExaminedAmendmentsTimelineChart amendments={amendments} />
    </>
  );
};

export default Dashboard;
