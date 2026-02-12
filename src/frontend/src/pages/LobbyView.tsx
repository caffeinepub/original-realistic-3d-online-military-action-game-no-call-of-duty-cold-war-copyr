import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetActiveLobbies, useJoinLobby, useLeaveLobby, useStartGame, useGetCallerUserProfile, useSelectMap } from '../hooks/useQueries';
import LoginButton from '../ui/LoginButton';
import ProfileSetupDialog from '../ui/ProfileSetupDialog';
import DisclaimerFooter from '../ui/DisclaimerFooter';
import type { AppView } from '../App';
import { ArrowLeft, Users, Play, LogOut, Lock, Map } from 'lucide-react';
import { toast } from 'sonner';
import { extractErrorMessage } from '../utils/errorMessages';
import { getAllMaps, getMapInfo } from '../game/maps/mapRegistry';
import { GameMap } from '../backend';

interface LobbyViewProps {
  onNavigate: (view: AppView, lobbyId?: bigint) => void;
}

export default function LobbyView({ onNavigate }: LobbyViewProps) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: lobbies = [], isLoading } = useGetActiveLobbies();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const joinLobbyMutation = useJoinLobby();
  const leaveLobbyMutation = useLeaveLobby();
  const startGameMutation = useStartGame();
  const selectMapMutation = useSelectMap();
  const [currentLobby, setCurrentLobby] = useState<bigint | null>(null);

  const isAuthenticated = !!identity;
  const myPrincipal = identity?.getPrincipal().toString();
  const myLobby = lobbies.find(l => 
    l.players.some(p => p.toString() === myPrincipal)
  );

  const handleCreateLobby = async () => {
    // Gate behind authentication
    if (!isAuthenticated) {
      toast.error('Please sign in to create a lobby');
      return;
    }

    // Check if profile is set up
    if (!profileLoading && isFetched && userProfile === null) {
      toast.error('Please complete your profile setup first');
      return;
    }

    try {
      const lobby = await joinLobbyMutation.mutateAsync();
      setCurrentLobby(lobby.id);
      toast.success('Lobby created successfully');
    } catch (error) {
      // Extract user-friendly message
      const userMessage = extractErrorMessage(error);
      // Show contextual error message
      toast.error(`Could not create lobby: ${userMessage}`);
      // Log full error for debugging
      console.error('Lobby creation error:', error);
    }
  };

  const handleLeaveLobby = async () => {
    if (!myLobby) return;
    try {
      await leaveLobbyMutation.mutateAsync(myLobby.id);
      setCurrentLobby(null);
      toast.success('Left lobby');
    } catch (error) {
      const userMessage = extractErrorMessage(error);
      toast.error(`Could not leave lobby: ${userMessage}`);
      console.error('Leave lobby error:', error);
    }
  };

  const handleMapSelect = async (map: GameMap) => {
    if (!myLobby) return;
    try {
      await selectMapMutation.mutateAsync({ lobbyId: myLobby.id, map });
      toast.success(`Map changed to ${getMapInfo(map).displayName}`);
    } catch (error) {
      const userMessage = extractErrorMessage(error);
      toast.error(`Could not change map: ${userMessage}`);
      console.error('Map selection error:', error);
    }
  };

  const handleStartGame = async () => {
    if (!myLobby) return;
    try {
      await startGameMutation.mutateAsync(myLobby.id);
      toast.success('Starting game...');
      onNavigate('online-game', myLobby.id);
    } catch (error) {
      const userMessage = extractErrorMessage(error);
      toast.error(`Could not start game: ${userMessage}`);
      console.error('Start game error:', error);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onNavigate('home');
  };

  const isOwner = myLobby && myLobby.owner.toString() === myPrincipal;
  const canCreateLobby = isAuthenticated && !profileLoading && isFetched && userProfile !== null;
  const availableMaps = getAllMaps();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/assets/generated/menu-background.dim_1920x1080.png)',
          filter: 'brightness(0.3)'
        }}
      />
      <div className="absolute inset-0 military-gradient opacity-70" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 border-b border-border/30">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Menu</span>
        </button>
        <div className="flex items-center gap-4">
          <LoginButton />
          {identity && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/20 text-destructive hover:bg-destructive/30 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">MULTIPLAYER LOBBY</h1>
            <p className="text-gray-300">Join or create a lobby to start playing</p>
          </div>

          {/* Current Lobby */}
          {myLobby && (
            <div className="bg-card/80 backdrop-blur-sm border border-primary rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Lobby #{myLobby.id.toString()}</h2>
                  <p className="text-sm text-muted-foreground">
                    {isOwner ? 'You are the host' : 'Waiting for host to start'}
                  </p>
                </div>
                <button
                  onClick={handleLeaveLobby}
                  disabled={leaveLobbyMutation.isPending}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  Leave Lobby
                </button>
              </div>

              {/* Map Selection */}
              <div className="space-y-3 p-4 bg-background/30 rounded border border-border/50">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-medium text-white">Selected Map</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/30 rounded">
                    <div>
                      <p className="font-medium text-white">{getMapInfo(myLobby.selectedMap).displayName}</p>
                      <p className="text-xs text-muted-foreground">{getMapInfo(myLobby.selectedMap).description}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        All maps are original designs created for this game
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {availableMaps.map((mapInfo) => (
                          <button
                            key={mapInfo.id}
                            onClick={() => handleMapSelect(mapInfo.id)}
                            disabled={selectMapMutation.isPending || myLobby.selectedMap === mapInfo.id}
                            className={`p-3 rounded text-left transition-colors disabled:opacity-50 ${
                              myLobby.selectedMap === mapInfo.id
                                ? 'bg-accent/20 border border-accent/50'
                                : 'bg-background/50 border border-border hover:bg-background/70'
                            }`}
                          >
                            <p className="text-sm font-medium">{mapInfo.displayName}</p>
                            <p className="text-xs text-muted-foreground">{mapInfo.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isOwner && (
                    <p className="text-xs text-muted-foreground text-center">
                      Only the host can change the map
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Players ({myLobby.players.length})
                </h3>
                <div className="space-y-2">
                  {myLobby.players.map((player, idx) => (
                    <div
                      key={player.toString()}
                      className="flex items-center gap-3 p-3 bg-background/50 rounded"
                    >
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-mono">
                        {player.toString().slice(0, 8)}...{player.toString().slice(-6)}
                      </span>
                      {player.toString() === myLobby.owner.toString() && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">HOST</span>
                      )}
                      {player.toString() === myPrincipal && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">YOU</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={handleStartGame}
                  disabled={startGameMutation.isPending || myLobby.players.length < 1}
                  className="w-full py-3 px-4 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  <Play className="w-5 h-5" />
                  Start Game
                </button>
              )}
            </div>
          )}

          {/* Create Lobby */}
          {!myLobby && (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 space-y-3">
              <button
                onClick={handleCreateLobby}
                disabled={!canCreateLobby || joinLobbyMutation.isPending}
                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
              >
                {!isAuthenticated ? (
                  <>
                    <Lock className="w-6 h-6" />
                    Sign In to Create Lobby
                  </>
                ) : (
                  <>
                    <Users className="w-6 h-6" />
                    {joinLobbyMutation.isPending ? 'Creating...' : 'Create New Lobby'}
                  </>
                )}
              </button>
              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center">
                  You must be signed in to create or join lobbies
                </p>
              )}
            </div>
          )}

          {/* Available Lobbies */}
          {!myLobby && lobbies.length > 0 && (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Available Lobbies</h2>
              <div className="space-y-2">
                {lobbies.map(lobby => (
                  <div
                    key={lobby.id.toString()}
                    className="flex items-center justify-between p-4 bg-background/50 rounded"
                  >
                    <div>
                      <p className="font-medium">Lobby #{lobby.id.toString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {lobby.players.length} player{lobby.players.length !== 1 ? 's' : ''} · {getMapInfo(lobby.selectedMap).displayName}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Host: {lobby.owner.toString().slice(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!myLobby && lobbies.length === 0 && !isLoading && (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No active lobbies</p>
              <p className="text-sm text-muted-foreground mt-2">Create one to get started</p>
            </div>
          )}
        </div>
      </main>

      <DisclaimerFooter />
      <ProfileSetupDialog />
    </div>
  );
}
