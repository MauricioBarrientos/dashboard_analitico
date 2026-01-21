import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarData {
  name: string;
  [key: string]: number | string;
}

interface StackedBarChartProps {
  data: BarData[];
  categories: string[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, categories }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  // Definir colores consistentes para las categorías
  const categoryColors: Record<string, string> = {
    marketing: '#8884d8',
    sales: '#82ca9d',
    support: '#ffc658',
    operations: '#ff8042',
    development: '#0088fe',
    revenue: '#0088fe',
    users: '#82ca9d',
    conversion: '#ffc658',
    sessions: '#ff8042',
    bounce: '#8884d8'
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="var(--chart-text-color)" fill="none" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={70}
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
            labelFormatter={(label) => `Categoría: ${label}`}
            contentStyle={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
            itemStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            height={36}
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            wrapperStyle={{
              color: 'var(--color-text-primary)',
              paddingBottom: '10px'
            }}
          />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId="a"
              name={category.charAt(0).toUpperCase() + category.slice(1)}
            >
              {data.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={categoryColors[category] || `hsl(${index * 72}, 70%, 50%)`}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;