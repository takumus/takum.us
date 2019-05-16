import * as PIXI from 'pixi.js';

function init() {
    console.log("init");
    const app = new PIXI.Application({
        width: 512,
        height: 512,
        resolution: window.devicePixelRatio
    });
    const background = new PIXI.Graphics();
    const joints = new PIXI.Graphics();
    const lines = new PIXI.Graphics();
    const points = new Points(8, [
        60,
        30,
        30,
        60,
        30,
        30,
        60
    ]);// 関節数, 関節間隔
    const bodyWidth = 16;
    let dragging = false;
    document.body.appendChild(app.view);
    app.view.style.transform = `scale(${(1 / window.devicePixelRatio)})`;
    app.view.style.transformOrigin = "left top";
    app.stage.interactive = true;
    app.stage.addChild(background, lines, joints);
    background.beginFill(0x000000);
    background.drawRect(0, 0, app.view.width, app.view.height);
    lines.lineStyle(1, 0x333333);
    app.stage.on("pointerdown", (e: PIXI.interaction.InteractionEvent) => {
        addPoint(e.data.global);
        dragging = true;
    });
    app.stage.on("pointerup", (e: PIXI.interaction.InteractionEvent) => {
        dragging = false;
    });
    app.stage.on("pointermove", (e: PIXI.interaction.InteractionEvent) => {
        if (dragging) addPoint(e.data.global);
    });
    function addPoint(p: {x: number, y: number}) {
        points.setHead(new Point(p.x, p.y));
        joints.clear();
        lines.clear();
        for (let i = 0; i < points.bone.length - 1; i++){
            const b = points.bone[i];
            const nb = points.bone[i + 1];// 次の関節
            const bd = b.distance(nb);
            const vx = (b.x - nb.x) / bd;
            const vy = (b.y - nb.y) / bd;
            joints.beginFill(0xCCCCCC, 0.4);
            joints.drawPolygon([
                b.x, b.y,
                nb.x + vy * bodyWidth / 2, nb.y - vx * bodyWidth / 2, 
                nb.x - vy * bodyWidth / 2, nb.y + vx * bodyWidth / 2
            ]);
            joints.beginFill(0xCCCCCC);
            joints.drawCircle(nb.x, nb.y, bodyWidth / 2);
        };
        points.rawPoints.forEach((p, i) => {
            if (i == 0) {
                lines.moveTo(p.x, p.y);
                return;
            }
            lines.lineTo(p.x, p.y);
        });
    }
    addPoint({ x: 10, y: 10 });
    addPoint({ x: 400, y: 400 });
}
class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public distance(p: Point):number {
        const dx = p.x - this.x;
        const dy = p.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    public clone() {
        return new Point(this.x, this.y);
    }
}
class Points {
    private _length: number;
    private _spaces: number[];
    private _bone: Array<Point>;
    private _rawPoints: Array<Point>;
    constructor(length: number, spaces: number[]) {
        this._length = length;
        this._spaces = spaces;
        this._bone = [];
        this._rawPoints = [];
        for (let i = 0; i < length; i++) {
            this._bone.push(new Point(0, 0));
        }
    }
    public setHead(pos: Point) {
        this._rawPoints.unshift(pos);
        this.updateBone();
    }
    private updateBone() {
        if (this._rawPoints.length < 2) return;
        this._bone[0] = this._rawPoints[0].clone();
        let pp: Point = this._rawPoints[0].clone();
        let ci: number = 1;
        let completed = 0;
        for (let bi = 1; bi < this._bone.length; bi++) {
            let cd: number = 0;
            const b = this._bone[bi];
            const space = this._spaces[bi - 1];
            for (let ri = ci; ri < this._rawPoints.length; ri++) {
                const rp = this._rawPoints[ri];
                const pcd = cd;
                cd += pp.distance(rp);
                if (cd > space) {
                    const dd = space - pcd;
                    const rpd = rp.distance(pp);
                    pp.x += (rp.x - pp.x) / rpd * dd;
                    pp.y += (rp.y - pp.y) / rpd * dd;
                    b.x = pp.x;
                    b.y = pp.y;
                    ci = ri;
                    completed++;
                    break;
                }
                pp = rp.clone();
            }
        }
        if (completed == this._length - 1) {
            this._rawPoints.length = ci + 1;
        }
    }
    public get bone() {
        return this._bone;
    }
    public get rawPoints() {
        return this._rawPoints;
    }
}
function randomRange(min: number, max: number) {
    return (max - min) * Math.random() + min;
}
window.addEventListener("load", init);