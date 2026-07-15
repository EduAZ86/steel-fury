import { CanvasHandler } from "./canvasHandler";
import { SpriteRenderer } from "./spritesRender";
import { AssetLoader } from "./AssetLoader";
import { tileType } from "./types";
import { Tank } from "@/engine/instancies/tank";
import { Bullet } from "@/engine/instancies/bullet";

export interface MapData {
    tiles: tileType[][];
    tileSize: number;
}

const TILE_COLORS: Record<tileType, string> = {
    empty: '#1a1a2e',
    brick: '#b45309',
    steel: '#9ca3af',
    water: '#3b82f6',
    forest: '#166534',
    base: '#dc2626',
};

export class RenderSystem {
    private ctx: CanvasRenderingContext2D;
    private spriteRenderer: SpriteRenderer;
    private assetLoader: AssetLoader;
    private canvasHandler: CanvasHandler;

    private mapData: MapData | null = null;
    private tank: Tank | null = null;
    private bullets: Bullet[] = [];

    constructor(
        canvasHandler: CanvasHandler,
        spriteRenderer: SpriteRenderer,
        assetLoader: AssetLoader
    ) {
        this.canvasHandler = canvasHandler;
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

    public drawMap = () => {
        if (!this.mapData) return;

        const { tiles, tileSize } = this.mapData;

        for (let row = 0; row < tiles.length; row++) {
            for (let col = 0; col < tiles[row].length; col++) {
                const tile = tiles[row][col];
                const x = col * tileSize;
                const y = row * tileSize;

                this.drawRectTile(x, y, tileSize, tile);
            }
        }
    };

    private drawRectTile(x: number, y: number, size: number, tile: tileType) {
        const baseColor = TILE_COLORS[tile];
        const half = size / 2;

        this.spriteRenderer.drawRect(this.ctx, x, y, size, size, {
            color: '#1a1a2e',
        });

        if (tile === 'empty') return;

        if (tile === 'brick') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: baseColor });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + 2, half - 3, half - 3, { color: '#92400e' });
            this.spriteRenderer.drawRect(this.ctx, x + half + 1, y + 2, half - 3, half - 3, { color: '#92400e' });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + half + 1, half - 3, half - 3, { color: '#92400e' });
            this.spriteRenderer.drawRect(this.ctx, x + half + 1, y + half + 1, half - 3, half - 3, { color: '#92400e' });
        } else if (tile === 'steel') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: baseColor, strokeColor: '#6b7280', strokeWidth: 1 });
            this.spriteRenderer.drawRect(this.ctx, x + 4, y + 4, size - 8, size - 8, { color: '#d1d5db' });
        } else if (tile === 'water') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: '#1e40af' });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + size / 3, size - 4, 3, { color: '#60a5fa', alpha: 0.7 });
            this.spriteRenderer.drawRect(this.ctx, x + 6, y + size * 2 / 3, size - 12, 2, { color: '#93c5fd', alpha: 0.5 });
        } else if (tile === 'forest') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: '#1a1a2e' });
            this.spriteRenderer.drawRect(this.ctx, x + 2, y + 2, size - 4, size - 4, { color: baseColor });
            this.spriteRenderer.drawCircle(this.ctx, x + half, y + half, half - 4, { color: '#22c55e', alpha: 0.6 });
        } else if (tile === 'base') {
            this.spriteRenderer.drawRect(this.ctx, x, y, size, size, { color: '#7f1d1d', strokeColor: '#dc2626', strokeWidth: 2 });
            this.spriteRenderer.drawCircle(this.ctx, x + half, y + half, half / 2, { color: '#fbbf24' });
        }
    }

    public drawEntities = () => {
        this.drawBullets();
        this.drawTank();
    };

    private drawTank() {
        if (!this.tank) return;

        const pos = this.tank.position;
        const rotation = this.tank.rotation;
        const size = this.tank.gameObject.transform.scale.x;

        const sprite = this.assetLoader.get('playerTank');
        if (sprite) {
            this.spriteRenderer.drawSpriteAt(this.ctx, sprite, pos.x, pos.y, {
                rotation,
            });
        } else {
            this.drawTankPlaceholder(pos.x, pos.y, size, rotation);
        }
    }

    private drawTankPlaceholder(x: number, y: number, size: number, rotation: number) {
        const half = size / 2;
        const barrelLength = size * 0.6;
        const barrelWidth = 4;
        const bodyColor = '#4ade80';
        const darkBody = '#166534';

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((rotation * Math.PI) / 180);

        this.spriteRenderer.drawRect(this.ctx, -half + 2, -half + 2, size - 4, size - 4, {
            color: bodyColor,
            strokeColor: darkBody,
            strokeWidth: 2,
        });

        this.spriteRenderer.drawRect(this.ctx, -barrelWidth / 2, -barrelLength, barrelWidth, barrelLength, {
            color: darkBody,
        });

        this.spriteRenderer.drawRect(this.ctx, -half + 4, -half + 4, 4, 4, { color: darkBody });
        this.spriteRenderer.drawRect(this.ctx, half - 8, -half + 4, 4, 4, { color: darkBody });
        this.spriteRenderer.drawRect(this.ctx, -half + 4, half - 8, 4, 4, { color: darkBody });
        this.spriteRenderer.drawRect(this.ctx, half - 8, half - 8, 4, 4, { color: darkBody });

        this.ctx.restore();
    }

    private drawBullets() {
        for (const bullet of this.bullets) {
            if (!bullet.isAlive) continue;

            const pos = bullet.position;
            const size = bullet.gameObject.transform.scale.x;

            const sprite = this.assetLoader.get('bullet');
            if (sprite) {
                this.spriteRenderer.drawSpriteAt(this.ctx, sprite, pos.x, pos.y);
            } else {
                this.spriteRenderer.drawCircle(this.ctx, pos.x, pos.y, size / 2, {
                    color: '#fbbf24',
                    strokeColor: '#f59e0b',
                    strokeWidth: 1,
                });
            }
        }
    }

    public drawEntitiesState = () => {
        if (!this.tank) return;

        if (this.tank.health < 100) {
            const pos = this.tank.position;
            const size = this.tank.gameObject.transform.scale.x;
            const barWidth = size;
            const barHeight = 4;
            const barX = pos.x - barWidth / 2;
            const barY = pos.y - size / 2 - barHeight - 4;

            this.spriteRenderer.drawHealthBar(
                this.ctx, barX, barY, barWidth, barHeight,
                this.tank.health, 100
            );
        }
    };

    public drawEffects = () => {
        // placeholder para explosiones/particulas
    };
}
