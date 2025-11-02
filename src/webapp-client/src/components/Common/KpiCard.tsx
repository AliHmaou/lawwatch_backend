import React from 'react';

interface KpiCardProps {
  icon: string;
  value: number | string;
  label: string;
  iconClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, value, label, iconClass }) => (
  <div className="card kpi-card">
    <div className={`material-icons ${iconClass}`}>{icon}</div>
    <div className="info">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export default KpiCard;
