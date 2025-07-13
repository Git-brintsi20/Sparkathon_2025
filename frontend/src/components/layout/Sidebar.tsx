import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield,
  Package,
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
  isActive?: boolean;
  subItems?: Array<{
    id: string;
    label: string;
    href: string;
    isActive?: boolean;
  }>;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    isActive: true,
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: Users,
    href: '/vendors',
    badge: 3,
    subItems: [
      { id: 'all-vendors', label: 'All Vendors', href: '/vendors' },
      { id: 'pending-approval', label: 'Pending Approval', href: '/vendors/pending' },
      { id: 'compliance-alerts', label: 'Compliance Alerts', href: '/vendors/alerts' },
    ],
  },
  {
    id: 'deliveries',
    label: 'Deliveries',
    icon: Truck,
    href: '/deliveries',
    badge: 12,
    subItems: [
      { id: 'active-deliveries', label: 'Active Deliveries', href: '/deliveries/active' },
      { id: 'completed', label: 'Completed', href: '/deliveries/completed' },
      { id: 'verification', label: 'Verification Queue', href: '/deliveries/verification' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    subItems: [
      { id: 'compliance-report', label: 'Compliance Report', href: '/analytics/compliance' },
      { id: 'fraud-detection', label: 'Fraud Detection', href: '/analytics/fraud' },
      { id: 'performance', label: 'Performance Metrics', href: '/analytics/performance' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    subItems: [
      { id: 'profile', label: 'Profile', href: '/settings/profile' },
      { id: 'system', label: 'System Config', href: '/settings/system' },
      { id: 'theme', label: 'Theme', href: '/settings/theme' },
    ],
  },
];

const quickActions = [
  { id: 'notifications', label: 'Notifications', icon: Bell, count: 5 },
  { id: 'compliance', label: 'Compliance Check', icon: Shield },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
];

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  isOpen = true,
  onToggle,
  isMobile = false
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['vendors']);

  // Determine which item is active based on the current path
  const getActiveItem = () => {
    // Check sub-items first for more specific matches
    for (const item of navItems) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (location.pathname === subItem.href) {
            return subItem.id;
          }
        }
      }
    }
    // Then check main items
    for (const item of navItems) {
      if (location.pathname === item.href) {
        return item.id;
      }
    }
    return 'dashboard'; // Default or fallback
  };

  const activeItem = getActiveItem();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const sidebarVariants = {
    open: {
      width: isMobile ? '280px' : '280px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: isMobile ? '0px' : '80px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className={cn(
           'fixed left-0 top-0 z-50 h-full bg-card border-r border-border',
    'flex flex-col shadow-lg',
          
          className
          
        )}
        style={{
    // Ensure consistent positioning
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 50
  }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="logo"
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    Smart Vendor
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Compliance
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 hover:bg-accent"
          >
            {isMobile ? (
              isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />
            ) : (
              isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <Link to={item.href}>
                <Button
                  variant={activeItem === item.id ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-10',
                    !isOpen && 'justify-center px-2',
                    activeItem === item.id && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => item.subItems && toggleExpanded(item.id)}
                  asChild
                >
                  <div>
                    <item.icon className={cn('h-4 w-4', isOpen && 'mr-3')} />
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.span
                          key={`${item.id}-label`}
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="flex-1 text-left"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isOpen && item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto bg-accent text-accent-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                    {isOpen && item.subItems && (
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.div>
                    )}
                  </div>
                </Button>
              </Link>

              {/* Sub Items */}
              <AnimatePresence>
                {isOpen && item.subItems && expandedItems.includes(item.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 space-y-1"
                  >
                    {item.subItems.map((subItem) => (
                      <Link to={subItem.href} key={subItem.id}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 text-sm text-muted-foreground hover:text-foreground"
                          asChild
                        >
                          <div>
                            <div className="w-2 h-2 rounded-full bg-muted-foreground mr-3" />
                            {subItem.label}
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="px-4 py-4 border-t border-border"
            >
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center justify-center h-16 relative"
                  >
                    <action.icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{action.label}</span>
                    {action.count && (
                      <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {action.count}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start h-10 text-muted-foreground hover:text-foreground',
              !isOpen && 'justify-center px-2'
            )}
          >
            <LogOut className={cn('h-4 w-4', isOpen && 'mr-3')} />
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  key="logout-label"
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </>
  );
};