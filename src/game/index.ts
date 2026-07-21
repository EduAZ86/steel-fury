export { Tank } from './entities/Tank';
export type { TankConfig } from './entities/Tank';

export { Bullet, BULLET_TYPES } from './entities/Bullet';
export type { BulletConfig } from './entities/Bullet';

export { Enemy } from './entities/enemies/Enemy';
export { ENEMY_CONFIGS } from './entities/enemies/config';
export type { EnemyConfig, EnemyClass } from './entities/enemies/types';

export { GameManager } from './GameManager';
export type { GameConfig } from './GameManager';

export { PlayerController } from './systems/PlayerController';
export { EnemySpawner } from './systems/EnemySpawner';
export { CollisionSystem } from './systems/CollisionSystem';
export { GameState } from './systems/GameState';

export { createTestMap, getMapDimensions } from './maps/testMap';
export type { MapData } from './maps/testMap';

export type { Cell, CellProperties, CellMap } from './maps/types';
export { createCell } from './maps/types';
export { CELL_TYPES } from './maps/cellSettings';
export type { CellType, CellTypeConfig } from './maps/cellSettings';

export { MapGenerator } from './maps/generators/MapGenerator';
export type { MapConfig, GeneratedMap } from './maps/generators/MapGenerator';
export { PlayerSpawnGenerator } from './maps/generators/PlayerSpawnGenerator';
export { SeededRandom } from './maps/generators/SeededRandom';
export { TerrainGenerator } from './maps/generators/TerrainGenerator';
export { StructureGenerator } from './maps/generators/StructureGenerator';
export { BaseGenerator } from './maps/generators/BaseGenerator';
export { BUILDING_PATTERNS } from './maps/generators/patterns/BuildingPatterns';
export { WATER_SHAPES, FOREST_SHAPES } from './maps/generators/patterns/TerrainPatterns';

export { loadAllAssets, getAssetPath, loadSprite } from './assets/loadAssets';
export { ASSETS } from './assets/AssetManifest';

export { GameRenderer } from './rendering/GameRenderer';
