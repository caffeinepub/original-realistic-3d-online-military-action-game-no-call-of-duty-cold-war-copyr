export interface WeaponConfig {
  name: string;
  fireRate: number; // ms between shots
  spread: number; // accuracy spread
  damage: number;
}

export const OFFLINE_WEAPONS: Record<'rifle' | 'smg', WeaponConfig> = {
  rifle: {
    name: 'Tactical Rifle',
    fireRate: 150,
    spread: 0.02,
    damage: 30,
  },
  smg: {
    name: 'Rapid SMG',
    fireRate: 80,
    spread: 0.05,
    damage: 20,
  },
};
