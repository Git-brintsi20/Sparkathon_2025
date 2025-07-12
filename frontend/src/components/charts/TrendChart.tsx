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
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/components/lib/utils';

export interface TrendDataPoint {
  [key: string]: string | number;
}

export interface TrendChartProps {
  title: string;
  data: TrendDataPoint[];
  xAxisKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showBrush?: boolean;
  showReferenceLines?: boolean;
  animate?: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'year';
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
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
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium text-popover-foreground mb-2">
          {formatLabel ? formatLabel(label as string) : label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
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

const CustomLegend = ({ payload }: { payload?: any[] }) => {
  if (!payload) return null;
  
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const TrendChart: React.FC<TrendChartProps> = ({
  title,
  data,
  xAxisKey,
  dataKeys,
  colors = DEFAULT_COLORS,
  height = 400,
  className,
  showLegend = true,
  showGrid = true,
  showBrush = false,
  showReferenceLines = false,
  animate = true,
  timeRange = 'day',
  formatValue,
  formatLabel,
}) => {
  const getStrokeWidth = (index: number) => {
    return index === 0 ? 3 : 2; // Main trend line is thicker
  };

  const getDashArray = (index: number) => {
    return index > 0 ? "5 5" : undefined; // Secondary lines are dashed
  };

  const getReferenceValue = () => {
    if (!showReferenceLines || !data.length) return null;
    
    const firstKey = dataKeys[0];
    const values = data.map(d => Number(d[firstKey])).filter(v => !isNaN(v));
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {timeRange.toUpperCase()}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          style={{ height: `${height}px` }}
          className="w-full transition-all duration-300 ease-in-out"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: showBrush ? 60 : 5 }}
            >
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
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                content={<CustomTooltip formatValue={formatValue} formatLabel={formatLabel} />}
              />
              {showLegend && (
                <Legend 
                  content={<CustomLegend />}
                />
              )}
              
              {/* Reference Line */}
              {showReferenceLines && getReferenceValue() && (
                <ReferenceLine 
                  y={getReferenceValue()} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="8 8"
                  strokeWidth={1}
                  opacity={0.6}
                />
              )}
              
              {/* Trend Lines */}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={getStrokeWidth(index)}
                  strokeDasharray={getDashArray(index)}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 2,
                    stroke: colors[index % colors.length],
                    fill: 'hsl(var(--background))'
                  }}
                  animationDuration={animate ? 1500 : 0}
                  animationEasing="ease-in-out"
                />
              ))}
              
              {/* Brush for zooming */}
              {showBrush && (
                <Brush
                  dataKey={xAxisKey}
                  height={30}
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Trend Indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            {dataKeys.map((key, index) => {
              const currentValue = data[data.length - 1]?.[key] as number;
              const previousValue = data[data.length - 2]?.[key] as number;
              const trend = currentValue > previousValue ? 'up' : 'down';
              const change = currentValue && previousValue 
                ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                : '0';
              
              return (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium">{key}</span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded",
                    trend === 'up' 
                      ? "bg-success/10 text-success" 
                      : "bg-error/10 text-error"
                  )}>
                    {trend === 'up' ? '↗' : '↘'} {change}%
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;