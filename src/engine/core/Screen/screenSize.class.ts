export type ResizeCallback = (width: number, height: number) => void;

export class ScreenSize {
    private width: number;
    private height: number;
    private _onResize: ResizeCallback | null = null;

    constructor() {
        this.width = this.getWidthFromWindow();
        this.height = this.getHeightFromWindow();
    }

    private getWidthFromWindow(): number {
        if (typeof window !== 'undefined') return window.innerWidth;
        if (typeof document !== 'undefined') return document.documentElement.clientWidth || 0;
        return 0;
    }

    private getHeightFromWindow(): number {
        if (typeof window !== 'undefined') return window.innerHeight;
        if (typeof document !== 'undefined') return document.documentElement.clientHeight || 0;
        return 0;
    }

    public start() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.updateDimensions.bind(this));
        }
    }

    public stop() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.updateDimensions.bind(this));
        }
    }

    private updateDimensions() {
        this.width = this.getWidthFromWindow();
        this.height = this.getHeightFromWindow();
        if (this._onResize) {
            this._onResize(this.width, this.height);
        }
    }

    public set onResize(callback: ResizeCallback) {
        this._onResize = callback;
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }
}
