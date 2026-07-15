export interface DrawSpriteOptions {
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    alpha?: number;
    pivotX?: number;
    pivotY?: number;
}

export interface DrawRectOptions {
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    alpha?: number;
}

export interface DrawTextOptions {
    color?: string;
    font?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
}

export interface DrawCircleOptions {
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    alpha?: number;
}
