export const ASSETS = {
    terrain: {
        ground: '/assets/textures/terrain/ground.png',
        water: '/assets/textures/terrain/water.png',
        forest: '/assets/textures/terrain/forest.png',
    },
    structures: {
        brick: '/assets/textures/structures/brick.png',
        brick_damaged: '/assets/textures/structures/brick_damaged.png',
        brick_destroyed: '/assets/textures/structures/brick_destroyed.png',
        concrete: '/assets/textures/structures/concrete.png',
        concrete_damaged: '/assets/textures/structures/concrete_damaged.png',
        concrete_destroyed: '/assets/textures/structures/concrete_destroyed.png',
        steel: '/assets/textures/structures/steel.png',
        reinforced: '/assets/textures/structures/reinforced.png',
        reinforced_damaged: '/assets/textures/structures/reinforced_damaged.png',
        reinforced_destroyed: '/assets/textures/structures/reinforced_destroyed.png',
        hardwall: '/assets/textures/structures/hardwall.png',
        hardwall_damaged: '/assets/textures/structures/hardwall_damaged.png',
        hardwall_destroyed: '/assets/textures/structures/hardwall_destroyed.png',
        metal: '/assets/textures/structures/metal.png',
        metal_damaged: '/assets/textures/structures/metal_damaged.png',
        metal_destroyed: '/assets/textures/structures/metal_destroyed.png',
        obsidian: '/assets/textures/structures/obsidian.png',
        obsidian_damaged: '/assets/textures/structures/obsidian_damaged.png',
        obsidian_destroyed: '/assets/textures/structures/obsidian_destroyed.png',
    },
    entities: {
        playerTank: '/assets/textures/tanks/player_tank.png',
        scout: '/assets/textures/tanks/tank_scout.png',
        grunt: '/assets/textures/tanks/tank_grunt.png',
        heavy: '/assets/textures/tanks/tank_heavy.png',
        artillery: '/assets/textures/tanks/tank_artillery.png',
        commander: '/assets/textures/tanks/tank_commander.png',
        bullet: '/assets/textures/entities/bullet.png',
    },
    base: {
        base: '/assets/textures/base/base.png',
        damaged: '/assets/textures/base/base_damaged.png',
    },
} as const;

export type AssetKey = typeof ASSETS[keyof typeof ASSETS][keyof typeof ASSETS[keyof typeof ASSETS]];
