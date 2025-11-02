import React, { useMemo } from 'react';
import { Amendment } from '../../types';
import GenericChart from './GenericChart';

interface TopNChartProps {
  id: string;
  title: string;
  data: Amendment[];
  dataKey: keyof Amendment;
  topN?: number;
  excludeValues?: string[];
}

const TopNChart: React.FC<TopNChartProps> = ({ id, title, data, dataKey, topN = 10, excludeValues = [] }) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc: Record<string, number>, item) => {
      const value = item[dataKey] || 'Non renseigné';
      if (value && value !== 'Non renseigné') {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const lowercasedExcludes = excludeValues.map(v => v.toLowerCase());

    const sortedData = Object.entries(counts)
      .filter(([key]) => !lowercasedExcludes.includes(key.toLowerCase()))
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .slice(0, topN);
      
    const labels = sortedData.map(item => item[0]);
    const values = sortedData.map(item => item[1]);

    return {
      labels,
      datasets: [{
        label: `Nombre d'amendements`,
        data: values,
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        borderColor: 'var(--primary-color)',
        borderWidth: 1,
      }]
    };
  }, [data, dataKey, topN, excludeValues]);
  
  const chartConfig = {
    type: 'bar' as const,
    data: chartData,
    options: {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    },
  };
  
  return (
    <div className="card chart-card-half">
      <h3>{title}</h3>
      <GenericChart chartId={id} chartConfig={chartConfig} />
    </div>
  );
};

export default TopNChart;
