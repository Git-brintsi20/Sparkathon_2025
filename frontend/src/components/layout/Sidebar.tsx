import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ChevronUp,
  Bell,
  Shield,
  Package,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Home,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Globe,
  Palette,
  Zap
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
  badgeColor?: 'primary' | 'success' | 'warning' | 'error';
  isActive?: boolean;
  subItems?: Array<{
    id: string;
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
    badge?: number;
    badgeColor?: 'primary' | 'success' | 'warning' | 'error';
  }>;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: Users,
    href: '/vendors',
    badge: 3,
    badgeColor: 'warning',
    subItems: [
      { id: 'all-vendors', label: 'All Vendors', href: '/vendors', icon: Users },
      { id: 'pending-approval', label: 'Pending Approval', href: '/vendors/pending', icon: Clock, badge: 3, badgeColor: 'warning' },
      { id: 'compliance-alerts', label: 'Compliance Alerts', href: '/vendors/alerts', icon: AlertTriangle, badge: 2, badgeColor: 'error' },
    ],
  },
  {
    id: 'deliveries',
    label: 'Deliveries',
    icon: Truck,
    href: '/deliveries',
    badge: 12,
    badgeColor: 'primary',
    subItems: [
      { id: 'active-deliveries', label: 'Active Deliveries', href: '/deliveries/active', icon: Activity, badge: 8, badgeColor: 'success' },
      { id: 'completed', label: 'Completed', href: '/deliveries/completed', icon: CheckCircle },
      { id: 'verification', label: 'Verification Queue', href: '/deliveries/verification', icon: Shield, badge: 4, badgeColor: 'warning' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    subItems: [
      { id: 'compliance-report', label: 'Compliance Report', href: '/analytics/compliance', icon: Shield },
      { id: 'fraud-detection', label: 'Fraud Detection', href: '/analytics/fraud', icon: AlertTriangle },
      { id: 'performance', label: 'Performance Metrics', href: '/analytics/performance', icon: TrendingUp },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    subItems: [
      { id: 'profile', label: 'Profile', href: '/settings/profile', icon: User },
      { id: 'system', label: 'System Config', href: '/settings/system', icon: Globe },
      { id: 'theme', label: 'Theme', href: '/settings/theme', icon: Palette },
    ],
  },
];

const quickActions = [
  { id: 'notifications', label: 'Notifications', icon: Bell, count: 5, color: 'error' },
  { id: 'compliance', label: 'Compliance', icon: Shield, color: 'success' },
  { id: 'inventory', label: 'Inventory', icon: Package, color: 'warning' },
  { id: 'trends', label: 'Trends', icon: TrendingUp, color: 'primary' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  isOpen = true,
  onToggle,
  isMobile = false
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['vendors']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quickActionsOpen, setQuickActionsOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track mouse position for hover effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Determine active item based on current path
  const getActiveItem = () => {
    for (const item of navItems) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (location.pathname === subItem.href) {
            return { main: item.id, sub: subItem.id };
          }
        }
      }
      if (location.pathname === item.href) {
        return { main: item.id, sub: null };
      }
    }
    return { main: 'dashboard', sub: null };
  };

  const { main: activeMainItem, sub: activeSubItem } = getActiveItem();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleQuickActions = () => {
    setQuickActionsOpen(prev => !prev);
  };

  const getBadgeColor = (color?: 'primary' | 'success' | 'warning' | 'error') => {
    switch (color) {
      case 'success':
        return 'bg-success/20 text-success border-success/30';
      case 'warning':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'error':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: {
      width: '280px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    closed: {
      width: isMobile ? '0px' : '80px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 35
      }
    },
    closed: {
      opacity: 0,
      y: 10,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 35
      }
    }
  };

  const subItemVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        staggerChildren: 0.03,
        delayChildren: 0.05
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  const quickActionsVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 35,
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  const hoverGlowVariants = {
    initial: { scale: 0, opacity: 0 },
    hover: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.aside
      ref={sidebarRef}
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className={cn(
        'fixed left-0 top-0 z-50 h-full overflow-hidden',
        'bg-card/95 backdrop-blur-xl border-r border-border/50',
        'shadow-2xl shadow-black/5',
        'flex flex-col',
        className
      )}
    >
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-card/80 to-muted/10 pointer-events-none" />
      
      {/* Animated border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="logo"
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex items-center space-x-3"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-5 h-5 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0"
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  className="text-sm font-semibold text-foreground bg-gradient-primary bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  Smart Vendor
                </motion.span>
                <motion.span
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                >
                  Compliance System
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'h-8 w-8 relative overflow-hidden',
              'hover:bg-accent/50 hover:shadow-glow',
              'transition-all duration-300'
            )}
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {isMobile ? (
                isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 relative px-3 py-4 overflow-y-auto scrollbar-hide">
        <motion.div
          variants={contentVariants}
          animate={isOpen ? 'open' : 'closed'}
          className="space-y-2"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Hover glow effect */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div
                    variants={hoverGlowVariants}
                    initial="initial"
                    animate="hover"
                    exit="initial"
                    className="absolute inset-0 bg-primary/10 rounded-xl blur-sm"
                  />
                )}
              </AnimatePresence>

              <Link to={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center w-full h-12 px-3 rounded-xl',
                    'transition-all duration-300 group',
                    'hover:bg-accent/50 hover:shadow-soft',
                    !isOpen && 'justify-center',
                    activeMainItem === item.id && [
                      'bg-gradient-primary text-white shadow-glow',
                      'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-primary before:opacity-10'
                    ]
                  )}
                  onClick={() => item.subItems && toggleExpanded(item.id)}
                >
                  <motion.div
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded-md',
                      activeMainItem === item.id ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.div
                        key={`${item.id}-content`}
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="flex-1 flex items-center justify-between ml-3"
                      >
                        <span className={cn(
                          'text-sm font-medium transition-colors',
                          activeMainItem === item.id ? 'text-white' : 'text-foreground'
                        )}>
                          {item.label}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={cn(
                                'text-xs px-2 py-1 rounded-full font-medium border',
                                getBadgeColor(item.badgeColor)
                              )}
                            >
                              {item.badge}
                            </motion.span>
                          )}
                          
                          {item.subItems && (
                            <motion.div
                              animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              className={cn(
                                'w-4 h-4 transition-colors',
                                activeMainItem === item.id ? 'text-white' : 'text-muted-foreground'
                              )}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              {/* Sub Items */}
              <AnimatePresence>
                {isOpen && item.subItems && expandedItems.includes(item.id) && (
                  <motion.div
                    variants={subItemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="ml-4 mt-2 space-y-1 overflow-hidden"
                  >
                    {item.subItems.map((subItem) => (
                      <motion.div
                        key={subItem.id}
                        variants={itemVariants}
                        className="relative"
                      >
                        <Link to={subItem.href}>
                          <motion.div
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              'flex items-center w-full h-10 px-3 rounded-lg',
                              'transition-all duration-300 group',
                              'hover:bg-accent/30 hover:shadow-soft',
                              activeSubItem === subItem.id && 'bg-primary/10 text-primary'
                            )}
                          >
                            <div className="flex items-center justify-center w-4 h-4 mr-3">
                              {subItem.icon ? (
                                <subItem.icon className="w-4 h-4" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground" />
                              )}
                            </div>
                            
                            <span className="text-sm text-muted-foreground group-hover:text-foreground flex-1">
                              {subItem.label}
                            </span>
                            
                            {subItem.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                  'text-xs px-1.5 py-0.5 rounded-full font-medium',
                                  getBadgeColor(subItem.badgeColor)
                                )}
                              >
                                {subItem.badge}
                              </motion.span>
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </nav>

      {/* Quick Actions Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm"
          >
            {/* Quick Actions Header with Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <motion.h4
                variants={itemVariants}
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center"
              >
                <Zap className="w-3 h-3 mr-1.5" />
                Quick Actions
              </motion.h4>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleQuickActions}
                  className="h-6 w-6 hover:bg-accent/50 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: quickActionsOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {/* Quick Actions Grid */}
            <AnimatePresence>
              {quickActionsOpen && (
                <motion.div
                  variants={quickActionsVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="px-4 pb-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            'flex flex-col items-center justify-center h-16 w-full',
                            'hover:bg-accent/50 hover:shadow-glow',
                            'transition-all duration-300 group relative overflow-hidden'
                          )}
                        >
                          <motion.div
                            className="flex items-center justify-center w-5 h-5 mb-1"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </motion.div>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                            {action.label}
                          </span>
                          
                          {action.count && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                            >
                              {action.count}
                            </motion.span>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Section */}
      <div className="relative px-4 py-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            className={cn(
              'w-full h-12 transition-all duration-300',
              'hover:bg-accent/50 hover:shadow-glow',
              'text-muted-foreground hover:text-foreground',
              !isOpen && 'justify-center px-2'
            )}
          >
            <motion.div
              className="flex items-center justify-center w-5 h-5"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <LogOut className="w-4 h-4" />
            </motion.div>
            
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  key="logout-label"
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="ml-3 text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </motion.aside>
  );
};