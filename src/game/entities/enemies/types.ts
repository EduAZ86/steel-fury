import { BulletConfig } from "../Bullet";

export interface EnemyConfig {
    maxSpeed: number;
    acceleration: number;
    deceleration: number;
    rotationSpeed: number;
    size: number;
    health: number;
    color: string;
    darkColor: string;
    bulletConfig: BulletConfig;
    shootCooldown: number;
    aggroRange: number;
}

export type EnemyClass = 'scout' | 'grunt' | 'heavy' | 'artillery' | 'commander';

export type AIState = 'patrol' | 'chase' | 'attack' | 'retreat';
