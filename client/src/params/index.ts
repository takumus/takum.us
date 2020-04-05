export type Callback = (params?: ParamsData, param?: ParamData) => void;
export enum NumberType {
    INT = 0,
    FLOAT = 1
}
export interface ParamData {
    value: number,
    min: number,
    max: number,
    numberType: NumberType
}
export type ParamsData = {[key: string]: ParamData};
export class Params<T extends ParamsData> {
    private params: T;
    private elements: HTMLElement[];
    private _element: HTMLElement;
    private callbacks: Callback[];
    constructor(data: T) {
        this.params = data;
        this.elements = [];
        this._element = document.createElement("div");
        this.callbacks = [];
        this.createInterface();
    }
    public createInterface() {
        if (!this.params) return;
        Object.keys(this.params).forEach((key, i) => {
            const param = this.params![key];
            const paramElement = document.createElement("div");
            const labelElement = document.createElement("span");
            const sliderElement = document.createElement("input");
            sliderElement.type = "range";
            sliderElement.value = param.value.toString();
            sliderElement.addEventListener("input", () => {
                this.update(param, key, Number(sliderElement.value))
            });
            if (param.numberType == NumberType.FLOAT) {
                sliderElement.min = "0";
                sliderElement.max = "10000";
            }else if (param.numberType == NumberType.INT) {
                sliderElement.min = param.min.toString();
                sliderElement.max = param.max.toString();
            }
            labelElement.innerHTML = `${key} : `;
            paramElement.appendChild(labelElement);
            paramElement.appendChild(sliderElement);
            this.elements.push(paramElement);
            this._element.appendChild(paramElement);
        });
    }
    public destroy() {
        this.elements.forEach((paramElement) => {
            paramElement.remove();
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
    private update(param: ParamData, key: string, value: number) {
        if (param.numberType == NumberType.INT) {
            param.value = value;
        }else if (param.numberType == NumberType.FLOAT) {
            param.value = (param.max - param.min) * (value / 10000) + param.min;
        }
        this.callbacks.forEach((callback) => {
            callback(this.params!, param);
        })
    }
}