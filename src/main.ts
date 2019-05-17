import * as PIXI from 'pixi.js';
import { Point } from './point';
import { Body } from './body';
function init() {
    console.log("init");
    const app = new PIXI.Application({
        view: document.querySelector("#canvas"),
        resolution: window.devicePixelRatio
    });
    const background = new PIXI.Graphics();
    const joints = new PIXI.Graphics();
    const lines = new PIXI.Graphics();
    const points = new Body(8, [
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
        for (let i = 0; i < points.joints.length - 1; i++){
            const b = points.joints[i];
            const nb = points.joints[i + 1];// 次の関節
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
        points.points.forEach((p, i) => {
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
window.addEventListener("load", init);