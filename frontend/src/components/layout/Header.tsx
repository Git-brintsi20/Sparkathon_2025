import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Breadcrumb } from './Breadcrumb';
import {
  Search,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  Palette,
  ChevronDown,
  LogOut,
  Shield,
  HelpCircle,
  Menu,
  X,
  Filter,
  Calendar,
  Download,
  Command,
  Globe,
  Star,
  Zap
} from 'lucide-react';

// Define the props that the Header will receive from the Layout
interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface HeaderProps {
  onMenuToggle: () => void;
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Compliance Alert',
    message: 'Vendor ABC Corp requires document verification',
    time: '2 minutes ago',
    type: 'warning',
    isRead: false,
  },
  {
    id: '2',
    title: 'Delivery Completed',
    message: 'Order #12345 has been successfully delivered',
    time: '1 hour ago',
    type: 'success',
    isRead: false,
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New fraud detection algorithms deployed',
    time: '3 hours ago',
    type: 'info',
    isRead: true,
  },
  {
    id: '4',
    title: 'Critical Alert',
    message: 'Suspicious activity detected on vendor XYZ',
    time: '5 hours ago',
    type: 'error',
    isRead: false,
  },
];

const themeOptions = [
  { value: 'default', label: 'Ocean Blue', color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
  { value: 'purple', label: 'Royal Purple', color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' },
  { value: 'emerald', label: 'Forest Green', color: 'bg-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
  { value: 'amber', label: 'Golden Amber', color: 'bg-amber-500', gradient: 'from-amber-400 to-amber-600' },
  { value: 'rose', label: 'Sunset Rose', color: 'bg-rose-500', gradient: 'from-rose-400 to-rose-600' },
];

const quickSearchFilters = [
  { label: 'Vendors', icon: Shield, shortcut: 'V' },
  { label: 'Recent', icon: Calendar, shortcut: 'R' },
  { label: 'Compliance', icon: Shield, shortcut: 'C' },
  { label: 'Analytics', icon: Star, shortcut: 'A' },
];

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  pageTitle,
  pageDescription,
  breadcrumbs,
  headerActions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter(n => !n.isRead).length
  );

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    setShowThemeMenu(false);
    // Apply theme logic here
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Apply dark mode logic here
  };

  const markNotificationAsRead = (id: string) => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      },
    },
  };

  const notificationVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.15 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
  };

  const searchVariants = {
    collapsed: {
      width: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    expanded: {
      width: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return '📄';
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/50',
        'bg-background/80 backdrop-blur-xl',
        'shadow-sm shadow-black/5'
      )}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/98 to-background/95" />
      
      <div className="relative flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section - Menu & Breadcrumbs */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <Button 
              size="icon" 
              variant="ghost"
              onClick={onMenuToggle}
              className={cn(
                'h-9 w-9 rounded-xl',
                'hover:bg-accent/50 hover:shadow-glow',
                'transition-all duration-300'
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </motion.div>

          {/* Desktop Breadcrumbs */}
          <AnimatePresence mode="wait">
            {breadcrumbs && (
              <motion.div
                key="breadcrumbs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="hidden md:flex"
              >
                <Breadcrumb items={breadcrumbs} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Title for Mobile */}
          {pageTitle && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="md:hidden"
            >
              <h1 className="text-lg font-semibold text-foreground truncate max-w-[200px]">
                {pageTitle}
              </h1>
            </motion.div>
          )}
        </div>

        {/* Center Section - Search */}
        <motion.div 
          ref={searchRef}
          className="flex-1 max-w-2xl mx-4 sm:mx-8"
          variants={searchVariants}
          animate={isSearchFocused ? 'expanded' : 'collapsed'}
        >
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" />
              <Input
                type="text"
                placeholder="Search vendors, deliveries, analytics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className={cn(
                  'pl-10 pr-12 h-10 rounded-xl',
                  'bg-background/50 backdrop-blur-sm',
                  'border-border/50 hover:border-border',
                  'focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                  'transition-all duration-300',
                  'placeholder:text-muted-foreground/70'
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                {isSearching && <LoadingSpinner size="sm" />}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground/60"
                >
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Quick Search Filters */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full left-0 right-0 mt-2 p-3 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-[60]"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickSearchFilters.map((filter, index) => (
                      <motion.div
                        key={filter.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            'h-8 px-3 rounded-lg',
                            'hover:bg-accent/50 hover:shadow-glow',
                            'transition-all duration-200'
                          )}
                        >
                          <filter.icon className="h-3 w-3 mr-1.5" />
                          {filter.label}
                          <span className="ml-1.5 text-xs text-muted-foreground/60">
                            {filter.shortcut}
                          </span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>Press Enter to search or use shortcuts</span>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Header Actions from page */}
          <AnimatePresence mode="wait">
            {headerActions && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden sm:flex items-center space-x-2 mr-2"
              >
                {headerActions}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Selector */}
          <div className="relative" ref={themeMenuRef}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={cn(
                  'h-9 w-9 rounded-xl',
                  'hover:bg-accent/50 hover:shadow-glow',
                  'transition-all duration-300'
                )}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </motion.div>
            
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 top-full mt-2 w-52 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-[60]"
                >
                  <div className="p-3 space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">
                      Color Themes
                    </h4>
                    {themeOptions.map((theme, index) => (
                      <motion.div
                        key={theme.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant={currentTheme === theme.value ? "default" : "ghost"}
                          className={cn(
                            'w-full justify-start h-9 rounded-lg',
                            'hover:bg-accent/50 transition-all duration-200'
                          )}
                          onClick={() => handleThemeChange(theme.value)}
                        >
                          <div className={cn(
                            'w-4 h-4 rounded-full mr-3 bg-gradient-to-r',
                            theme.gradient
                          )} />
                          <span className="text-sm">{theme.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={cn(
                'h-9 w-9 rounded-xl',
                'hover:bg-accent/50 hover:shadow-glow',
                'transition-all duration-300'
              )}
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </Button>
          </motion.div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  'h-9 w-9 rounded-xl relative',
                  'hover:bg-accent/50 hover:shadow-glow',
                  'transition-all duration-300'
                )}
              >
                <Bell className="h-4 w-4" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-[60]"
                >
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                      <Button variant="ghost" size="sm" className="text-xs hover:bg-accent/50">
                        Mark all read
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        variants={notificationVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-4 border-b border-border/30 last:border-0 hover:bg-accent/20 cursor-pointer transition-colors',
                          !notification.isRead && 'bg-accent/10'
                        )}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 text-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-foreground truncate">
                                {notification.title}
                              </p>
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full border',
                                getBadgeColor(notification.type)
                              )}>
                                {notification.type}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-border/50">
                    <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-accent/50">
                      View all notifications
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  'h-9 px-3 rounded-xl space-x-2',
                  'hover:bg-accent/50 hover:shadow-glow',
                  'transition-all duration-300'
                )}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">John Doe</span>
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3" />
                </motion.div>
              </Button>
            </motion.div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 top-full mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-[60]"
                >
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">John Doe</p>
                        <p className="text-xs text-muted-foreground">john@company.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {[
                      { icon: User, label: 'Profile', shortcut: 'P' },
                      { icon: Settings, label: 'Settings', shortcut: 'S' },
                      { icon: HelpCircle, label: 'Help & Support', shortcut: 'H' },
                      { icon: Download, label: 'Export Data', shortcut: 'E' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button 
                          variant="ghost" 
                          className={cn(
                            'w-full justify-start h-9 rounded-lg',
                            'hover:bg-accent/50 transition-all duration-200'
                          )}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          <span className="flex-1 text-left text-sm">{item.label}</span>
                          <span className="text-xs text-muted-foreground/60">{item.shortcut}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-2 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      className={cn(
                        'w-full justify-start h-9 rounded-lg',
                        'text-red-500 hover:text-red-600 hover:bg-red-500/10',
                        'transition-all duration-200'
                      )}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span className="text-sm">Sign Out</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};