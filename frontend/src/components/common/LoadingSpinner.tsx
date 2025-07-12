import React from 'react';
import { cn } from '@/components/lib/utils';

interface LoadingSpinnerProps {
  variant?: 'default' | 'dots' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'default',
  size = 'md',
  className,
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-bounce',
              sizeClasses[size],
              colorClasses[color],
              'bg-current'
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'rounded-full animate-pulse',
          sizeClasses[size],
          colorClasses[color],
          'bg-current opacity-75',
          className
        )}
        style={{
          animationDuration: '1s'
        }}
      />
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse',
              colorClasses[color],
              'bg-current'
            )}
            style={{
              width: size === 'sm' ? '2px' : size === 'md' ? '3px' : size === 'lg' ? '4px' : '5px',
              height: size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px',
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{
        animationDuration: '1s'
      }}
    />
  );
};

// Full page loading component
export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <LoadingSpinner variant="default" size="lg" />
    <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
  </div>
);

// Inline loading component
export const InlineLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center space-x-2 py-2">
    <LoadingSpinner variant="default" size="sm" />
    <span className="text-sm text-muted-foreground">{message}</span>
  </div>
);

// Button loading state
export const ButtonLoading: React.FC = () => (
  <LoadingSpinner variant="default" size="sm" className="mr-2" />
);