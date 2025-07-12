import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/components/lib/utils';

export interface ComplianceDataPoint {
  period: string;
  totalVendors: number;
  compliantVendors: number;
  nonCompliantVendors: number;
  complianceRate: number;
  riskScore: number;
  fraudIncidents: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
  deliveryRate: number;
  [key: string]: string | number;
}

export interface ComplianceChartProps {
  title: string;
  data: ComplianceDataPoint[];
  height?: number;
  className?: string;
  showTrends?: boolean;
  showRiskIndicators?: boolean;
  enableDrillDown?: boolean;
  onDataPointClick?: (data: ComplianceDataPoint) => void;
}

const COMPLIANCE_COLORS = {
  compliant: 'hsl(var(--chart-1))',
  nonCompliant: 'hsl(var(--chart-4))',
  complianceRate: 'hsl(var(--chart-2))',
  riskScore: 'hsl(var(--chart-3))',
  deliveryRate: 'hsl(var(--chart-5))',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-popover border border-border rounded-lg p-4 shadow-lg min-w-[200px]">
        <p className="font-medium text-popover-foreground mb-3 text-sm">
          {label}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Compliance Rate:</span>
            <span className={cn(
              "font-medium text-xs",
              data.complianceRate >= 90 ? "text-green-600" : 
              data.complianceRate >= 70 ? "text-yellow-600" : "text-red-600"
            )}>
              {data.complianceRate.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Compliant:</span>
            <span className="font-medium text-xs text-green-600">
              {data.compliantVendors}/{data.totalVendors}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Risk Score:</span>
            <span className={cn(
              "font-medium text-xs",
              data.riskScore <= 3 ? "text-green-600" : 
              data.riskScore <= 7 ? "text-yellow-600" : "text-red-600"
            )}>
              {data.riskScore}/10
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Delivery Rate:</span>
            <span className={cn(
              "font-medium text-xs",
              data.deliveryRate >= 95 ? "text-green-600" : 
              data.deliveryRate >= 85 ? "text-yellow-600" : "text-red-600"
            )}>
              {data.deliveryRate.toFixed(1)}%
            </span>
          </div>
          
          {data.fraudIncidents > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Fraud Incidents:</span>
              <span className="font-medium text-xs text-red-600">
                {data.fraudIncidents}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const ComplianceIndicator: React.FC<{ 
  value: number; 
  type: 'compliance' | 'risk' | 'delivery';
  label: string;
}> = ({ value, type, label }) => {
  const getColor = () => {
    switch (type) {
      case 'compliance':
        return value >= 90 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600';
      case 'risk':
        return value <= 3 ? 'text-green-600' : value <= 7 ? 'text-yellow-600' : 'text-red-600';
      case 'delivery':
        return value >= 95 ? 'text-green-600' : value >= 85 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'compliance':
        return value >= 90 ? 'bg-green-50' : value >= 70 ? 'bg-yellow-50' : 'bg-red-50';
      case 'risk':
        return value <= 3 ? 'bg-green-50' : value <= 7 ? 'bg-yellow-50' : 'bg-red-50';
      case 'delivery':
        return value >= 95 ? 'bg-green-50' : value >= 85 ? 'bg-yellow-50' : 'bg-red-50';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className={cn("p-3 rounded-lg", getBgColor())}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={cn("text-lg font-bold", getColor())}>
        {type === 'risk' ? `${value}/10` : `${value.toFixed(1)}%`}
      </div>
    </div>
  );
};

export const ComplianceChart: React.FC<ComplianceChartProps> = ({
  title,
  data,
  height = 400,
  className,
  showTrends = true,
  showRiskIndicators = true,
  enableDrillDown = false,
  onDataPointClick,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const summaryStats = useMemo(() => {
    if (!data.length) return null;
    
    const latest = data[data.length - 1];
    const avgCompliance = data.reduce((sum, item) => sum + item.complianceRate, 0) / data.length;
    const avgRisk = data.reduce((sum, item) => sum + item.riskScore, 0) / data.length;
    const avgDelivery = data.reduce((sum, item) => sum + item.deliveryRate, 0) / data.length;
    
    return {
      currentCompliance: latest.complianceRate,
      avgCompliance,
      currentRisk: latest.riskScore,
      avgRisk,
      currentDelivery: latest.deliveryRate,
      avgDelivery,
      totalFraudIncidents: data.reduce((sum, item) => sum + item.fraudIncidents, 0),
    };
  }, [data]);

  const handleBarClick = (data: any) => {
    if (enableDrillDown) {
      setSelectedPeriod(data.period);
      onDataPointClick?.(data);
    }
  };

  if (!data.length) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No compliance data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        
        {showRiskIndicators && summaryStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <ComplianceIndicator
              value={summaryStats.currentCompliance}
              type="compliance"
              label="Current Compliance"
            />
            <ComplianceIndicator
              value={summaryStats.currentRisk}
              type="risk"
              label="Current Risk Score"
            />
            <ComplianceIndicator
              value={summaryStats.currentDelivery}
              type="delivery"
              label="Current Delivery Rate"
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div 
          style={{ height: `${height}px` }}
          className="w-full transition-all duration-300 ease-in-out"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              
              <XAxis 
                dataKey="period"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Vendors', angle: -90, position: 'insideLeft' }}
              />
              
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Rate (%)', angle: 90, position: 'insideRight' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              
              <Bar
                yAxisId="left"
                dataKey="compliantVendors"
                name="Compliant Vendors"
                fill={COMPLIANCE_COLORS.compliant}
                radius={[2, 2, 0, 0]}
                onClick={handleBarClick}
                className={enableDrillDown ? "cursor-pointer" : ""}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`compliant-${index}`}
                    fill={selectedPeriod === entry.period ? 
                      `${COMPLIANCE_COLORS.compliant}CC` : 
                      COMPLIANCE_COLORS.compliant
                    }
                  />
                ))}
              </Bar>
              
              <Bar
                yAxisId="left"
                dataKey="nonCompliantVendors"
                name="Non-Compliant Vendors"
                fill={COMPLIANCE_COLORS.nonCompliant}
                radius={[2, 2, 0, 0]}
                onClick={handleBarClick}
                className={enableDrillDown ? "cursor-pointer" : ""}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`noncompliant-${index}`}
                    fill={selectedPeriod === entry.period ? 
                      `${COMPLIANCE_COLORS.nonCompliant}CC` : 
                      COMPLIANCE_COLORS.nonCompliant
                    }
                  />
                ))}
              </Bar>
              
              {showTrends && (
                <>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="complianceRate"
                    name="Compliance Rate"
                    stroke={COMPLIANCE_COLORS.complianceRate}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="deliveryRate"
                    name="Delivery Rate"
                    stroke={COMPLIANCE_COLORS.deliveryRate}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {summaryStats && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-3">Summary Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Avg Compliance:</span>
                <span className="ml-2 font-medium">
                  {summaryStats.avgCompliance.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Risk:</span>
                <span className="ml-2 font-medium">
                  {summaryStats.avgRisk.toFixed(1)}/10
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Delivery:</span>
                <span className="ml-2 font-medium">
                  {summaryStats.avgDelivery.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Fraud:</span>
                <span className="ml-2 font-medium text-red-600">
                  {summaryStats.totalFraudIncidents}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceChart;