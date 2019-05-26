export class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public distance(p: Point): number {
        const dx = p.x - this.x;
        const dy = p.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    public copyTo(p: Point) {
        p.x = this.x;
        p.y = this.y;
    }
    public clone() {
        return new Point(this.x, this.y);
    }
}