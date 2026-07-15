import { DrawCircleOptions, DrawRectOptions, DrawSpriteOptions, DrawTextOptions } from "./types";

export class SpriteRenderer {

    public drawSprite(
        ctx: CanvasRenderingContext2D,
        image: HTMLImageElement,
        x: number,
        y: number,
        options: DrawSpriteOptions = {}
    ) {
        const {
            rotation = 0,
            scaleX = 1,
            scaleY = 1,
            alpha = 1,
            pivotX = 0.5,
            pivotY = 0.5,
        } = options;

        ctx.save();
        ctx.globalAlpha = alpha;

        const cx = x + image.width * pivotX;
        const cy = y + image.height * pivotY;

        ctx.translate(cx, cy);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scaleX, scaleY);

        ctx.drawImage(
            image,
            -image.width * pivotX,
            -image.height * pivotY,
            image.width,
            image.height
        );

        ctx.restore();
    }

    public drawSpriteAt(
        ctx: CanvasRenderingContext2D,
        image: HTMLImageElement,
        centerX: number,
        centerY: number,
        options: DrawSpriteOptions = {}
    ) {
        const {
            rotation = 0,
            scaleX = 1,
            scaleY = 1,
            alpha = 1,
        } = options;

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scaleX, scaleY);

        ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2,
            image.width,
            image.height
        );

        ctx.restore();
    }

    public drawRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        options: DrawRectOptions = {}
    ) {
        const { color = '#000', strokeColor, strokeWidth = 1, alpha = 1 } = options;

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);

        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.strokeRect(x, y, width, height);
        }

        ctx.restore();
    }

    public drawCircle(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        options: DrawCircleOptions = {}
    ) {
        const { color = '#000', strokeColor, strokeWidth = 1, alpha = 1 } = options;

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (color) {
            ctx.fillStyle = color;
            ctx.fill();
        }

        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }

        ctx.restore();
    }

    public drawText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        options: DrawTextOptions = {}
    ) {
        const { color = '#000', font = '16px monospace', align = 'left', baseline = 'top' } = options;

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    public drawHealthBar(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        health: number,
        maxHealth: number
    ) {
        const ratio = Math.max(0, Math.min(1, health / maxHealth));
        const barColor = ratio > 0.5 ? '#4ade80' : ratio > 0.25 ? '#facc15' : '#ef4444';

        this.drawRect(ctx, x, y, width, height, { color: '#333', strokeColor: '#000', strokeWidth: 1 });
        this.drawRect(ctx, x + 1, y + 1, (width - 2) * ratio, height - 2, { color: barColor });
    }
}
