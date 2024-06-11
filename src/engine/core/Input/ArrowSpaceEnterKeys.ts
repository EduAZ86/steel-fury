
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
    private _handleKeys: (event: KeyboardEvent) => void;
    keyMap: any

    constructor() {
        this.arrowLeft = false;
        this.arrowRight = false;
        this.arrowUp = false;
        this.arrowDown = false;
        this.space = false;
        this.esc = false;
        this.enter = false;
        this._trackingKeys = false;
        this._handleKeys = this.updateKeys.bind(this);
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

    private updateKeys(event: KeyboardEvent): void {
        this.hashKeys[event.key] = true;

    }

    public getKeys() {
        if (!this._trackingKeys) {
            document.addEventListener('keydown', this._handleKeys);
            document.addEventListener('keyup', this._handleKeys);
            this._trackingKeys = true;
        }
    }

    public stopTracking() {
        if (this._trackingKeys) {
            document.removeEventListener('keydown', this._handleKeys);
            document.removeEventListener('keyup', this._handleKeys);
            this._trackingKeys = false;
        }
    }

}