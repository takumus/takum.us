import { Leg, LRPosition as PositionLR, MoveStyles } from './leg';
import { Body, JointPoint} from './body';
import { Point } from './point';
export class NormalLeg extends Leg {
    private _directionFB: PositionFB;
    public _l1l: number;
    public _l2l: number;
    public _bone: Bone;
    constructor(
        body: Body,
        stride: number,
        targetRootIndex: number,
        rootIndex: number,
        positionFB: PositionFB,
        positionLR: PositionLR,
        rootPointDistanceFromBody: number,
        endPointDistanceFromBody: number,
        stepOffset: number,
        l1l: number,
        l2l: number
    ) {
        super(body);
        this.positionLR = positionLR;
        this.positionFB = positionFB;
        this.stride = stride;
        this.endPointDistanceFromBody = endPointDistanceFromBody;
        this.rootPointDistanceFromBody = rootPointDistanceFromBody;
        this.targetRootIndex = targetRootIndex;
        this.stepOffset = stepOffset;
        this.rootIndex = rootIndex;
        this.l1l = l1l;
        this.l2l = l2l;
        this.moveStyle = (n) => Math.pow(MoveStyles.sin(n), 1.7);
        this._bone = {
            rootPosition: new Point(0, 0),
            middlePosition: new Point(0, 0),
            endPosition: new Point(0, 0)
        }
    }
    public set l1l(value: number) {
        this._l1l = value;
    }
    public set l2l(value: number) {
        this._l2l = value;
    }
    public set positionFB(value: PositionFB) {
        this._directionFB = value;
    }
    public calcLeg(fromPos: Point, targetPos: Point) {
        this._bone = this.getBone(
            fromPos,
            targetPos,
            this._l1l, this._l2l,
            this._directionFB,
            this.positionLR
        );
    }
    public get bone() {
        return this._bone;
    }
    private getBone(fromPos: Point, toPos: Point, l1: number, l2: number, fb: number, lr: number): Bone {
        const r = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const a = fromPos.distance(toPos);
        let b = l1;
        let c = l2;
        const minA = a * 1.05;
        const bc = b + c;
        if (b + c < minA) {
            c = c / bc * minA;
            b = b / bc * minA;
        }
        const rc = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        const rr = r + (fb * lr < 0 ? rc : -rc);
        const x = Math.cos(rr) * b + fromPos.x;
        const y = Math.sin(rr) * b + fromPos.y;
        return {
            rootPosition: fromPos.clone(),
            middlePosition: new Point(x, y),
            endPosition: toPos.clone()
        };
    }
}
export type Bone = {
    rootPosition: Point,
    middlePosition: Point,
    endPosition: Point
}
export enum PositionFB {
    FRONT = 1,
    BACK = -1
}