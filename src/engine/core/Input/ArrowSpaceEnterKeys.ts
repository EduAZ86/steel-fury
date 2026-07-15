
export interface keys {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
    space: boolean;
    esc: boolean;
    enter: boolean;
}

export class ArrowSpaceEnterEscKeys {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
    space: boolean;
    esc: boolean;
    enter: boolean;
    private _trackingKeys: boolean;
    private _handleKeyDown: (event: KeyboardEvent) => void;
    private _handleKeyUp: (event: KeyboardEvent) => void;
    private keyMap: Record<string, keyof keys>;

    constructor() {
        this.arrowLeft = false;
        this.arrowRight = false;
        this.arrowUp = false;
        this.arrowDown = false;
        this.space = false;
        this.esc = false;
        this.enter = false;
        this._trackingKeys = false;
        this._handleKeyDown = this.onKeyDown.bind(this);
        this._handleKeyUp = this.onKeyUp.bind(this);
        this.keyMap = {
            'ArrowLeft': 'arrowLeft',
            'ArrowRight': 'arrowRight',
            'ArrowUp': 'arrowUp',
            'ArrowDown': 'arrowDown',
            ' ': 'space',
            'Escape': 'esc',
            'Enter': 'enter'
        };
    }

    public get keysStatus(): keys {
        return {
            arrowLeft: this.arrowLeft,
            arrowRight: this.arrowRight,
            arrowUp: this.arrowUp,
            arrowDown: this.arrowDown,
            space: this.space,
            esc: this.esc,
            enter: this.enter,
        };
    }

    private onKeyDown(event: KeyboardEvent): void {
        const prop = this.keyMap[event.key];
        if (prop) {
            this[prop] = true;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        const prop = this.keyMap[event.key];
        if (prop) {
            this[prop] = false;
        }
    }

    public getKeys() {
        if (!this._trackingKeys) {
            document.addEventListener('keydown', this._handleKeyDown);
            document.addEventListener('keyup', this._handleKeyUp);
            this._trackingKeys = true;
        }
    }

    public stopTracking() {
        if (this._trackingKeys) {
            document.removeEventListener('keydown', this._handleKeyDown);
            document.removeEventListener('keyup', this._handleKeyUp);
            this._trackingKeys = false;
        }
    }

}
