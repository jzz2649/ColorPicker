import { creEle, setState } from "./utils.js";
import { TextFieldPrefix } from "./style.js";

export default class TextField {
  constructor(options) {
    this.options = { ...options };
    this._lastChangeValue = undefined;
    const self = this;
    this.state = new Proxy(
      {
        value: undefined,
        isFocused: false
      },
      {
        set(obj, props, value) {
          obj[props] = value;
          self._updateDom(props, value);
          return true;
        }
      }
    );
    this._input = creEle("input", {
      className: `${TextFieldPrefix}-input`,
      autoComplete: "off",
      type: "text",
      oninput: this._onInputChange.bind(this),
      onchange: this._onInputChange.bind(this),
      onfocus: this._onFocus.bind(this),
      onblur: this._onBlur.bind(this),
      value: this.state.value || ""
    });
    this._box = creEle(
      "div",
      {
        className: `${TextFieldPrefix}`
      },
      creEle(
        "div",
        null,
        creEle(
          "div",
          {
            className: `${TextFieldPrefix}-field-group`
          },
          this._input
        )
      )
    );

    this.setState({
        value: this.options.value || ''
    })
  }
  render(parent) {
    parent.append(this._box);
  }

  setState(state) {
    setState(this.state, state);
  }

  _updateDom(type, value) {
    if (type === "value") {
      this._input.value = value;
    }
  }

  _onInputChange(ev) {
    const element = event.target;
    const value = element.value;
    if (value === undefined || value === this._lastChangeValue) {
      return;
    }
    this._lastChangeValue = value;
    this.options.onChange(ev, value);
  }

  _onFocus() {
    this.setState({ isFocused: true });
  }
  _onBlur(ev) {
    if (this.options.onBlur) {
      this.options.onBlur(ev);
    }
    this.setState({ isFocused: false });
  }
}
