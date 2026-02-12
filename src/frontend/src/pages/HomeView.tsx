import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from '../ui/LoginButton';
import ProfileSetupDialog from '../ui/ProfileSetupDialog';
import DisclaimerFooter from '../ui/DisclaimerFooter';
import type { AppView } from '../App';
import { Target, Users, Swords } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/assets/generated/menu-background.dim_1920x1080.png)',
          filter: 'brightness(0.4)'
        }}
      />
      <div className="absolute inset-0 military-gradient opacity-60" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <img 
            src="/assets/generated/game-logo.dim_512x512.png" 
            alt="Game Logo" 
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TACTICAL OPS</h1>
            <p className="text-sm text-gray-300">Original Military Action</p>
          </div>
        </div>
        <LoginButton />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-white tracking-tight">
              ENTER THE BATTLEFIELD
            </h2>
            <p className="text-xl text-gray-300">
              Experience realistic tactical combat in immersive 3D environments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {/* Training Mode */}
            <button
              onClick={() => onNavigate('training')}
              className="group relative overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all p-8 text-left"
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Training</h3>
                <p className="text-gray-300">
                  Practice your skills in the training range
                </p>
              </div>
            </button>

            {/* Offline Skirmish Mode */}
            <button
              onClick={() => onNavigate('offline-skirmish')}
              className="group relative overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-secondary transition-all p-8 text-left"
            >
              <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Swords className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Offline Skirmish</h3>
                <p className="text-gray-300">
                  Battle against moving targets offline
                </p>
                <p className="text-xs text-green-400 mt-2">No sign-in required</p>
              </div>
            </button>

            {/* Online Mode */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Please sign in to play online');
                  return;
                }
                onNavigate('lobby');
              }}
              className="group relative overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent transition-all p-8 text-left"
            >
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Users className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Play Online</h3>
                <p className="text-gray-300">
                  Join multiplayer matches with other operators
                </p>
                {!isAuthenticated && (
                  <p className="text-sm text-destructive mt-2">Sign in required</p>
                )}
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <DisclaimerFooter />
      
      {/* Profile Setup Dialog */}
      <ProfileSetupDialog />
    </div>
  );
}
