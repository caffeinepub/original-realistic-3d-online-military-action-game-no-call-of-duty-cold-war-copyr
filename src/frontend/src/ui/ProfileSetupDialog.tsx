import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [username, setUsername] = useState('');
  const [open, setOpen] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setOpen(true);
    } else if (userProfile !== null) {
      setOpen(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        username: username.trim(),
        gamesPlayed: BigInt(0),
        wins: BigInt(0),
      });
      toast.success('Profile created successfully');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome, Operator</DialogTitle>
          <DialogDescription>
            Choose your callsign to begin your tactical operations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Callsign</Label>
            <Input
              id="username"
              placeholder="Enter your callsign"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={saveProfile.isPending || !username.trim()}
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Deploy'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
