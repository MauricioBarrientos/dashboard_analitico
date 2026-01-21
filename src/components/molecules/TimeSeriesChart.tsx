import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  Area,
  AreaChart
} from 'recharts';

interface TimeSeriesData {
  date: string;
  [key: string]: number | string;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  metrics: string[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, metrics }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="var(--chart-text-color)" fill="none" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{
              fontSize: 12,
              fill: 'var(--chart-text-color)',
              fillOpacity: 1
            }}
            tickLine={{ stroke: 'var(--chart-text-color)' }}
            axisLine={{ stroke: 'var(--chart-text-color)' }}
          />
          <YAxis
            tick={{
              fill: 'var(--chart-text-color)',
              fillOpacity: 1
            }}
            tickLine={{ stroke: 'var(--chart-text-color)' }}
            axisLine={{ stroke: 'var(--chart-text-color)' }}
          />
          <Tooltip
            formatter={(value) => [value, 'Valor']}
            labelFormatter={(label) => `Fecha: ${label}`}
            contentStyle={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
            itemStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              color: 'var(--color-text-primary)'
            }}
          />
          <Brush
            dataKey="date"
            height={30}
            stroke="var(--chart-text-color)"
            fill="var(--color-bg-secondary)"
          />
          {metrics.map((metric, index) => (
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              stackId="1"
              stroke={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'][index % 5]}
              fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'][index % 5]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;