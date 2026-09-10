import { CanvasHandler } from "./canvasHandler";
import { SpriteRenderer } from "./spritesRender";
import { AssetLoader } from "./AssetLoader";

export interface IRenderable {
    name: string;
    position: { x: number; y: number };
    rotation: number;
    scale: { x: number; y: number };
}

export interface IMapDataProvider {
    drawMap(): void;
}

export interface IGameRenderer {
    drawMap(): void;
    drawEntities(): void;
    drawEntitiesState(): void;
    drawEffects(): void;
}

export class RenderSystem implements IGameRenderer {
    protected ctx: CanvasRenderingContext2D;
    protected spriteRenderer: SpriteRenderer;
    protected assetLoader: AssetLoader;
    protected canvasHandler: CanvasHandler;

    private gameRenderer: IGameRenderer | null = null;

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

    public setGameRenderer(renderer: IGameRenderer) {
        this.gameRenderer = renderer;
    }

    public get SpriteRenderer(): SpriteRenderer {
        return this.spriteRenderer;
    }

    public get AssetLoader(): AssetLoader {
        return this.assetLoader;
    }

    public get CanvasHandler(): CanvasHandler {
        return this.canvasHandler;
    }

    public drawMap = () => {
        this.gameRenderer?.drawMap();
    };

    public drawEntities = () => {
        this.gameRenderer?.drawEntities();
    };

    public drawEntitiesState = () => {
        this.gameRenderer?.drawEntitiesState();
    };

    public drawEffects = () => {
        this.gameRenderer?.drawEffects();
    };
}
