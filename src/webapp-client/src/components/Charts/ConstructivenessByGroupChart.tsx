import React, { useMemo } from 'react';
import { Amendment } from '../../types';
import GenericChart from './GenericChart';

interface ChartProps {
  data: Amendment[];
  title: string;
}

const ConstructivenessByGroupChart: React.FC<ChartProps> = ({ data, title }) => {
    const chartData = useMemo(() => {
        const groupStats = data.reduce((acc: Record<string, { constructive: number, total: number }>, item) => {
            const group = item.groupe || 'Non affilié';
            if (!acc[group]) {
                acc[group] = { constructive: 0, total: 0 };
            }
            acc[group].total += 1;
            if (item.ia_constructivite === 'true') {
                acc[group].constructive += 1;
            }
            return acc;
        }, {} as Record<string, { constructive: number, total: number }>);

        const sortedGroups = Object.entries(groupStats)
            .map(([group, stats]: [string, { constructive: number, total: number }]) => ({
                group,
                rate: stats.total > 0 ? (stats.constructive / stats.total) * 100 : 0,
                total: stats.total
            }))
            .filter(item => item.total > 10)
            .sort((a, b) => b.rate - a.rate);

        const labels = sortedGroups.map(item => item.group);
        const values = sortedGroups.map(item => item.rate);

        return {
            labels,
            datasets: [{
                label: "Taux de constructivité (%)",
                data: values,
                backgroundColor: 'rgba(40, 167, 69, 0.6)',
                borderColor: 'var(--adopted-color)',
                borderWidth: 1,
            }]
        };
    }, [data]);

    const chartConfig = {
        type: 'bar' as const,
        data: chartData,
        options: {
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { beginAtZero: true, max: 100, ticks: { callback: (value: any) => value + '%' } } },
            plugins: { legend: { display: false } }
        },
    };

    return (
        <div className="card chart-card-half">
            <h3>{title}</h3>
            <GenericChart chartId="constructivenessChart" chartConfig={chartConfig} />
        </div>
    );
};

export default ConstructivenessByGroupChart;
