// frontend/src/contexts/LayoutContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface LayoutContextType {
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  // Function to allow child pages to set this data
  setLayoutData: (data: Partial<Omit<LayoutContextType, 'setLayoutData'>>) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutData, setLayoutData] = useState<Omit<LayoutContextType, 'setLayoutData'>>({});

  const value = { ...layoutData, setLayoutData };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};