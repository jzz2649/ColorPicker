import ColorRectangle from "./ColorRectangle.js";
import ColorSlider from "./ColorSlider.js";
import TextField from "./TextField.js";
import { creEle, setState, clamp } from "./utils.js";
import {
  getColorFromString,
  updateA,
  updateH,
  getColorFromRGBA,
  correctHex,
  correctRGB,
  HEX_REGEX,
  RGBA_REGEX,
  MAX_HEX_LENGTH,
  MAX_RGBA_LENGTH,
  MAX_COLOR_ALPHA,
  MAX_COLOR_RGB,
  MIN_HEX_LENGTH,
  MIN_RGBA_LENGTH
} from "./color.js";
import insertStyle, { ColorPickerStylePrefix } from "./style.js";

const colorComponents = ["hex", "r", "g", "b", "a"];
const textLabels = ["Hex", "Red", "Green", "Blue", "Alpha"];

export default class ColorPicker {
  constructor(options) {
    insertStyle();
    this.options = { ...options };
    const self = this;
    this.state = new Proxy(
      {
        color:
          _getColorFromProps(this.options) || getColorFromString("#ffffff"),
        editingColor: undefined
      },
      {
        set(obj, props, value) {
          obj[props] = value;
          self._updateDom(props, value);
          return true;
        }
      }
    );
    this._rectangle = new ColorRectangle({
      color: this.state.color,
      onChange: this._onSVChanged.bind(this)
    });
    this._hub = new ColorSlider({
      value: this.state.color.h,
      onChange: this._onHChanged.bind(this)
    });
    this._alpha = new ColorSlider({
      value: this.state.color.a,
      onChange: this._onAChanged.bind(this),
      overlayColor: this.state.color.hex,
      isAlpha: true
    });
    this._colorPreview = creEle("div", {
      className: `${ColorPickerStylePrefix}-color-square`
    });
    const flexSlider = creEle(
      "div",
      {
        className: `${ColorPickerStylePrefix}-flex-slider`
      },
      [
        this._hub._box,
        this._alpha._box,
        creEle("div", {
          className: `${ColorPickerStylePrefix}-flex-preview-box`
        })
      ]
    );

    this._textFields = {};

    const panel = creEle(
      "div",
      {
        className: `${ColorPickerStylePrefix}-panel`
      },
      [
        this._rectangle._box,
        creEle(
          "div",
          {
            className: `${ColorPickerStylePrefix}-flex-container`
          },
          [flexSlider, this._colorPreview]
        ),
        creEle(
          "table",
          {
            className: `${ColorPickerStylePrefix}-table`,
            cellPadding: 0,
            cellSpacing: 0
          },
          [
            creEle(
              "thead",
              null,
              creEle(
                "tr",
                { className: `${ColorPickerStylePrefix}-table-header` },
                textLabels.map(text =>
                  creEle(
                    "td",
                    {
                      className:
                        text === "Hex"
                          ? `${ColorPickerStylePrefix}-table-hex-cell`
                          : ""
                    },
                    text
                  )
                )
              )
            ),
            creEle(
              "tbody",
              null,
              creEle(
                "tr",
                { className: `${ColorPickerStylePrefix}-table-body` },
                colorComponents.map(component => {
                  const textField = new TextField({
                    onChange: this._onTextChange.bind(this, component),
                    onBlur: this._onBlur.bind(this),
                    value: this._getDisplayValue(component)
                  });
                  this._textFields[component] = textField;
                  return creEle(
                    "td",
                    component !== "hex"
                      ? {
                          style: {
                            width: "18%"
                          }
                        }
                      : null,
                    textField._box
                  );
                })
              )
            )
          ]
        )
      ]
    );
    this._box = creEle(
      "div",
      {
        className: `${ColorPickerStylePrefix}`
      },
      panel
    );

    this.setState({
      ...this.state
    });
  }

  render(parent) {
    parent.append(this._box);
  }

  setState(state) {
    setState(this.state, state);
  }

  dispose() {
    this._hub.dispose();
    this._alpha.dispose();
    this._rectangle.dispose();
  }

