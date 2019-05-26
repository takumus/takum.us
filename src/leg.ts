import {Point} from './point';
import {Body} from './body';
export abstract class Leg {
    private _stride: number;
    private _halfStride: number;
    private _step: number = 0;
    private _targetDistance: number;
    private _body: Body;
    private _targetRootIndex: number;
    private _rootIndex: number;
    private _nextPos: Point;
    private _prevPos: Point;
    private _nowPos: Point;
    private _directionLR: LRPosition;
    private _stepOffset: number;
    private _endPointDistanceFromBody: number;
    private _rootPointDistanceFromBody: number;
    private _beginMovePos: Point;
    private _endMovePos: Point;
    private _moveProgress: number;
    private _moveStyle: LegMoveStyle;
    constructor(body: Body) {
        this._nowPos = new Point(0, 0);
        this._nextPos = new Point(0, 0);
        this._prevPos = new Point(0, 0);
        this._beginMovePos = new Point(0, 0);
        this._endMovePos = new Point(0, 0);
        this.body = body;
        this.moveStyle = MoveStyles.sin;
    }
    public set moveStyle(style: LegMoveStyle) {
        this._moveStyle = style;
    }
    public set endPointDistanceFromBody(value: number) {
        this._endPointDistanceFromBody = value;
    }
    public set rootPointDistanceFromBody(value: number) {
        this._rootPointDistanceFromBody = value;
    }
    public set body(body: Body) {
        this._body = body;
    }
    public set stride(value: number) {
        this._stride = value;
        this._halfStride = value / 2;
    }
    public set targetRootIndex(id: number) {
        this._targetRootIndex = Math.floor(id);
    }
    public set rootIndex(id: number) {
        this._rootIndex = Math.floor(id);
    }
    public set stepOffset(value: number) {
        this._stepOffset = Math.floor(value);
    }
    public set positionLR(value: LRPosition) {
        this._directionLR = value;
    }
    public set moveDistance(value: number) {
        value += this._stepOffset;
        const stepRate = value % this._stride;
        const halfStepRate = stepRate % this._halfStride;
        const step = Math.floor(value / this._stride);
        const diffStep = Math.abs(this._step - step);
        if (diffStep > 0) {
            this._step = step;
            const nextPos = this.getTargetPos(this._targetRootIndex, this._directionLR, this._endPointDistanceFromBody);
            if (diffStep == 1) {
                this._nextPos.copyTo(this._prevPos);
                nextPos.copyTo(this._nextPos);
            }else if (diffStep > 1) {
                this._nextPos = this.getTargetPos(this._targetRootIndex, this._directionLR, this._endPointDistanceFromBody);
                this._prevPos = this.getTargetPos(this._targetRootIndex, this._directionLR, this._endPointDistanceFromBody);
            }
        }
        const br = (stepRate > this._halfStride) ? 1 : halfStepRate / this._halfStride;
        let r = this._moveStyle(br);
        this._moveProgress = r;
        this._nowPos.x = (this._nextPos.x - this._prevPos.x) * r + this._prevPos.x;
        this._nowPos.y = (this._nextPos.y - this._prevPos.y) * r + this._prevPos.y;
        
        this._beginMovePos.x = this._prevPos.x;
        this._beginMovePos.y = this._prevPos.y;
        this._endMovePos.x = this._nextPos.x;
        this._endMovePos.y = this._nextPos.y;

        const rootPos = this._body.joints[this._rootIndex];
        const fromPos = this.getRootPos(this._rootIndex);

        if (fromPos && rootPos) this.calcLeg(fromPos, this._nowPos);
    }
    private getRootPos(baseId: number) {
        const basePos = this._body.joints[baseId];
        if (!basePos) return null;
        let pos1 = basePos;
        let pos2 = this._body.joints[baseId + 1];
        if (!pos2) {
            pos1 = this._body.joints[baseId - 1];
            pos2 = basePos;
        }
        const ddx = pos2.x - pos1.x;
        const ddy = pos2.y - pos1.y;
        const D = Math.sqrt(ddx * ddx + ddy * ddy);
        const dx = ddx / D;
        const dy = ddy / D;
        return new Point(
            basePos.x + -this._directionLR * dy * this._rootPointDistanceFromBody,
            basePos.y + this._directionLR * dx * this._rootPointDistanceFromBody
        )
    }
    public abstract calcLeg(fromPos: Point, targetPos: Point);
    public get moveProgress() {
        return this._moveProgress;
    }
    public get beginMovePos() {
        return this._beginMovePos;
    }
    public get endMovePos() {
        return this._endMovePos;
    }
    public get positionLR() {
        return this._directionLR;
    }
    private getTargetPos(id: number, d: number, length: number): Point {
        console.log(id);
        let fp = this._body.joints[id];
        if (!fp) return new Point(0, 0);
        const vx = (d < 0) ? fp.vy : -fp.vy;
        const vy = (d < 0) ? -fp.vx : fp.vx;
        return new Point(
            fp.x + vx * length,
            fp.y + vy * length
        );
    }
}
export enum LRPosition {
    LEFT = 1,
    RIGHT = -1
}
export type LegMoveStyle = (n: number) => number;
export namespace MoveStyles {
    export const normal: LegMoveStyle = (n: number) => n;
    export const sin: LegMoveStyle = (n: number) => (Math.cos(n * Math.PI + Math.PI) + 1) / 2;
    export const sinHalfB: LegMoveStyle = (n: number) => Math.sin(n * Math.PI / 2);
    export const sinHalfA: LegMoveStyle = (n: number) => Math.sin(n * Math.PI / 2 - Math.PI / 2) + 1;
}