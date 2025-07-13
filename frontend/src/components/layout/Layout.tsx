import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/components/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
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
  children,
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
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced responsive behavior with smooth transitions
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Smooth sidebar state management
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    setIsLoading(false);
    
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMobileOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Enhanced animation variants with professional gliding effects
  const mainContentVariants = {
    expanded: {
      marginLeft: isMobile ? 0 : (isSidebarOpen ? 280 : 80),
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        duration: 0.4
      }
    },
    collapsed: {
      marginLeft: isMobile ? 0 : (isSidebarOpen ? 280 : 80),
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        duration: 0.4
      }
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const headerVariants = {
    initial: {
      opacity: 0,
      y: -10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  const contentVariants = {
    initial: {
      opacity: 0,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  // Loading state with professional shimmer effect
  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-primary/20 h-12 w-12 animate-shimmer"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-primary/20 rounded w-3/4 animate-shimmer"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2 animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background-secondary/20 pointer-events-none" />
      
      {/* Sidebar with enhanced animations */}
      {showSidebar && (
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            duration: 0.5
          }}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
            isMobile={isMobile}
            {...sidebarProps}
          />
        </motion.div>
      )}

      {/* Main Content Area with smooth gliding transitions */}
      <motion.div
        variants={mainContentVariants}
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        className={cn(
          'flex flex-col h-full relative z-10',
          'transition-all duration-300 ease-spring',
          isMobile && 'ml-0',
          className
        )}
      >
        {/* Header with glass effect */}
        {showHeader && (
          <motion.div
            variants={headerVariants}
            initial="initial"
            animate="animate"
            className="glass-effect border-b border-border/50 backdrop-blur-md"
          >
            <Header
              onMenuToggle={toggleSidebar}
              isMobileMenuOpen={isSidebarOpen}
              showBreadcrumbs={showBreadcrumbs}
              breadcrumbs={breadcrumbs}
            />
          </motion.div>
        )}

        {/* Page Header Section with elegant animations */}
        {(pageTitle || pageDescription || headerActions) && (
          <motion.div
            variants={headerVariants}
            initial="initial"
            animate="animate"
            className={cn(
              'bg-card/80 backdrop-blur-sm border-b border-border/50',
              'px-6 py-6 hover-glow transition-all duration-300',
              'relative overflow-hidden'
            )}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
            
            <div className="relative z-10 flex items-center justify-between">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {pageTitle && (
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {pageTitle}
                  </h1>
                )}
                {pageDescription && (
                  <p className="text-muted-foreground text-lg font-medium">
                    {pageDescription}
                  </p>
                )}
              </motion.div>
              
              {headerActions && (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {headerActions}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Breadcrumbs with smooth entrance */}
        {showBreadcrumbs && breadcrumbs && !showHeader && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <Breadcrumb items={breadcrumbs} />
          </motion.div>
        )}

        {/* Main Content with professional animations */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'flex-1 overflow-auto relative',
            'scrollbar-hide' // Custom utility from tailwind config
          )}
        >
          {/* Scroll gradient indicators */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent z-20" />
          
          <motion.div 
            variants={contentVariants}
            className="h-full min-h-0 relative"
          >
            {/* Content wrapper with subtle animations */}
            <div className="animate-slide-in-up">
              {children}
            </div>
          </motion.div>
        </motion.main>
      </motion.div>

      {/* Enhanced Mobile Overlay with blur effect */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'fixed inset-0 z-30 lg:hidden',
              'bg-black/60 backdrop-blur-sm',
              'cursor-pointer'
            )}
            onClick={handleMobileOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Floating elements for visual depth */}
      <div className="fixed top-10 right-10 w-2 h-2 bg-primary/20 rounded-full animate-float opacity-60 pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-1 h-1 bg-accent/30 rounded-full animate-float opacity-40 pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-1/4 w-1.5 h-1.5 bg-success/20 rounded-full animate-float opacity-30 pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  );
};