import { CanvasHandler } from "@/engine/core/Render/canvasHandler";
import { SpriteRenderer } from "@/engine/core/Render/spritesRender";
import { AssetLoader } from "@/engine/core/Render/AssetLoader";
import { Tank } from "../entities/Tank";
import { Bullet } from "../entities/Bullet";
import { Enemy } from "../entities/enemies/Enemy";
import { Cell } from "../maps/types";
import { MapData } from "../maps/testMap";

export class GameRenderer {
    private ctx: CanvasRenderingContext2D;
    private spriteRenderer: SpriteRenderer;
    private assetLoader: AssetLoader;

    private mapData: MapData | null = null;
    private tank: Tank | null = null;
    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];

    private frame: number = 0;

    constructor(canvasHandler: CanvasHandler, spriteRenderer: SpriteRenderer, assetLoader: AssetLoader) {
        this.ctx = canvasHandler.context;
        this.spriteRenderer = spriteRenderer;
        this.assetLoader = assetLoader;
    }

    public setMap(mapData: MapData) {
        this.mapData = mapData;
    }

    public setTank(tank: Tank) {
        this.tank = tank;
    }

    public setBullets(bullets: Bullet[]) {
        this.bullets = bullets;
    }

    public setEnemies(enemies: Enemy[]) {
        this.enemies = enemies;
    }

    public incrementFrame() {
        this.frame++;
    }

    public drawMap = () => {
        if (!this.mapData) return;
        const { tiles, tileSize } = this.mapData;

        for (let row = 0; row < tiles.length; row++) {
            for (let col = 0; col < tiles[row].length; col++) {
                const cell = tiles[row][col];
                this.drawTile(col * tileSize, row * tileSize, tileSize, cell);
            }
        }
    };

    private drawTile(x: number, y: number, size: number, cell: Cell) {
        const color = cell.properties.color;
        const half = size / 2;

        if (cell.type === 'empty') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color });
            return;
        }

        if (cell.type === 'brick') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + 2, half - 3, half - 3, { color: '#92400e' });
            this.spriteRenderer.drawRect(this.ctx, x + half + 1, y + 2, half - 3, half - 3, { color: '#92400e' });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + half + 1, half - 3, half - 3, { color: '#92400e' });
            this.spriteRenderer.drawRect(this.ctx, x + half + 1, y + half + 1, half - 3, half - 3, { color: '#92400e' });
        } else if (cell.type === 'steel') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color, strokeColor: '#6b7280', strokeWidth: 1 });
            this.spriteRenderer.drawRect(this.ctx, x + 4, y + 4, size - 8, size - 8, { color: '#d1d5db' });
        } else if (cell.type === 'water') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: '#1e40af' });
            const waveOffset = Math.sin(this.frame * 0.08 + x * 0.05) * 2;
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + size / 3 + waveOffset, size - 4, 3, { color: '#60a5fa', alpha: 0.7 });
            this.spriteRenderer.drawRect(this.ctx, x + 6, y + size * 2 / 3 - waveOffset, size - 12, 2, { color: '#93c5fd', alpha: 0.5 });
        } else if (cell.type === 'forest') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: '#1a1a2e' });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + 2, size - 4, size - 4, { color: '#166534' });
            this.spriteRenderer.drawCircle(this.ctx, x + half, y + half, half - 4, { color: '#22c55e', alpha: 0.6 });
        } else if (cell.type === 'base') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: '#7f1d1d', strokeColor: '#dc2626', strokeWidth: 2 });
            this.spriteRenderer.drawCircle(this.ctx, x + half, y + half, half / 2, { color: '#fbbf24' });
        } else {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color });
        }
    }

    public drawEntities = () => {
        this.drawBullets();
        this.drawTank();
        this.drawEnemies();
    };

    private drawTank() {
        if (!this.tank) return;
        const pos = this.tank.position;
        const rotation = this.tank.rotation;
        const size = this.tank.gameObject.transform.scale.x;

        const sprite = this.assetLoader.get('playerTank');
        if (sprite) {
            this.spriteRenderer.drawSpriteAt(this.ctx, sprite, pos.x, pos.y, { rotation });
        } else {
            this.drawTankPlaceholder(pos.x, pos.y, size, rotation, '#4ade80', '#166534');
        }
    }

    private drawTankPlaceholder(x: number, y: number, size: number, rotation: number, bodyColor: string, darkColor: string) {
        const half = size / 2;
        const barrelLength = size * 0.6;
        const barrelWidth = 4;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);

        this.spriteRenderer.drawRect(this.ctx, -half + 2, -half + 2, size - 4, size - 4, {
            color: bodyColor, strokeColor: darkColor, strokeWidth: 2,
        });
        this.spriteRenderer.drawRect(this.ctx, -barrelWidth / 2, -barrelLength, barrelWidth, barrelLength, { color: darkColor });
        this.spriteRenderer.drawRect(this.ctx, -half + 4, -half + 4, 4, 4, { color: darkColor });
        this.spriteRenderer.drawRect(this.ctx, half - 8, -half + 4, 4, 4, { color: darkColor });
        this.spriteRenderer.drawRect(this.ctx, -half + 4, half - 8, 4, 4, { color: darkColor });
        this.spriteRenderer.drawRect(this.ctx, half - 8, half - 8, 4, 4, { color: darkColor });

        this.ctx.restore();
    }

    private drawBullets() {
        for (const bullet of this.bullets) {
            if (!bullet.isAlive) continue;
            const pos = bullet.position;
            const size = bullet.config.size;

            const sprite = this.assetLoader.get('bullet');
            if (sprite) {
                this.spriteRenderer.drawSpriteAt(this.ctx, sprite, pos.x, pos.y);
            } else {
                this.spriteRenderer.drawCircle(this.ctx, pos.x, pos.y, size / 2, {
                    color: '#fbbf24', strokeColor: '#f59e0b', strokeWidth: 1,
                });
            }
        }
    }

    private drawEnemies() {
        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;
            const pos = enemy.position;
            const rotation = enemy.rotation;
            const size = enemy.config.size;

            this.drawTankPlaceholder(pos.x, pos.y, size, rotation, enemy.config.color, enemy.config.darkColor);

            if (enemy.health < enemy.config.health) {
                this.spriteRenderer.drawHealthBar(
                    this.ctx, pos.x - size / 2, pos.y - size / 2 - 8, size, 4,
                    enemy.health, enemy.config.health
                );
            }
        }
    }

    public drawEntitiesState = () => {
        if (!this.tank) return;
        if (this.tank.health < 100) {
            const pos = this.tank.position;
            const size = this.tank.gameObject.transform.scale.x;
            this.spriteRenderer.drawHealthBar(
                this.ctx, pos.x - size / 2, pos.y - size / 2 - 8, size, 4,
                this.tank.health, 100
            );
        }
    };

    public drawEffects = () => {};
}
