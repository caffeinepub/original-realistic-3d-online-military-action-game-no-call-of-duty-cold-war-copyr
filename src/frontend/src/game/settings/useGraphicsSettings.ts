import { useContext } from 'react';
import { GraphicsSettingsContext } from './GraphicsSettingsContext';

export function useGraphicsSettings() {
  return useContext(GraphicsSettingsContext);
}
