import React, { useMemo } from 'react';
import { Amendment } from '../../types';
import GenericChart from './GenericChart';

interface ChartProps {
  data: Amendment[];
  title: string;
}

const TypeMesureChart: React.FC<ChartProps> = ({ data, title }) => {
    const chartData = useMemo(() => {
        const counts = data.reduce((acc: Record<string, number>, item) => {
            const impact = item.ia_type_mesure || 'Non précisé';
            if (impact !== 'Non précisé') {
                acc[impact] = (acc[impact] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        const values = labels.map(label => counts[label]);

        return {
            labels,
            datasets: [{
                data: values,
                backgroundColor: [
                  '#007bff', '#6c757d', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#fd7e14'
                ],
                borderWidth: 1,
            }],
        };
    }, [data]);

    const chartConfig = {
        type: 'doughnut' as const,
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' as const } }
        },
    };

    return (
        <div className="card chart-card-half">
            <h3>{title}</h3>
            <GenericChart chartId="budgetImpactChart" chartConfig={chartConfig} />
        </div>
    );
};

export default TypeMesureChart;
