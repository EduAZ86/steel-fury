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

export { GameRenderer } from './rendering/GameRenderer';
