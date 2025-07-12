import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type ChartType = 'line' | 'area' | 'bar' | 'pie';

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface MetricsChartProps {
  title: string;
  type: ChartType;
  data: ChartDataPoint[];
  xAxisKey: string;
  yAxisKey?: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

// Define common props for the Recharts components that actually use them
interface BaseChartComponentProps {
  data: ChartDataPoint[];
  xAxisKey: string;
  yAxisKey?: string; // Included as it's passed in chartProps, even if not always destructured
  dataKeys: string[];
  colors?: string[];
  showGrid?: boolean;
  animate?: boolean;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Type for CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // Recharts payload can be complex, 'any[]' is often used here
  label?: string | number;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  formatValue, 
  formatLabel 
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-popover-foreground mb-2">
          {formatLabel ? formatLabel(label as string) : label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {formatValue ? formatValue(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LineChartComponent: React.FC<BaseChartComponentProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors = DEFAULT_COLORS,
  showGrid = true,
  animate = true,
  formatValue,
  formatLabel,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      {showGrid && (
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
      )}
      <XAxis 
        dataKey={xAxisKey}
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip 
        content={<CustomTooltip formatValue={formatValue} formatLabel={formatLabel} />}
      />
      {dataKeys.map((key, index) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colors[index % colors.length]}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          animationDuration={animate ? 1000 : 0}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

const AreaChartComponent: React.FC<BaseChartComponentProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors = DEFAULT_COLORS,
  showGrid = true,
  animate = true,
  formatValue,
  formatLabel,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      {showGrid && (
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
      )}
      <XAxis 
        dataKey={xAxisKey}
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip 
        content={<CustomTooltip formatValue={formatValue} formatLabel={formatLabel} />}
      />
      {dataKeys.map((key, index) => (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          stackId="1"
          stroke={colors[index % colors.length]}
          fill={colors[index % colors.length]}
          fillOpacity={0.3}
          strokeWidth={2}
          animationDuration={animate ? 1000 : 0}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

const BarChartComponent: React.FC<BaseChartComponentProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors = DEFAULT_COLORS,
  showGrid = true,
  animate = true,
  formatValue,
  formatLabel,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      {showGrid && (
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
      )}
      <XAxis 
        dataKey={xAxisKey}
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis 
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip 
        content={<CustomTooltip formatValue={formatValue} formatLabel={formatLabel} />}
      />
      {dataKeys.map((key, index) => (
        <Bar
          key={key}
          dataKey={key}
          fill={colors[index % colors.length]}
          radius={[4, 4, 0, 0]}
          animationDuration={animate ? 1000 : 0}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

const PieChartComponent: React.FC<Pick<BaseChartComponentProps, 'data' | 'dataKeys' | 'colors' | 'animate' | 'formatValue'>> = ({
  data,
  dataKeys,
  colors = DEFAULT_COLORS,
  animate = true,
  formatValue,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey={dataKeys[0]}
        animationDuration={animate ? 1000 : 0}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip 
        content={<CustomTooltip formatValue={formatValue} />}
      />
    </PieChart>
  </ResponsiveContainer>
);

export const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  type,
  data,
  xAxisKey,
  yAxisKey,
  dataKeys,
  colors = DEFAULT_COLORS,
  height = 300,
  className,
  showLegend = false,
  showGrid = true,
  animate = true,
  formatValue,
  formatLabel,
}) => {
  // These are the props relevant to the actual chart components (Recharts)
  const chartProps: BaseChartComponentProps = { // Explicitly type chartProps
    data,
    xAxisKey,
    yAxisKey,
    dataKeys,
    colors,
    showGrid,
    animate,
    formatValue,
    formatLabel,
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChartComponent {...chartProps} />;
      case 'area':
        return <AreaChartComponent {...chartProps} />;
      case 'bar':
        return <BarChartComponent {...chartProps} />;
      case 'pie':
        // For PieChartComponent, we only pass the relevant subset of props
        const pieChartProps = {
          data,
          dataKeys,
          colors,
          animate,
          formatValue,
        };
        return <PieChartComponent {...pieChartProps} />;
      default:
        return <LineChartComponent {...chartProps} />;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          style={{ height: `${height}px` }}
          className="w-full transition-all duration-300 ease-in-out"
        >
          {renderChart()}
        </div>
        {showLegend && (
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {dataKeys.map((key, index) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
