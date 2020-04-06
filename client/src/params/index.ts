export type Callback = (param?: ParamData) => void;
export enum NumberType {
  INT = 0,
  FLOAT = 1
}
export interface ParamData {
  name: string,
  value: number,
  min: number,
  max: number,
  numberType: NumberType
}
export class ParamsGUI {
  private params: ParamData[];
  private elements: HTMLElement[];
  private _element: HTMLElement;
  private callbacks: Callback[];
  constructor(params: ParamData[]) {
    this.params = params;
    this.elements = [];
    this._element = document.createElement("div");
    this.callbacks = [];
    this.createInterface();
  }
  private createInterface() {
    if (!this.params) return;
    this.params.forEach((param) => {
      this.createInput(param);
    });
  }
  private createInput(param: ParamData) {
    const elements = this.createElements();
    elements.slider.type = "range";
    elements.slider.style.width = "100%";
    elements.slider.addEventListener("input", () => {
      const value = this.calculateValueFromInput(param, Number(elements.slider.value));
      this.update(param, value);
      elements.value.innerHTML = this.valueToString(value);
    });
    if (param.numberType == NumberType.FLOAT) {
      elements.slider.min = "0";
      elements.slider.max = "100";
      elements.slider.value = ((param.value - param.min) / (param.max - param.min) * 100).toString();
    } else if (param.numberType == NumberType.INT) {
      elements.slider.min = param.min.toString();
      elements.slider.max = param.max.toString();
      elements.slider.value = param.value.toString();
    }
    elements.label.innerHTML = `${param.name}`;
    elements.value.innerHTML = this.valueToString(param.value);
    elements.param.appendChild(elements.label);
    elements.param.appendChild(elements.slider);
    elements.param.appendChild(elements.value);
    this.elements.push(elements.param);
    this._element.appendChild(elements.param);
  }
  private valueToString(value: number) {
    return value.toFixed(3);
  }
  private createElements() {
    const param = document.createElement("div");
    const label = document.createElement("p");
    const value = document.createElement("p");
    const slider = document.createElement("input");
    label.className = "params-gui-label";
    param.className = "params-gui-parent";
    slider.className = "params-gui-slider";
    value.className = "params-gui-value";
    return {
      param,
      label,
      value,
      slider
    }
  }
  private calculateValueFromInput(param: ParamData, value: number) {
    if (param.numberType == NumberType.INT) {
      return value;
    } else if (param.numberType == NumberType.FLOAT) {
      return (param.max - param.min) * (value / 100) + param.min;
    }
    return 0;
  }
  private update(param: ParamData, value: number) {
    param.value = value;
    this.callbacks.forEach((callback) => {
      callback(param);
    })
  }
  public destroy() {
    this.elements.forEach((e) => {
      if (e.parentElement) {
        e.parentElement.removeChild(e);
      }
    });
  }
  public get element() {
    return this._element;
  }
  public on(callback: Callback) {
    this.off(callback);
    this.callbacks.push(callback);
  }
  public off(callback: Callback) {
    for (let i = 0; i < this.callbacks.length; i++) {
      if (this.callbacks[i] == callback) {
        this.callbacks.splice(i, 1);
        return;
      }
    }
  }
}

function createStyles() {
  const id = "params-gui-styles";
  const thickness = 20;
  const style = `
  .params-gui-slider {
    flex: 3;
    -webkit-appearance: none;
    width: 100%;
    height: ${thickness}px;
    border-radius: ${thickness/2}px;
    background: #e5e5e5;
    outline: none;
    opacity: 0.7;
  }
  .params-gui-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: ${thickness}px;
    height: ${thickness}px;
    border-radius: 50%;
    background: #ff9d41;
    cursor: pointer;
  }
  .params-gui-slider::-moz-range-thumb {
    width: ${thickness}px;
    height: ${thickness}px;
    border-radius: 50%;
    background: #ff9d41;
    cursor: pointer;
  }
  .params-gui-parent {
    display: flex;
    align-items: center;
  }
  .params-gui-label {
    flex: 1;
    text-align: left;
    overflow: hidden;
    font-weight: 600;
    margin: 8px 0px;
  }
  .params-gui-value {
    flex: 1;
    text-align: right;
    overflow: hidden;
    font-weight: 600;
    margin: 8px 0px;
  }`;
  const oldStyleElement = document.head.querySelector(`#${id}`);
  if (oldStyleElement) oldStyleElement.remove();
  const styleElement = document.createElement("style");
  styleElement.id = id;
  document.head.appendChild(styleElement);
  styleElement.innerHTML = style;
}
createStyles();