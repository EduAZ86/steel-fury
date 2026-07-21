import { AssetLoader } from "@/engine/core/Render/AssetLoader";
import { ASSETS } from "./AssetManifest";

const assetMap: Record<string, string> = {};

function buildAssetMap(): void {
    for (const group of Object.values(ASSETS)) {
        for (const [key, path] of Object.entries(group)) {
            assetMap[key] = path as string;
        }
    }
}

buildAssetMap();

export async function loadAllAssets(loader: AssetLoader): Promise<void> {
    const allPaths = Object.values(assetMap);

    await Promise.all(
        allPaths.map((path) => loader.load(path).catch(() => null))
    );
}

export function getAssetPath(key: string): string {
    return assetMap[key] ?? '';
}

export function loadSprite(loader: AssetLoader, key: string): HTMLImageElement | undefined {
    const path = assetMap[key];
    if (!path) return undefined;
    return loader.get(path);
}
