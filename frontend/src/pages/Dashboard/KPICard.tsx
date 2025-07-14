import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/components/lib/utils';
import { Shield, ExternalLink } from 'lucide-react';

interface BlockchainVerification {
  isVerified: boolean;
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: string;
}

// Update the KPICardProps interface to include blockchain prop
interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'emerald' | 'red';
  className?: string;
  loading?: boolean;
  blockchain?: BlockchainVerification; // Add this line
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  format = 'number',
  icon,
  trend,
  trendLabel,
  color = 'blue',
  className,
  loading = false,
    blockchain
}) => {
  const formatValue = (val: number): string => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    
    // For large numbers, add commas
    if (val >= 1000) {
      return val.toLocaleString();
    }
    
    return val.toString();
  };

// Add this function after the formatValue function
const truncateHash = (hash: string): string => {
  if (hash.length <= 10) return hash;
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};


  const getDisplayValue = (): string => {
    if (format === 'currency') {
      return formatValue(value);
    }
    return `${prefix}${formatValue(value)}${suffix}`;
  };

  const colorVariants = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2
      }
    }
  };

  const valueVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.3
      }
    }
  };

  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-6 w-6 bg-muted rounded"></div>
            </div>
            <div className="h-8 bg-muted rounded w-24 mb-2"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={cn('relative overflow-hidden', className)}
    >
      <Card className={cn(
        'relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300',
        colorVariants[color].border
      )}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            {icon && (
              <motion.div
                variants={iconVariants}
                className={cn(
                  'p-2 rounded-full',
                  colorVariants[color].bg,
                  colorVariants[color].icon
                )}
              >
                {icon}
              </motion.div>
            )}
          </div>

          {/* Value */}
          <motion.div
            variants={valueVariants}
            className="mb-2"
          >
            <div className="text-2xl font-bold text-foreground">
              {getDisplayValue()}
            </div>
          </motion.div>

          {/* Trend */}
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
              {trendLabel && (
                <span className="text-xs text-muted-foreground">
                  {trendLabel}
                </span>
              )}
            </div>
          )}

          {/* Blockchain Verification Badge */}
          {blockchain?.isVerified && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      Blockchain Verified
                    </span>
                  </div>
                </div>
                {blockchain.transactionHash && (
                  <button
                    onClick={() => window.open(`https://etherscan.io/tx/${blockchain.transactionHash}`, '_blank')}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>{truncateHash(blockchain.transactionHash)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              {blockchain.blockNumber && (
                <div className="text-xs text-muted-foreground mt-1">
                  Block #{blockchain.blockNumber?.toLocaleString()}
                </div>
              )}
            </div>
          )}


          {/* Background decoration */}
          <div className={cn(
            'absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10',
            colorVariants[color].bg
          )} />
        </CardContent>
      </Card>
    </motion.div>
  );
};