  _updateDom(type, value) {
    if (type === "color") {
      const color = value;
      this._colorPreview.style.backgroundColor = color.str;
      this._rectangle.setState({ color });
      this._hub.setState({ value: color.h });
      this._alpha.setState({ value: color.a, overlayColor: color.hex });
    } else if (type === "editingColor" && value === undefined) {
      Reflect.ownKeys(this._textFields).forEach(component => {
        this._textFields[component].setState({
          value: this._getDisplayValue(component)
        });
      });
    }
  }

  _onBlur(event) {
    const { color, editingColor } = this.state;
    if (!editingColor) {
      return;
    }
    const { value, component } = editingColor;
    const isHex = component === "hex";
    const minLength = isHex ? MIN_HEX_LENGTH : MIN_RGBA_LENGTH;
    if (value.length >= minLength && (isHex || !isNaN(Number(value)))) {
      let newColor;
      if (isHex) {
        newColor = getColorFromString("#" + correctHex(value));
      } else {
        newColor = getColorFromRGBA(
          correctRGB({
            ...color,
            [component]: Number(value)
          })
        );
      }
      this._updateColor(event, newColor);
    } else {
      this.setState({ editingColor: undefined });
    }
  }

  _onSVChanged(ev, color) {
    this._updateColor(ev, color);
  }

  _onHChanged(ev, h) {
    this._updateColor(ev, updateH(this.state.color, h));
  }

  _onAChanged(ev, a) {
    this._updateColor(ev, updateA(this.state.color, Math.round(a)));
  }

  _updateColor(ev, newColor) {
    if (!newColor) {
      return;
    }
    const { color, editingColor } = this.state;
    const isDifferentColor =
      newColor.h !== color.h || newColor.str !== color.str;

    if (isDifferentColor || editingColor) {
      if (ev && this.options.onChange) {
        this.options.onChange(ev, newColor);
        if (ev.defaultPrevented) {
          return;
        }
      }
      this.setState({ color: newColor, editingColor: undefined });
    }
  }

  _onTextChange(component, event, newValue) {
    const color = this.state.color;
    const isHex = component === "hex";
    const isAlpha = component === "a";
    newValue = (newValue || "").substr(
      0,
      isHex ? MAX_HEX_LENGTH : MAX_RGBA_LENGTH
    );

    const validCharsRegex = isHex ? HEX_REGEX : RGBA_REGEX;
    if (!validCharsRegex.test(newValue)) {
      Reflect.ownKeys(this._textFields).forEach(component => {
        this._textFields[component].setState({
          value: this._getDisplayValue(component)
        });
      });
      return;
    }

    let isValid;
    if (newValue === "") {
      isValid = false;
    } else if (isHex) {
      isValid = newValue.length === MAX_HEX_LENGTH;
    } else if (isAlpha) {
      isValid = Number(newValue) <= MAX_COLOR_ALPHA;
    } else {
      isValid = Number(newValue) <= MAX_COLOR_RGB;
    }

    if (!isValid) {
      this.setState({ editingColor: { component, value: newValue } });
    } else if (String(color[component]) === newValue) {
      if (this.state.editingColor) {
        this.setState({ editingColor: undefined });
      } else {
        this._textFields[component].setState({
          value: this._getDisplayValue(component)
        });
      }
    } else {
      const newColor = isHex
        ? getColorFromString("#" + newValue)
        : getColorFromRGBA({
            ...color,
            [component]: Number(newValue)
          });
      this._updateColor(event, newColor);
    }
  }

  _getDisplayValue(component) {
    const { color, editingColor } = this.state;
    if (editingColor && editingColor.component === component) {
      return editingColor.value;
    }
    if (component === "hex") {
      return color[component] || "";
    } else if (
      typeof color[component] === "number" &&
      !isNaN(color[component])
    ) {
      return String(color[component]);
    }
    return "";
  }
}

function _getColorFromProps(props) {
  const { color } = props;
  return typeof color === "string" ? getColorFromString(color) : color;
}
