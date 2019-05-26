import { Body } from './body';
import { Point } from './point';
import { Leg } from './leg';
export class BugBody extends Body {
    private _legs: Leg[];
    private _prevPos: Point;
    private _moveDistance: number;
    constructor(length: number, space: number) {
        super(length, space);
        this._legs = [];
        this._prevPos = new Point(0, 0);
        this._moveDistance = 0;
    }
    public addLeg(...leg: Leg[]) {
        this._legs.push(...leg);
    }
    public setHead(pos: Point) {
        super.setHead(pos);
        this._moveDistance += pos.distance(this._prevPos);
        pos.copyTo(this._prevPos);
    }
    protected updateJoints() {
        super.updateJoints();
        this._legs.forEach((leg) => {
            leg.moveDistance = this._moveDistance;
        });
    }
}