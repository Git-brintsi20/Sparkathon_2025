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
  Home,
  ChevronRight,
  Filter,
  Calendar,
  Download
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
    title: 'Fraud Detection',
    message: 'Suspicious activity detected on vendor XYZ',
    time: '3 hours ago',
    type: 'error',
    isRead: true,
  },
];

const themeOptions = [
  { value: 'default', label: 'Default Blue', color: 'bg-blue-500' },
  { value: 'corporate', label: 'Corporate Navy', color: 'bg-slate-800' },
  { value: 'modern', label: 'Modern Purple', color: 'bg-purple-500' },
  { value: 'warm', label: 'Warm Earth', color: 'bg-yellow-500' },
  { value: 'dark', label: 'Dark Mode', color: 'bg-gray-900' },
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter(n => !n.isRead).length
  );

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const notificationVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* Mobile Menu Toggle */}
      <Button size="icon" variant="outline" className="sm:hidden" onClick={onMenuToggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Breadcrumbs for larger screens */}
      <div className="hidden md:flex">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      </div>

      {/* Center Section - Search */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search vendors, deliveries, or analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="pl-10 pr-12 w-full bg-background/50"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          
          {/* Quick Search Filters */}
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border border-border rounded-lg shadow-lg opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Vendors
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Recent
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Compliance
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions from the page */}
      {headerActions && <div>{headerActions}</div>}
      
      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Theme Selector */}
        <div className="relative" ref={themeMenuRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="h-8 w-8"
          >
            <Palette className="h-4 w-4" />
          </Button>
          
          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
              >
                <div className="p-2 space-y-1">
                  {themeOptions.map((theme) => (
                    <Button
                      key={theme.value}
                      variant={currentTheme === theme.value ? "default" : "ghost"}
                      className="w-full justify-start h-8"
                      onClick={() => handleThemeChange(theme.value)}
                    >
                      <div className={cn('w-3 h-3 rounded-full mr-2', theme.color)} />
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="h-8 w-8"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-8 w-8 relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {mockNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'p-3 border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer',
                        !notification.isRead && 'bg-accent/20'
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                          notification.type === 'error' && 'bg-error',
                          notification.type === 'warning' && 'bg-warning',
                          notification.type === 'success' && 'bg-success',
                          notification.type === 'info' && 'bg-primary'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View all notifications
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            className="h-8 px-3 space-x-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline text-sm">John Doe</span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
              >
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@company.com</p>
                </div>
                
                <div className="p-2 space-y-1">
                  <Button variant="ghost" className="w-full justify-start h-8">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-8">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-8">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-8">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                
                <div className="p-2 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start h-8 text-error hover:text-error hover:bg-error/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;