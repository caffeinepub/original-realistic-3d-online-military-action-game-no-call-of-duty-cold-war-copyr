import { GameMap } from '../../backend';
import TrainingRangeMap from './TrainingRangeMap';
import HarborYardMap from './HarborYardMap';
import DesertOutpostMap from './DesertOutpostMap';
import JungleCompoundMap from './JungleCompoundMap';

export interface MapInfo {
  id: GameMap;
  displayName: string;
  description: string;
  component: React.ComponentType;
}

export const MAP_REGISTRY: Record<GameMap, MapInfo> = {
  [GameMap.island]: {
    id: GameMap.island,
    displayName: 'Training Range',
    description: 'Classic training facility with cover positions',
    component: TrainingRangeMap,
  },
  [GameMap.jungle]: {
    id: GameMap.jungle,
    displayName: 'Jungle Compound',
    description: 'Dense vegetation with elevated platforms',
    component: JungleCompoundMap,
  },
  [GameMap.city]: {
    id: GameMap.city,
    displayName: 'Harbor Yard',
    description: 'Industrial shipping containers and warehouses',
    component: HarborYardMap,
  },
  [GameMap.desert]: {
    id: GameMap.desert,
    displayName: 'Desert Outpost',
    description: 'Sandy terrain with fortified structures',
    component: DesertOutpostMap,
  },
};

export function getMapInfo(mapId: GameMap): MapInfo {
  return MAP_REGISTRY[mapId];
}

export function getAllMaps(): MapInfo[] {
  return Object.values(MAP_REGISTRY);
}
