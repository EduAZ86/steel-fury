export class AssetLoader {
    private _cache: Map<string, HTMLImageElement> = new Map();
    private _loading: Map<string, Promise<HTMLImageElement>> = new Map();

    public load(src: string): Promise<HTMLImageElement> {
        const cached = this._cache.get(src);
        if (cached) return Promise.resolve(cached);

        const pending = this._loading.get(src);
        if (pending) return pending;

        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this._cache.set(src, img);
                this._loading.delete(src);
                resolve(img);
            };
            img.onerror = () => {
                this._loading.delete(src);
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });

        this._loading.set(src, promise);
        return promise;
    }

    public get(src: string): HTMLImageElement | undefined {
        return this._cache.get(src);
    }

    public has(src: string): boolean {
        return this._cache.has(src);
    }

    public isLoaded(src: string): boolean {
        return this._cache.has(src) && !this._loading.has(src);
    }

    public get loadingCount(): number {
        return this._loading.size;
    }
}
