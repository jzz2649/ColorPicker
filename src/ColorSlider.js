import { creEle, clamp, setState, KeyCodes } from "./utils.js";
import { MAX_COLOR_ALPHA, MAX_COLOR_HUE } from "./color.js";
import { ColorSliderStylePrefix } from "./style.js";

export default class ColorSlider {
  constructor(options) {
    this.options = { minValue: 0, ...options };
    const self = this;
    this.state = new Proxy(
      {
        value: undefined,
        overlayColor: undefined
      },
      {
        set(obj, props, value) {
          obj[props] = value;
          self._updateDom(props, value);
          return true;
        }
      }
    );

    const isAlpha = this.options.isAlpha;
    this.options.maxValue = isAlpha ? MAX_COLOR_ALPHA : MAX_COLOR_HUE;
    const type = isAlpha ? "alpha" : "hub";
    this._thumb = creEle("div", {
      className: `${ColorSliderStylePrefix}-thumb`
    });
    this._overlay = isAlpha
      ? creEle("div", {
          className: `${ColorSliderStylePrefix}-overlay`
        })
      : null;
    this._box = creEle(
      "div",
      {
        tabIndex: 0,
        className: `${ColorSliderStylePrefix}-box ${type}`
      },
      isAlpha ? [this._overlay, this._thumb] : this._thumb
    );
    this.setState({
      value: this.options.value,
      overlayColor: this.options.overlayColor
    });
    this._listener();
  }

  render(parent) {
    parent.append(this._box);
  }

  setState(state) {
    setState(this.state, state);
  }

  dispose() {
    this._box.removeEventListener("mousedown", this._onMouseDown);
    this._box.removeEventListener("keydown", this._onKeyDown);
  }

  _listener() {
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._box.addEventListener("mousedown", this._onMouseDown);
    this._box.addEventListener("keydown", this._onKeyDown);
  }

  _onMouseDown(ev) {
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
    this._onMouseMove(ev);
  }

  _onKeyDown(ev) {
    let currentValue = this.state.value;
    const { minValue, maxValue } = this.options;
    const increment = ev.shiftKey ? 10 : 1;

    switch (ev.which) {
      case KeyCodes.left: {
        currentValue -= increment;
        break;
      }
      case KeyCodes.right: {
        currentValue += increment;
        break;
      }
      case KeyCodes.home: {
        currentValue = minValue;
        break;
      }
      case KeyCodes.end: {
        currentValue = maxValue;
        break;
      }
      default: {
        return;
      }
    }

    this._updateValue(ev, clamp(currentValue, maxValue, minValue));
  }

  _onMouseMove(ev) {
    const { minValue, maxValue } = this.options;
    const rectSize = this._box.getBoundingClientRect();

    const currentPercentage = (ev.clientX - rectSize.left) / rectSize.width;
    const newValue = clamp(
      Math.round(currentPercentage * maxValue),
      maxValue,
      minValue
    );

    this._updateValue(ev, newValue);
  }

  _onMouseUp() {
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("mouseup", this._onMouseUp);
  }

  _updateValue(ev, newValue) {
    if (newValue === this.state.value) {
      return;
    }

    const { onChange } = this.options;

    if (onChange) {
      onChange(ev, newValue);
    }

    if (!ev.defaultPrevented) {
      this.setState({
        value: newValue
      });
      ev.preventDefault();
    }
  }

  _updateDom(type, value) {
      if (type === "value") {
        const { minValue, maxValue} = this.options;
        const left = (100 * (value - minValue)) / (maxValue - minValue);
      this._thumb.style.left = left + "%";
    } else if (this.options.isAlpha && value !== undefined) {
      this._overlay.style.background = `linear-gradient(to right, transparent 0, #${value} 100%)`;
    }
  }
}
