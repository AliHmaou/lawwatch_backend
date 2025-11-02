import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

const GenericChart: React.FC<{ chartId: string; chartConfig: any }> = ({ chartId, chartConfig }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, chartConfig);
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartConfig]);

  return (
    <div className="chart-container">
      <canvas id={chartId} ref={chartRef}></canvas>
    </div>
  );
};

export default GenericChart;
