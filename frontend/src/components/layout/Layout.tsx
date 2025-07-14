import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/components/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLayout } from '@/contexts/LayoutContext';

// Animation variants for smooth transitions
const layoutVariants = {
  expanded: {
    marginLeft: 280,
    width: 'calc(100% - 280px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  collapsed: {
    marginLeft: 80,
    width: 'calc(100% - 80px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  mobile: {
    marginLeft: 0,
    width: '100%',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 35,
      duration: 0.3
    }
  }
};

const sidebarVariants = {
  initial: { 
    x: -320,
    opacity: 0 
  },
  animate: { 
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      duration: 0.5
    }
  },
  exit: { 
    x: -320,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.175, 0.885, 0.32, 1.275],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const overlayVariants = {
  initial: { 
    opacity: 0,
    backdropFilter: 'blur(0px)'
  },
  animate: { 
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

const Layout: React.FC = () => {
  const { pageTitle, pageDescription, breadcrumbs, headerActions } = useLayout();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageTransitionKey, setPageTransitionKey] = useState('');
  
  // Refs for preventing unwanted re-renders
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced responsive behavior with proper breakpoints
  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    const mobile = width < 768;
    const tablet = width >= 768 && width < 1024;
    const desktop = width >= 1024;

    setIsMobile(mobile);
    setIsTablet(tablet);

    // Auto-close sidebar on mobile/tablet, auto-open on desktop
    if (mobile || tablet) {
      setIsSidebarOpen(false);
    } else if (desktop) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkScreenSize();
    
    const handleResize = () => {
      checkScreenSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScreenSize]);

  // Handle page transition key updates with debouncing
  useEffect(() => {
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Set transition flag
    isTransitioningRef.current = true;

    // Debounce the page transition key update
    transitionTimeoutRef.current = setTimeout(() => {
      setPageTransitionKey(location.pathname);
      isTransitioningRef.current = false;
    }, 100);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    // Prevent sidebar toggle during page transitions
    if (isTransitioningRef.current) {
      return;
    }
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleMobileOverlayClick = useCallback((e: React.MouseEvent) => {
    // Prevent if click is on sidebar
    if (sidebarRef.current && sidebarRef.current.contains(e.target as Node)) {
      return;
    }
    
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    }
  }, [isMobile, isTablet]);

  // Prevent sidebar interactions from affecting page transitions
  const handleSidebarInteraction = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine layout variant based on screen size and sidebar state
  const getLayoutVariant = () => {
    if (isMobile || isTablet) return 'mobile';
    return isSidebarOpen ? 'expanded' : 'collapsed';
  };

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Ambient background with subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/5 pointer-events-none" />
      
      {/* Floating decoration elements */}
      <div className="fixed top-20 right-20 w-2 h-2 bg-primary/20 rounded-full animate-float opacity-60 pointer-events-none" />
      <div className="fixed bottom-32 left-32 w-1 h-1 bg-secondary/30 rounded-full animate-float opacity-40 pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-1/4 w-1.5 h-1.5 bg-success/20 rounded-full animate-float opacity-30 pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Sidebar Component - Isolated from page transitions */}
      <motion.div
        ref={sidebarRef}
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
        className="fixed inset-y-0 left-0 z-50"
        onClick={handleSidebarInteraction}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        variants={layoutVariants}
        animate={getLayoutVariant()}
        className="flex flex-col h-full relative z-10"
        style={{
          // Ensure proper positioning without overlap
          ...(isMobile || isTablet ? {} : {
            marginLeft: isSidebarOpen ? '280px' : '80px',
            width: isSidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 80px)'
          })
        }}
      >
        {/* Enhanced Header with glass morphism */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
              delay: 0.2,
              ease: 'easeOut'
            }
          }}
          className={cn(
            'flex-shrink-0 relative z-20',
            'bg-background/80 backdrop-blur-xl',
            'border-b border-border/50',
            'shadow-sm'
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/95 to-background/90" />
          <div className="relative">
            <Header 
              onMenuToggle={toggleSidebar}
              pageTitle={pageTitle}
              pageDescription={pageDescription}
              breadcrumbs={breadcrumbs}
              headerActions={headerActions}
            />
          </div>
        </motion.header>

        {/* Main Content with Enhanced Animations */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'flex-1 relative overflow-hidden',
            'bg-gradient-to-br from-background via-background to-muted/2'
          )}
        >
          {/* Content scroll area */}
          <div className={cn(
            'h-full overflow-y-auto overflow-x-hidden',
            'scrollbar-hide',
            'p-4 md:p-6 lg:p-8'
          )}>
            {/* Scroll indicators */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent z-10" />
            
            {/* Content wrapper with staggered animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.175, 0.885, 0.32, 1.275]
                }
              }}
              className="relative z-10 min-h-full"
            >
              {/* Router outlet with page transitions - Using stable key */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageTransitionKey || location.pathname}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: {
                      duration: 0.4,
                      ease: 'easeOut'
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -20,
                    transition: {
                      duration: 0.3,
                      ease: 'easeIn'
                    }
                  }}
                  className="animate-slide-in-up"
                  onAnimationStart={() => {
                    isTransitioningRef.current = true;
                  }}
                  onAnimationComplete={() => {
                    isTransitioningRef.current = false;
                  }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.main>
      </motion.div>

      {/* Enhanced Mobile/Tablet Overlay */}
      <AnimatePresence>
        {(isMobile || isTablet) && isSidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'fixed inset-0 z-40',
              'bg-black/50 backdrop-blur-sm',
              'cursor-pointer lg:hidden'
            )}
            onClick={handleMobileOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Loading state overlay for smooth transitions */}
      <AnimatePresence>
        {!mounted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;