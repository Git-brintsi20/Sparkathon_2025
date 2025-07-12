import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/components/lib/utils';

export interface DonutDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  title: string;
  data: DonutDataPoint[];
  colors?: string[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentage?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  animate?: boolean;
  centerContent?: React.ReactNode;
  formatValue?: (value: number) => string;
  onSegmentClick?: (data: DonutDataPoint) => void;
}

const DEFAULT_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  formatValue?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, formatValue }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
    
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-sm font-medium text-popover-foreground">
            {data.name}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">Value:</span>
            <span className="text-sm font-medium">
              {formatValue ? formatValue(data.value) : data.value}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">Percentage:</span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: { payload?: any[] }) => {
  if (!payload) return null;
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground truncate">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  showLabels,
  showPercentage,
}: any) => {
  if (!showLabels && !showPercentage) return null;
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Only show label if segment is large enough
  if (percent < 0.05) return null;
  
  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--background))"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
    >
      {showPercentage ? `${(percent * 100).toFixed(0)}%` : name}
    </text>
  );
};

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  colors = DEFAULT_COLORS,
  height = 300,
  className,
  showLegend = true,
  showLabels = false,
  showPercentage = true,
  innerRadius = 60,
  outerRadius = 100,
  animate = true,
  centerContent,
  formatValue,
  onSegmentClick,
}) => {
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add total to each data point for tooltip
  const dataWithTotal = data.map(item => ({
    ...item,
    total,
    color: item.color || colors[data.indexOf(item) % colors.length]
  }));
  
  const getCenterContent = () => {
    if (centerContent) return centerContent;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatValue ? formatValue(total) : total}
          </div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </div>
    );
  };
  
  const handleSegmentClick = (data: any) => {
    if (onSegmentClick) {
      onSegmentClick(data);
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
          className="w-full transition-all duration-300 ease-in-out relative"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => renderCustomLabel({
                  ...props,
                  showLabels,
                  showPercentage
                })}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={animate ? 1000 : 0}
                onClick={handleSegmentClick}
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    style={{
                      cursor: onSegmentClick ? 'pointer' : 'default',
                      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
              {showLegend && <Legend content={<CustomLegend />} />}
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Content */}
          {getCenterContent()}
        </div>
        
        {/* Stats Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dataWithTotal.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatValue ? formatValue(item.value) : item.value} ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {data.length} categories • {formatValue ? formatValue(total) : total} total
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChart;