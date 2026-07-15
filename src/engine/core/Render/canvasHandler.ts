export class CanvasHandler {
    private _canvas: HTMLCanvasElement | null = null;
    private _ctx: CanvasRenderingContext2D | null = null;

    init(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
    }

    resize(width: number, height: number) {
        if (!this._canvas || !this._ctx) return;
        this._canvas.width = width;
        this._canvas.height = height;
    }

    clear() {
        if (!this._ctx) return;
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    fillBackground(color: string) {
        if (!this._ctx) return;
        this._ctx.fillStyle = color;
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    get context(): CanvasRenderingContext2D {
        if (!this._ctx) throw new Error('Canvas not initialized. Call init() first.');
        return this._ctx;
    }

    get canvas(): HTMLCanvasElement {
        if (!this._canvas) throw new Error('Canvas not initialized. Call init() first.');
        return this._canvas;
    }

    get width(): number {
        return this._canvas?.width ?? 0;
    }

    get height(): number {
        return this._canvas?.height ?? 0;
    }
}
