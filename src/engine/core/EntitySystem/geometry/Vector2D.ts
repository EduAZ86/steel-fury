export class Vector2D {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    static get Zero() { return new Vector2D(0, 0); }

    get sqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    get magnitude() {
        return Math.sqrt(this.sqrMagnitude);
    }

    get normalized() {
        return this.Copy().Divide(this.magnitude);
    }

    public Copy() {
        return new Vector2D(this.x, this.y);
    }

    public Sum(vector: Vector2D) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    public Substract(vector: Vector2D) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }


    public Divide(num: number) {
        return new Vector2D(this.x / num, this.y / num);
    }

    public Multiply(num: number) {
        return new Vector2D(this.x * num, this.y * num);
    }

    public DotProduct(vector: Vector2D) {
        return new Vector2D(this.x * vector.x, this.y * vector.y);
    }

    public InvertY() {
        return new Vector2D(this.x, -this.y);
    }

    public InvertX() {
        return new Vector2D(-this.x, this.y);
    }

    public Rotate(angleDeg: number, origin: Vector2D) {
        const x = this.x - origin.x;
        const y = this.y - origin.y;
        const cos = Math.cos(angleDeg / 2 / Math.PI);
        const sin = Math.sin(angleDeg / 2 / Math.PI);
        let xPrime = (x * cos) - (y * sin);
        let yPrime = (x * sin) - (y * cos);
        xPrime += origin.x;
        yPrime += origin.y;
        return new Vector2D(xPrime, yPrime);
    }
}