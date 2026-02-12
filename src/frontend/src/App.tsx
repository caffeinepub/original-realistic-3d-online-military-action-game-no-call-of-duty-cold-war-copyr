import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import HomeView from './pages/HomeView';
import TrainingView from './pages/TrainingView';
import LobbyView from './pages/LobbyView';
import OnlineGameView from './pages/OnlineGameView';
import OfflineSkirmishView from './pages/OfflineSkirmishView';
import { Toaster } from '@/components/ui/sonner';
import { GraphicsSettingsProvider } from './game/settings/GraphicsSettingsContext';
import { DebugSettingsProvider } from './game/settings/DebugSettingsContext';

export type AppView = 'home' | 'training' | 'lobby' | 'online-game' | 'offline-skirmish';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentLobbyId, setCurrentLobbyId] = useState<bigint | null>(null);

  const navigateTo = (view: AppView, lobbyId?: bigint) => {
    setCurrentView(view);
    if (lobbyId !== undefined) {
      setCurrentLobbyId(lobbyId);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <GraphicsSettingsProvider>
        <DebugSettingsProvider>
          <div className="min-h-screen bg-background">
            {currentView === 'home' && <HomeView onNavigate={navigateTo} />}
            {currentView === 'training' && <TrainingView onNavigate={navigateTo} />}
            {currentView === 'lobby' && <LobbyView onNavigate={navigateTo} />}
            {currentView === 'online-game' && (
              <OnlineGameView onNavigate={navigateTo} lobbyId={currentLobbyId} />
            )}
            {currentView === 'offline-skirmish' && (
              <OfflineSkirmishView onNavigate={navigateTo} />
            )}
            <Toaster />
          </div>
        </DebugSettingsProvider>
      </GraphicsSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
