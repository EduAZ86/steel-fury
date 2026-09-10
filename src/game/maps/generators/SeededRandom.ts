export class SeededRandom {
    private state: number;

    constructor(seed: number) {
        this.state = seed | 0;
    }

    public next(): number {
        this.state = (this.state + 0x6d2b79f5) | 0;
        let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    public nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    public nextFloat(min: number, max: number): number {
        return this.next() * (max - min) + min;
    }

    public pick<T>(array: T[]): T {
        return array[this.nextInt(0, array.length - 1)];
    }

    public chance(probability: number): boolean {
        return this.next() < probability;
    }
}
