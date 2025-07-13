import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { cn } from '@/components/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLayout } from '@/contexts/LayoutContext';

const Layout: React.FC = () => {
  // Get the page data from our context
  const { pageTitle, pageDescription, breadcrumbs, headerActions } = useLayout();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Enhanced responsive behavior with smooth transitions
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
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
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        duration: 0.4
      }
    },
    collapsed: {
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

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background-secondary/20 pointer-events-none" />
      
      {/* Sidebar with enhanced animations */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          duration: 0.5
        }}
        className="relative z-40"
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          isMobile={isMobile}
        />
      </motion.div>

      {/* Main Content Area - FIXED: Proper positioning to avoid sidebar overlap */}
      <motion.div
        variants={mainContentVariants}
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        className="flex flex-col h-full relative z-10"
        style={{
          // FIXED: Proper margin calculation based on sidebar state
          marginLeft: isMobile 
            ? '0px' 
            : isSidebarOpen 
              ? '280px' 
              : '80px',
          width: isMobile 
            ? '100%' 
            : isSidebarOpen 
              ? 'calc(100% - 280px)' 
              : 'calc(100% - 80px)',
          transition: 'margin-left 0.3s ease, width 0.3s ease'
        }}
      >
        {/* Header with glass effect */}
        <motion.div
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="glass-effect border-b border-border/50 backdrop-blur-md flex-shrink-0"
        >
          <Header 
            onMenuToggle={toggleSidebar}
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            breadcrumbs={breadcrumbs}
            headerActions={headerActions}
          />
        </motion.div>

        {/* Main Content with professional animations */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'flex-1 overflow-auto relative p-6',
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
              <Outlet />
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

export default Layout;