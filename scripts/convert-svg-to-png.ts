import sharp from 'sharp';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const TEXTURES_DIR = join(process.cwd(), 'public', 'assets', 'textures');
const SCALE = 2;

async function convertDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            await convertDir(fullPath);
        } else if (entry.name.endsWith('.svg')) {
            const pngName = entry.name.replace('.svg', '.png');
            const outPath = join(dir, pngName);
            if (existsSync(outPath)) continue;

            const svgBuffer = readFileSync(fullPath);
            try {
                await sharp(svgBuffer)
                    .resize(32 * SCALE, 32 * SCALE)
                    .png()
                    .toFile(outPath);
                console.log(`  ${join(entry.parentPath ?? dir, entry.name)} -> ${pngName}`);
            } catch (err) {
                console.error(`  FAILED: ${entry.name}`, err);
            }
        }
    }
}

async function main() {
    console.log('Converting SVG textures to PNG...');
    await convertDir(TEXTURES_DIR);
    console.log('Done.');
}

main();
