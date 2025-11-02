import React, { useMemo } from 'react';
import { Amendment } from '../../types';
import GenericChart from './GenericChart';


const ExaminedAmendmentsTimelineChart: React.FC<{ amendments: Amendment[] }> = ({ amendments }) => {
    const chartConfig = useMemo(() => {
        const events: { date: Date }[] = [];
        for (const am of amendments) {
            if (am.amendement_date_sort_est_traite) {
                const date = new Date(am.amendement_date_sort_est_traite.replace(' ', 'T'));
                if (!isNaN(date.getTime())) {
                    events.push({ date });
                }
            }
        }

        if (events.length === 0) return null;

        const hourlyData = new Map<string, number>();
        for (const event of events) {
            const date = event.date;
            date.setMinutes(0, 0, 0); 
            const hourKey = date.toISOString();
            hourlyData.set(hourKey, (hourlyData.get(hourKey) || 0) + 1);
        }
        
        const sortedHoursWithData = Array.from(hourlyData.keys()).sort();
        
        if (sortedHoursWithData.length === 0) return null;

        const minDate = new Date(sortedHoursWithData[0]);
        const maxExaminedDate = new Date(sortedHoursWithData[sortedHoursWithData.length - 1]);
        
        let timelineEndDate = maxExaminedDate;
        const situationDateString = amendments.find(a => a.tmstmp_derniere_situation)?.tmstmp_derniere_situation;
        if (situationDateString) {
            const situationDate = new Date(situationDateString.replace(' ', 'T'));
            if (!isNaN(situationDate.getTime()) && situationDate > maxExaminedDate) {
                timelineEndDate = situationDate;
            }
        }
        
        const chartEndDate = new Date(timelineEndDate.getTime());
        chartEndDate.setHours(chartEndDate.getHours() + 1, 0, 0, 0);

        const examinedPoints: { x: string; y: number }[] = [];
        let cumulativeExamined = 0;
        const currentHour = new Date(minDate.getTime());

        while (currentHour <= chartEndDate) {
            const hourKey = currentHour.toISOString();
            const countForHour = hourlyData.get(hourKey) || 0;
            cumulativeExamined += countForHour;
            examinedPoints.push({ x: hourKey, y: cumulativeExamined });
            
            currentHour.setTime(currentHour.getTime() + 60 * 60 * 1000);
        }
        
        const totalDeposited = amendments.length;

        const totalDepositedData = [
            { x: minDate.toISOString(), y: totalDeposited },
            { x: chartEndDate.toISOString(), y: totalDeposited }
        ];

        return {
            type: 'line' as const,
            data: {
                datasets: [
                    {
                        label: 'Examinés (cumul)',
                        data: examinedPoints,
                        borderColor: 'var(--primary-color)',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        segment: {
                            borderDash: (ctx: any) => {
                                if (ctx.p0.parsed.y === ctx.p1.parsed.y) {
                                    return [6, 6];
                                }
                                return undefined;
                            }
                        }
                    },
                    {
                        label: 'Total Déposés',
                        data: totalDepositedData,
                        borderColor: 'var(--text-secondary-color)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                    x: {
                        type: 'timeseries' as const,
                        time: {
                            unit: 'hour',
                            tooltipFormat: 'dd MMM yyyy, HH:mm',
                            displayFormats: {
                                hour: 'dd MMM HH:mm'
                            }
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }
                },
                plugins: {
                    legend: { position: 'top' as const },
                },
                interaction: {
                    intersect: false,
                    mode: 'index' as const,
                },
            },
        };
    }, [amendments]);

    return (
        <div className="card chart-card-full">
            <h3>Évolution du volume d'amendements examinés (par heure)</h3>
            {chartConfig ? (
                <GenericChart chartId="timelineChart" chartConfig={chartConfig} />
            ) : (
                <p>Aucune donnée de date de traitement disponible pour afficher le graphique.</p>
            )}
        </div>
    );
};

export default ExaminedAmendmentsTimelineChart;
