import { createContext, useState, useEffect, ReactNode } from 'react';

interface DebugSettingsContextValue {
  showPerformanceOverlay: boolean;
  setShowPerformanceOverlay: (show: boolean) => void;
}

export const DebugSettingsContext = createContext<DebugSettingsContextValue>({
  showPerformanceOverlay: false,
  setShowPerformanceOverlay: () => {},
});

interface DebugSettingsProviderProps {
  children: ReactNode;
}

export function DebugSettingsProvider({ children }: DebugSettingsProviderProps) {
  const [showPerformanceOverlay, setShowPerformanceOverlayState] = useState<boolean>(() => {
    const stored = localStorage.getItem('showPerformanceOverlay');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('showPerformanceOverlay', String(showPerformanceOverlay));
  }, [showPerformanceOverlay]);

  const setShowPerformanceOverlay = (show: boolean) => {
    setShowPerformanceOverlayState(show);
  };

  return (
    <DebugSettingsContext.Provider value={{ showPerformanceOverlay, setShowPerformanceOverlay }}>
      {children}
    </DebugSettingsContext.Provider>
  );
}
