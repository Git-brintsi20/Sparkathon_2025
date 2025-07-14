import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Animation variants for different transition types
const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
};

// Smooth transition settings
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// Alternative fade transition (more subtle)
const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const fadeTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// Slide transition (for mobile-like feel)
const slideVariants = {
  initial: { x: '100%', opacity: 0 },
  in: { x: 0, opacity: 1 },
  out: { x: '-100%', opacity: 0 },
};

const slideTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const FadeTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={fadeVariants}
      transition={fadeTransition}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const SlideTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={slideVariants}
      transition={slideTransition}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Higher-order component for wrapping pages
export const withPageTransition = (
  Component: React.ComponentType<any>,
  TransitionComponent: React.ComponentType<PageTransitionProps> = PageTransition
) => {
  return function WrappedComponent(props: any) {
    return (
      <TransitionComponent>
        <Component {...props} />
      </TransitionComponent>
    );
  };
};

// Custom hook for page transitions
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);

  return {
    isTransitioning,
    startTransition,
    endTransition,
  };
};

export default PageTransition;