export type GraphicsMode = 'Balanced' | 'Performance';

export interface GraphicsSettings {
  mode: GraphicsMode;
  dpr: [number, number];
  antialias: boolean;
  shadowsEnabled: boolean;
  shadowMapSize: number;
}

export function getGraphicsSettings(mode: GraphicsMode): GraphicsSettings {
  switch (mode) {
    case 'Performance':
      return {
        mode: 'Performance',
        dpr: [0.75, 1],
        antialias: false,
        shadowsEnabled: false,
        shadowMapSize: 512,
      };
    case 'Balanced':
    default:
      return {
        mode: 'Balanced',
        dpr: [1, 2],
        antialias: true,
        shadowsEnabled: true,
        shadowMapSize: 2048,
      };
  }
}
