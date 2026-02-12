import { createContext, useState, useEffect, ReactNode } from 'react';
import type { GraphicsMode } from './graphics';

interface GraphicsSettingsContextValue {
  graphicsMode: GraphicsMode;
  setGraphicsMode: (mode: GraphicsMode) => void;
}

export const GraphicsSettingsContext = createContext<GraphicsSettingsContextValue>({
  graphicsMode: 'Balanced',
  setGraphicsMode: () => {},
});

interface GraphicsSettingsProviderProps {
  children: ReactNode;
}

export function GraphicsSettingsProvider({ children }: GraphicsSettingsProviderProps) {
  const [graphicsMode, setGraphicsModeState] = useState<GraphicsMode>(() => {
    const stored = localStorage.getItem('graphicsMode');
    return (stored === 'Performance' || stored === 'Balanced') ? stored : 'Balanced';
  });

  useEffect(() => {
    localStorage.setItem('graphicsMode', graphicsMode);
  }, [graphicsMode]);

  const setGraphicsMode = (mode: GraphicsMode) => {
    setGraphicsModeState(mode);
  };

  return (
    <GraphicsSettingsContext.Provider value={{ graphicsMode, setGraphicsMode }}>
      {children}
    </GraphicsSettingsContext.Provider>
  );
}
