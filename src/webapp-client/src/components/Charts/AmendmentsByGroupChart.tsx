import React, { useMemo } from 'react';
import { Amendment } from '../../types';
import { getStatusColor } from '../../utils/helpers';
import GenericChart from './GenericChart';

interface ChartProps {
  data: Amendment[];
  title: string;
}

const AmendmentsByGroupChart: React.FC<ChartProps> = ({ data, title }) => {
    const chartData = useMemo(() => {
        const groupStats: Record<string, Record<string, number>> = {};
        const allSorts = new Set<string>();

        for (const item of data) {
            const group = item.groupe || 'Non affilié';
            const sort = item.sort || 'Non renseigné';

            if (!groupStats[group]) {
                groupStats[group] = {};
            }
            if (!groupStats[group][sort]) {
                groupStats[group][sort] = 0;
            }
            groupStats[group][sort]++;
            allSorts.add(sort);
        }

        const sortedGroups = Object.entries(groupStats)
            .map(([group, sorts]) => ({
                group,
                total: Object.values(sorts).reduce((sum, count) => sum + count, 0),
                sorts
            }))
            .sort((a, b) => b.total - a.total);
            
        const labels = sortedGroups.map(item => item.group);
        const sortOrder = ['Adopté', 'Rejeté', 'Rejeté Article 40', 'Tombé', 'Retiré', 'Non soutenu', 'Non examiné'];
        const sortedSorts = Array.from(allSorts).sort((a, b) => {
            const indexA = sortOrder.indexOf(a);
            const indexB = sortOrder.indexOf(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        const datasets = sortedSorts.map(sort => {
            return {
                label: sort,
                data: sortedGroups.map(groupData => groupData.sorts[sort] || 0),
                backgroundColor: getStatusColor(sort),
            };
        });

        return {
            labels,
            datasets,
        };
    }, [data]);

    const chartConfig = {
        type: 'bar' as const,
        data: chartData,
        options: {
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, beginAtZero: true },
                y: { stacked: true }
            },
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    labels: {
                        padding: 10
                    }
                }
            }
        },
    };

    return (
        <div className="card chart-card-half">
            <h3>{title}</h3>
            <GenericChart chartId="amendmentsByGroupChart" chartConfig={chartConfig} />
        </div>
    );
};

export default AmendmentsByGroupChart;
