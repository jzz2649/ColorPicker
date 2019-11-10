import { creEle, clamp, setState, KeyCodes } from "./utils.js";
import {
  MAX_COLOR_SATURATION,
  MAX_COLOR_VALUE,
  updateSV,
  getFullColorString
} from "./color.js";
import { ColorRectangleStylePrefix } from "./style.js";

export default class ColorRectangle {
  constructor(options) {
    this.options = { ...options };
    const self = this;
    this.state = new Proxy(
      {
        color: undefined
      },
      {
        set(obj, props, value) {
          obj[props] = value;
          self._updateDom(props, value);
          return true;
        }
      }
    );

    this._thumb = creEle("div", {
      className: `${ColorRectangleStylePrefix}-thumb`
    });
    this._box = creEle(
      "div",
      {
        tabIndex: 0,
        className: `${ColorRectangleStylePrefix}-box`
      },
      [
        creEle("div", {
          className: `${ColorRectangleStylePrefix}-light`
        }),
        creEle("div", {
          className: `${ColorRectangleStylePrefix}-dark`
        }),
        this._thumb
      ]
    );
    this.setState({
      color: this.options.color
    });
    this._listener();
  }

  render(parent) {
    parent.append(this._box);
  }

  dispose() {
    this._box.removeEventListener("mousedown", this._onMouseDown);
    this._box.removeEventListener("keydown", this._onKeyDown);
  }

  setState(state) {
    setState(this.state, state);
  }

  _listener() {
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._box.addEventListener("mousedown", this._onMouseDown);
    this._box.addEventListener("keydown", this._onKeyDown);
  }

  _onKeyDown(ev) {
    const { color } = this.state;
    let { s, v } = color;

    const increment = ev.shiftKey ? 10 : 1;

    switch (ev.which) {
      case KeyCodes.up: {
        this._isAdjustingSaturation = false;
        v += increment;
        break;
      }
      case KeyCodes.down: {
        this._isAdjustingSaturation = false;
        v -= increment;
        break;
      }
      case KeyCodes.left: {
        this._isAdjustingSaturation = true;
        s -= increment;
        break;
      }
      case KeyCodes.right: {
        this._isAdjustingSaturation = true;
        s += increment;
        break;
      }
      default:
        return;
    }

    this._updateColor(
      ev,
      updateSV(color, clamp(s, MAX_COLOR_SATURATION), clamp(v, MAX_COLOR_VALUE))
    );
  }

  _onMouseDown(ev) {
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);

    this._onMouseMove(ev);
  }

  _onMouseMove(ev) {
    if (!(ev.buttons & 1)) {
      this._onMouseUp();
      return;
    }

    const newColor = _getNewColor(ev, this.state.color, this._box);
    if (newColor) {
      this._updateColor(ev, newColor);
    }
  }

  _updateColor(ev, color) {
    const { onChange } = this.options;

    const oldColor = this.state.color;
    if (color.s === oldColor.s && color.v === oldColor.v) {
      return; // no change
    }

    if (onChange) {
      onChange(ev, color);
    }

    if (!ev.defaultPrevented) {
      this.setState({ color });
      ev.preventDefault();
    }
  }

  _updateDom(type, color) {
    if (type === "color") {
      this._box.style.backgroundColor = getFullColorString(color);
      this._thumb.style.left = color.s + "%";
      this._thumb.style.top = MAX_COLOR_VALUE - color.v + "%";
      this._thumb.style.backgroundColor = color.str;
    }
  }

  _onMouseUp() {
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("mouseup", this._onMouseUp);
  }
}

export function _getNewColor(ev, prevColor, root) {
  const rectSize = root.getBoundingClientRect();

  const sPercentage = (ev.clientX - rectSize.left) / rectSize.width;
  const vPercentage = (ev.clientY - rectSize.top) / rectSize.height;

  return updateSV(
    prevColor,
    clamp(Math.round(sPercentage * MAX_COLOR_SATURATION), MAX_COLOR_SATURATION),
    clamp(
      Math.round(MAX_COLOR_VALUE - vPercentage * MAX_COLOR_VALUE),
      MAX_COLOR_VALUE
    )
  );
}
