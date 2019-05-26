import * as PIXI from 'pixi.js';
import { Point } from './point';
import { BugBody } from './bugBody';
import * as NormalLeg from './normalLeg';
import * as Legs from './leg';
function init() {
    console.log("init");
    const app = new PIXI.Application({
        view: document.querySelector("#canvas"),
        resolution: window.devicePixelRatio
    });
    const background = new PIXI.Graphics();
    const joints = new PIXI.Graphics();
    const lines = new PIXI.Graphics();
    const body = new BugBody(16, 40);// 関節数, 関節間隔
    const bodyWidth = 16;
    const leg1 = new NormalLeg.NormalLeg(
        body,
        200,
        0,
        6,
        NormalLeg.PositionFB.FRONT,
        Legs.LRPosition.LEFT,
        20,
        100,
        0,
        120,
        120
    );
    const leg2 = new NormalLeg.NormalLeg(
        body,
        200,
        0,
        6,
        NormalLeg.PositionFB.FRONT,
        Legs.LRPosition.RIGHT,
        20,
        100,
        100,
        120,
        120
    );
    const leg3 = new NormalLeg.NormalLeg(
        body,
        200,
        7,
        8,
        NormalLeg.PositionFB.BACK,
        Legs.LRPosition.LEFT,
        20,
        100,
        100,
        120,
        120
    );
    const leg4 = new NormalLeg.NormalLeg(
        body,
        200,
        7,
        8,
        NormalLeg.PositionFB.BACK,
        Legs.LRPosition.RIGHT,
        20,
        100,
        0,
        120,
        120
    );
    body.addLeg(leg1, leg2, leg3, leg4);
    let dragging = false;
    document.body.appendChild(app.view);
    app.view.style.transform = `scale(${(1 / window.devicePixelRatio)})`;
    app.view.style.transformOrigin = "left top";
    app.stage.interactive = true;
    app.stage.addChild(background, lines, joints);
    background.beginFill(0x000000);
    background.drawRect(0, 0, app.view.width, app.view.height);
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
    let pp = new Point(0, 0);
    let dd = 0;
    function addPoint(p: { x: number, y: number }) {
        dd += new Point(p.x, p.y).distance(pp);
        pp.x = p.x;
        pp.y = p.y;
        body.setHead(new Point(p.x, p.y));
        joints.clear();
        lines.clear();
        lines.lineStyle(1, 0x333333);
        for (let i = 0; i < body.joints.length - 1; i++) {
            const b = body.joints[i];
            const nb = body.joints[i + 1];// 次の関節
            joints.beginFill(0xCCCCCC, 0.4);
            joints.drawPolygon([
                b.x, b.y,
                nb.x + b.vy * bodyWidth / 2, nb.y - b.vx * bodyWidth / 2,
                nb.x - b.vy * bodyWidth / 2, nb.y + b.vx * bodyWidth / 2
            ]);
            joints.beginFill(0xCCCCCC, 0.3);
            joints.drawCircle(nb.x, nb.y, bodyWidth / 2);

            const w = 40;
            const rp = new Point(
                b.x + b.vy * w,
                b.y - b.vx * w
            );
            const lp = new Point(
                b.x - b.vy * w,
                b.y + b.vx * w
            );
            lines.moveTo(rp.x, rp.y);
            lines.lineTo(lp.x, lp.y);
        };
        body.points.forEach((p, i) => {
            if (i == 0) {
                lines.moveTo(p.x, p.y);
                return;
            }
            lines.lineTo(p.x, p.y);
        });
        leg1.endPointDistanceFromBody = leg2.endPointDistanceFromBody = 30;
        leg3.endPointDistanceFromBody = leg4.endPointDistanceFromBody = 30;
        lines.lineStyle(1, 0xffffff);
        lines.moveTo(leg1.bone.rootPosition.x, leg1.bone.rootPosition.y);
        lines.lineTo(leg1.bone.middlePosition.x, leg1.bone.middlePosition.y);
        lines.lineTo(leg1.bone.endPosition.x, leg1.bone.endPosition.y);
        lines.moveTo(leg2.bone.rootPosition.x, leg2.bone.rootPosition.y);
        lines.lineTo(leg2.bone.middlePosition.x, leg2.bone.middlePosition.y);
        lines.lineTo(leg2.bone.endPosition.x, leg2.bone.endPosition.y);
        lines.moveTo(leg3.bone.rootPosition.x, leg3.bone.rootPosition.y);
        lines.lineTo(leg3.bone.middlePosition.x, leg3.bone.middlePosition.y);
        lines.lineTo(leg3.bone.endPosition.x, leg3.bone.endPosition.y);
        lines.moveTo(leg4.bone.rootPosition.x, leg4.bone.rootPosition.y);
        lines.lineTo(leg4.bone.middlePosition.x, leg4.bone.middlePosition.y);
        lines.lineTo(leg4.bone.endPosition.x, leg4.bone.endPosition.y);
    }
    addPoint({ x: 10, y: 10 });
    addPoint({ x: 400, y: 400 });
}
function saiShow2joeFor(points: Point[]) {
    const n = points.length;
    const sXY = sigma((p) => p.x * p.y, points);
    const sX = sigma((p) => p.x, points);
    const sY = sigma((p) => p.y, points);
    const sXX = sigma((p) => p.x * p.x, points);
    const a = (n * sXY - sX * sY) / (n * sXX - (sX * sX));
    const b = (sXX * sY - sXY * sX) / (n * sXX - (sX * sX));
    return { a , b };
}
function sigma<T>(func: (obj: T) => number, objs: T[]) {
    return objs.map(func).reduce((pv, cv) => pv + cv);
}
window.addEventListener("load", init);