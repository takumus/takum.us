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
      elements.value.innerHTML = value.toString();
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
    elements.label.innerHTML = `${param.name} : `;
    elements.value.innerHTML = param.value.toString();
    elements.param.appendChild(elements.label);
    elements.param.appendChild(elements.value);
    elements.param.appendChild(elements.slider);
    this.elements.push(elements.param);
    this._element.appendChild(elements.param);
  }
  private createElements() {
    const param = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("span");
    const slider = document.createElement("input");
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
      e.remove();
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