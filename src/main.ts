import * as PIXI from 'pixi.js';

function init() {
  console.log("init");
  const app = new PIXI.Application({
    width: 512,
    height: 512
  });
  document.body.appendChild(app.view);
  const box = new PIXI.Graphics();
  box.beginFill(0xff0000);
  box.drawRect(0, 0, 50, 50);
  box.pivot.set(25, 25);
  app.stage.addChild(box);
  app.stage.interactive = true;
  app.stage.on("pointermove", (e: PIXI.interaction.InteractionEvent) => {
    box.x = e.data.global.x;
    box.y = e.data.global.y;
  })
  // app.ticker.add((d) => {
  //   console.log(d);
  // });
}
window.addEventListener("load", init);