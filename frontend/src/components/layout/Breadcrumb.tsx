import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Home,
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: React.ComponentType<any>;
}

interface EllipsisItem {
  label: string;
  isEllipsis: true;
}

type DisplayItem = BreadcrumbItem | EllipsisItem;

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  maxItems?: number;
  showHomeIcon?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  maxItems = 4,
  showHomeIcon = true,
  showBackButton = false,
  onBackClick,
  separator = <ChevronRight className="h-3 w-3 text-muted-foreground" />
}) => {
  // Handle breadcrumb overflow
  const getDisplayItems = (): DisplayItem[] => {
    if (items.length <= maxItems) {
      return items;
    }

    const activeIndex = items.findIndex(item => item.isActive);
    const lastItem = items[items.length - 1];
    
    if (activeIndex === -1) {
      // No active item, show first few and last
      return [
        ...items.slice(0, maxItems - 2),
        { label: '...', isEllipsis: true as const },
        lastItem
      ];
    }

    if (activeIndex < maxItems - 1) {
      // Active item is near the beginning
      return [
        ...items.slice(0, maxItems - 1),
        { label: '...', isEllipsis: true as const }
      ];
    }

    // Active item is at the end, show first, ellipsis, and last few
    return [
      items[0],
      { label: '...', isEllipsis: true as const },
      ...items.slice(-(maxItems - 2))
    ];
  };

  const displayItems = getDisplayItems();

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  const separatorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const isEllipsisItem = (item: DisplayItem): item is EllipsisItem => {
    return 'isEllipsis' in item;
  };

  return (
    <nav
      className={cn(
        'flex items-center space-x-2 text-sm',
        className
      )}
      aria-label="Breadcrumb"
    >
      {/* Back Button */}
      {showBackButton && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="h-8 px-2 mr-2 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Home Icon */}
      {showHomeIcon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-accent"
            onClick={() => window.location.href = '/dashboard'}
          >
            <Home className="h-4 w-4 text-muted-foreground" />
          </Button>
        </motion.div>
      )}

      {/* Breadcrumb Items */}
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {/* Separator */}
            {(index > 0 || showHomeIcon) && (
              <motion.span
                variants={separatorVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center"
              >
                {separator}
              </motion.span>
            )}

            {/* Breadcrumb Item */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              {isEllipsisItem(item) ? (
                <span className="flex items-center justify-center w-8 h-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </span>
              ) : item.href && !item.isActive ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 px-2 font-normal hover:bg-accent',
                    'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={() => window.location.href = item.href!}
                >
                  <div className="flex items-center space-x-1">
                    {item.icon && <item.icon className="h-3 w-3" />}
                    <span>{item.label}</span>
                  </div>
                </Button>
              ) : (
                <span
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded text-sm',
                    item.isActive
                      ? 'text-foreground font-medium bg-accent/50'
                      : 'text-muted-foreground'
                  )}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.icon && <item.icon className="h-3 w-3" />}
                  <span>{item.label}</span>
                </span>
              )}
            </motion.div>
          </li>
        ))}
      </ol>
    </nav>
  );
};