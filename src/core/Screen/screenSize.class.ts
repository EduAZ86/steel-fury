export class ScreenSize {
    private width: number
    private height: number
    constructor() {
        this.width = ((typeof window !== 'undefined') && window.innerWidth) || ((typeof document !== 'undefined') && document.documentElement.clientWidth) || ((typeof document !== 'undefined') && document.body.clientWidth) || 0;
        this.height = ((typeof window !== 'undefined') && window.innerHeight) || ((typeof document !== 'undefined') && document.documentElement.clientHeight) || ((typeof document !== 'undefined') && document.body.clientHeight) || 0;
    }

    public start() {
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", this.updateDimensions.bind(this));
        }
    }

    private updateDimensions() {
        if (typeof window !== 'undefined') {
            this.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            console.log(`width: ${this.width} | height ${this.height}`);

        }
    }

    public getWidth() {
        return this.width
    }
    public getheight() {
        return this.height
    }
};