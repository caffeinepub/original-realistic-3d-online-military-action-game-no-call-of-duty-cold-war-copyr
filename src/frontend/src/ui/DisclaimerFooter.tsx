import { SiCaffeine } from 'react-icons/si';

export default function DisclaimerFooter() {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname || 'tactical-ops')
    : 'tactical-ops';

  return (
    <footer className="relative z-10 border-t border-border/30 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p className="font-medium">
              This is an original project and is not affiliated with, endorsed by, or connected to 
              Activision, Call of Duty, or any related trademarks.
            </p>
            <p className="text-xs mt-1">
              All game content is original and created independently.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>© {new Date().getFullYear()}</span>
            <span>•</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Built with <SiCaffeine className="w-3 h-3 text-red-500" /> using caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
