import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetActiveLobbies, useJoinLobby, useLeaveLobby, useStartGame } from '../hooks/useQueries';
import LoginButton from '../ui/LoginButton';
import ProfileSetupDialog from '../ui/ProfileSetupDialog';
import DisclaimerFooter from '../ui/DisclaimerFooter';
import type { AppView } from '../App';
import { ArrowLeft, Users, Play, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface LobbyViewProps {
  onNavigate: (view: AppView, lobbyId?: bigint) => void;
}

export default function LobbyView({ onNavigate }: LobbyViewProps) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: lobbies = [], isLoading } = useGetActiveLobbies();
  const joinLobbyMutation = useJoinLobby();
  const leaveLobbyMutation = useLeaveLobby();
  const startGameMutation = useStartGame();
  const [currentLobby, setCurrentLobby] = useState<bigint | null>(null);

  const myPrincipal = identity?.getPrincipal().toString();
  const myLobby = lobbies.find(l => 
    l.players.some(p => p.toString() === myPrincipal)
  );

  const handleCreateLobby = async () => {
    try {
      const lobby = await joinLobbyMutation.mutateAsync();
      setCurrentLobby(lobby.id);
      toast.success('Lobby created successfully');
    } catch (error) {
      toast.error('Failed to create lobby');
      console.error(error);
    }
  };

  const handleLeaveLobby = async () => {
    if (!myLobby) return;
    try {
      await leaveLobbyMutation.mutateAsync(myLobby.id);
      setCurrentLobby(null);
      toast.success('Left lobby');
    } catch (error) {
      toast.error('Failed to leave lobby');
      console.error(error);
    }
  };

  const handleStartGame = async () => {
    if (!myLobby) return;
    try {
      await startGameMutation.mutateAsync(myLobby.players);
      toast.success('Starting game...');
      onNavigate('online-game', myLobby.id);
    } catch (error) {
      toast.error('Failed to start game');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onNavigate('home');
  };

  const isOwner = myLobby && myLobby.owner.toString() === myPrincipal;

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
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6">
              <button
                onClick={handleCreateLobby}
                disabled={joinLobbyMutation.isPending}
                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
              >
                <Users className="w-6 h-6" />
                Create New Lobby
              </button>
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
                        {lobby.players.length} player{lobby.players.length !== 1 ? 's' : ''}
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
