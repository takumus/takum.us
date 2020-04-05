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
    public createInterface() {
        if (!this.params) return;
        this.params.forEach((param, i) => {
            const paramElement = document.createElement("div");
            const labelElement = document.createElement("span");
            const valueElement = document.createElement("span");
            const sliderElement = document.createElement("input");
            sliderElement.type = "range";
            sliderElement.style.width = "100%";
            sliderElement.addEventListener("input", () => {
                const value = this.calculateValueFromInput(param, Number(sliderElement.value));
                this.update(param, value);
                valueElement.innerHTML = value.toString();
            });
            if (param.numberType == NumberType.FLOAT) {
                sliderElement.min = "0";
                sliderElement.max = "100";
                sliderElement.value = ((param.value - param.min) / (param.max - param.min) * 100).toString();
            }else if (param.numberType == NumberType.INT) {
                sliderElement.min = param.min.toString();
                sliderElement.max = param.max.toString();
                sliderElement.value = param.value.toString();
            }
            labelElement.innerHTML = `${param.name} : `;
            valueElement.innerHTML = param.value.toString();
            paramElement.appendChild(labelElement);
            paramElement.appendChild(valueElement);
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
    private calculateValueFromInput(param: ParamData, value: number) {
        if (param.numberType == NumberType.INT) {
            return value;
        }else if (param.numberType == NumberType.FLOAT) {
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
}