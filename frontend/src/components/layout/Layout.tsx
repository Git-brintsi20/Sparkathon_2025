import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/components/lib/utils'; // Assuming '@/lib/utils' is the correct path
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
// REMOVED: import { Outlet } from 'react-router-dom'; // Outlet is not used in this pattern

interface LayoutProps {
  children: React.ReactNode; // RE-ADDED: The children prop is required again
  className?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
  pageTitle?: string;
  pageDescription?: string;
  headerActions?: React.ReactNode;
  sidebarProps?: any;
}

export const Layout: React.FC<LayoutProps> = ({
  children, // RE-ADDED: Destructure children prop
  className,
  showSidebar = true,
  showHeader = true,
  showBreadcrumbs = true,
  breadcrumbs,
  pageTitle,
  pageDescription,
  headerActions,
  sidebarProps
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      // FIX for 'window' not found: Ensure your frontend/tsconfig.json includes "DOM" in its "lib" array.
      // This code assumes 'window' is available in a browser environment.
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMobileOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const mainContentVariants = {
    expanded: {
      marginLeft: isMobile ? 0 : (isSidebarOpen ? 280 : 80),
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      marginLeft: isMobile ? 0 : (isSidebarOpen ? 280 : 80),
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          isMobile={isMobile}
          {...sidebarProps}
        />
      )}

      {/* Main Content Area */}
      <motion.div
        variants={mainContentVariants}
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        className={cn(
          'flex flex-col h-full',
          isMobile && 'ml-0',
          className
        )}
      >
        {/* Header */}
        {showHeader && (
          <Header
            onMenuToggle={toggleSidebar}
            isMobileMenuOpen={isSidebarOpen}
            showBreadcrumbs={showBreadcrumbs}
            breadcrumbs={breadcrumbs}
          />
        )}

        {/* Page Header Section */}
        {(pageTitle || pageDescription || headerActions) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border-b border-border px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {pageTitle && (
                  <h1 className="text-2xl font-bold text-foreground">
                    {pageTitle}
                  </h1>
                )}
                {pageDescription && (
                  <p className="text-sm text-muted-foreground">
                    {pageDescription}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center space-x-2">
                  {headerActions}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Breadcrumbs (Alternative placement) */}
        {showBreadcrumbs && breadcrumbs && !showHeader && (
          <div className="px-6 py-3 border-b border-border bg-card">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        {/* Main Content - Now renders children again */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 overflow-auto"
        >
          <div className="h-full">
            {children} {/* RE-ADDED: Render children here */}
          </div>
        </motion.main>
      </motion.div>

      {/* Mobile Overlay for Sidebar */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={handleMobileOverlayClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
