import { Point } from './point';
export class Body {
    private _length: number;
    private _spaces: number[];
    private _joints: Array<Point>;
    private _points: Array<Point>;
    constructor(length: number, spaces: number[]) {
        this._length = length;
        this._spaces = spaces;
        this._joints = [];
        this._points = [];
        for (let i = 0; i < length; i++) {
            this._joints.push(new Point(0, 0));
        }
    }
    public setHead(pos: Point) {
        this._points.unshift(pos);
        this.updateJoints();
    }
    private updateJoints() {
        if (this._points.length < 2) return;
        this._joints[0] = this._points[0].clone();
        let beginPoint: Point = this._points[0].clone();
        let beginPointIndex: number = 1;
        let completed = 0;
        for (let ji = 1; ji < this._joints.length; ji++) {
            let currentDistance: number = 0;
            const joint = this._joints[ji];
            const space = this._spaces[ji - 1];
            for (let ri = beginPointIndex; ri < this._points.length; ri++) {
                const point = this._points[ri];
                const prevDistance = currentDistance;
                currentDistance += beginPoint.distance(point);
                if (currentDistance > space) {
                    const magnitude = space - prevDistance;
                    const distance = point.distance(beginPoint);
                    beginPoint.x += (point.x - beginPoint.x) / distance * magnitude;
                    beginPoint.y += (point.y - beginPoint.y) / distance * magnitude;
                    joint.x = beginPoint.x;
                    joint.y = beginPoint.y;
                    beginPointIndex = ri;
                    completed++;
                    break;
                }
                beginPoint = point.clone();
            }
        }
        if (completed == this._length - 1) {
            this._points.length = beginPointIndex + 1;
        }
    }
    public get joints() {
        return this._joints;
    }
    public get points() {
        return this._points;
    }
}