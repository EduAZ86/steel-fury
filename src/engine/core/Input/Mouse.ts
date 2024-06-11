import { Vector2D } from "../EntitySystem/geometry/Vector2D";

export class MouseInput {
    private _mousePosition: Vector2D;
    private _isTracking: boolean;
    private _handleMouseMove: (event: MouseEvent) => void;
    private _handleMouseClick: (event: MouseEvent) => void;
    private _handleMouseScroll: (event: WheelEvent) => void;
    public leftClick: boolean;
    public rightClick: boolean;
    public scrollDelta: number;
    constructor() {
        this._mousePosition = new Vector2D(0, 0);
        this._isTracking = false;
        this._handleMouseMove = this.updateMousePosition.bind(this);
        this._handleMouseClick = this.updateMouseClick.bind(this);
        this._handleMouseScroll = this.updateMouseScroll.bind(this);
        this.leftClick = false;
        this.rightClick = false;
        this.scrollDelta = 0;
    }

    public get mousePosition(): Vector2D {
        return this._mousePosition;
    }

    private updateMouseClick(event: MouseEvent): void {
        if (event.button === 0) {
            this.leftClick = true;
        } else if (event.button === 2) {
            this.rightClick = true;
        }
    }

    private updateMouseScroll(event: WheelEvent): void {
        this.scrollDelta = event.deltaY;
    }

    public getMousePosition(): void {
        if (!this._isTracking) {
            document.addEventListener('mousemove', this._handleMouseMove);
            document.addEventListener('wheel', this._handleMouseScroll);
            document.addEventListener('click', this._handleMouseClick)
            this._isTracking = true;
        }
    }

    public stopTracking(): void {
        if (this._isTracking) {
            document.removeEventListener('mousemove', this._handleMouseMove);
            document.removeEventListener('wheel', this._handleMouseScroll);
            document.removeEventListener('click', this._handleMouseClick)
            this._isTracking = false;
        }
    }


    private updateMousePosition(event: MouseEvent): void {
        this._mousePosition = new Vector2D(event.clientX, event.clientY);
    }
}