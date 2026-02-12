import { useContext } from 'react';
import { DebugSettingsContext } from './DebugSettingsContext';

export function useDebugSettings() {
  return useContext(DebugSettingsContext);
}
