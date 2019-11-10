import { creEle } from "./utils.js";

const MSG_STYLE_NAME = Symbol("stylesheet");

export const ColorSliderStylePrefix = "color-slider";
const ColorSliderStyle = `
.${ColorSliderStylePrefix}-box {
    position: relative;
    height: 20px;
    margin-bottom: 8px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(237, 235, 233);
    border-image: initial;
    border-radius: 2px;
    outline: none;
}
.${ColorSliderStylePrefix}-box.hub {
    background: linear-gradient(to left, red 0px, rgb(255, 0, 153) 10%, rgb(205, 0, 255) 20%, rgb(50, 0, 255) 30%, rgb(0, 102, 255) 40%, rgb(0, 255, 253) 50%, rgb(0, 255, 102) 60%, rgb(53, 255, 0) 70%, rgb(205, 255, 0) 80%, rgb(255, 153, 0) 90%, red 100%);
}
.${ColorSliderStylePrefix}-box.alpha {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2N89erVfwY0ICYmxoguxjgUFKI7GsTH5m4M3w1ChQC1/Ca8i2n1WgAAAABJRU5ErkJggg==);
}
.${ColorSliderStylePrefix}-thumb {
    position: absolute;
    width: 20px;
    height: 20px;
    box-shadow: rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px;
    transform: translate(-50%, -50%);
    top: 50%;
    background: white;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(138, 136, 134);
    border-image: initial;
    border-radius: 50%;
}
.${ColorSliderStylePrefix}-overlay {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
}
`;

export const ColorRectangleStylePrefix = "color-rectangle";
const ColorRectangleStyle = `
.${ColorRectangleStylePrefix}-box {
    position: relative;
    margin-bottom: 8px;
    min-width: 220px;
    min-height: 220px;
    height: 268px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(243, 242, 241);
    border-image: initial;
    border-radius: 2px;
    outline: none;
}
.${ColorRectangleStylePrefix}-light {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: linear-gradient(to right, white 0%, transparent 100%);
}
.${ColorRectangleStylePrefix}-dark {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: linear-gradient(transparent 0px, rgb(0, 0, 0) 100%);
}
.${ColorRectangleStylePrefix}-thumb {
    position: absolute;
    width: 20px;
    height: 20px;
    box-shadow: rgba(0, 0, 0, 0.133) 0px 3.2px 7.2px 0px, rgba(0, 0, 0, 0.11) 0px 0.6px 1.8px 0px;
    transform: translate(-50%, -50%);
    background: white;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(138, 136, 134);
    border-image: initial;
    border-radius: 50%;
}
.${ColorRectangleStylePrefix}-thumb::before {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    box-sizing: border-box;
    content: "";
    border-width: 2px;
    border-style: solid;
    border-color: rgb(255, 255, 255);
    border-image: initial;
    border-radius: 50%;
}
`;

export const TextFieldPrefix = 'text-field';
const TextFieldStyle = `
.${TextFieldPrefix} {
    font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    font-weight: 400;
    box-shadow: none;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
    padding-top: 0px;
    padding-right: 4px;
    padding-bottom: 0px;
    padding-left: 0px;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 30px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
}
.${TextFieldPrefix}-field-group {
    box-shadow: none;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    padding-left: 0px;
    box-sizing: border-box;
    cursor: text;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    position: relative;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(138, 136, 134);
    border-image: initial;
    border-radius: 2px;
    background: rgb(255, 255, 255);

}
.${TextFieldPrefix}-input {
    min-width: auto;
    padding-top: 5px;
    padding-right: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    text-overflow: clip;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    font-weight: 400;
    box-shadow: none;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 0px;
    box-sizing: border-box;
    color: rgb(50, 49, 48);
    width: 100%;
    min-width: 0px;
    text-overflow: ellipsis;
    border-radius: 0px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    background: none transparent;
    outline: 0px;
}
`

export const ColorPickerStylePrefix = "color-picker";
const ColorPickerStyle = `
.${ColorPickerStylePrefix} {
    ont-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    font-weight: 400;
    position: relative;
    max-width: 352px;
    min-width: 352px;
    box-sizing: border-box;
}
.${ColorPickerStylePrefix} *,
.${ColorPickerStylePrefix} *::after,
.${ColorPickerStylePrefix} *::before {
    box-sizing: border-box;
}
.${ColorPickerStylePrefix}-panel {
    padding-top: 12px;
    padding-right: 12px;
    padding-bottom: 12px;
    padding-left: 12px;
}
.${ColorPickerStylePrefix}-flex-container {
    display: flex;
}
.${ColorPickerStylePrefix}-flex-slider {
    flex-grow: 1;
}
.${ColorPickerStylePrefix}-flex-preview-box {
    flex-grow: 0;
}
.${ColorPickerStylePrefix}-color-square {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-left: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(200, 198, 196);
    border-image: initial;
}
.${ColorPickerStylePrefix}-table {
    table-layout: fixed;
    width: 100%;
}
.${ColorPickerStylePrefix}-table-header {
    font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 12px;
    font-weight: 400;
}
.${ColorPickerStylePrefix}-table-header td {
    padding-bottom: 4px;
}
.${ColorPickerStylePrefix}-table-body td:last-of-type .${TextFieldPrefix} {
    padding-right: 0;
}
.${ColorPickerStylePrefix}-table-hex-cell {
    width: 25%;
}
`;

const MSG_STYLE_TEXT = `
${ColorPickerStyle}
${ColorSliderStyle}
${ColorRectangleStyle}
${TextFieldStyle}
`;

export default function insertStyle() {
  if (!window[MSG_STYLE_NAME]) {
    window[MSG_STYLE_NAME] = true;
    document.head.appendChild(creEle("style", null, MSG_STYLE_TEXT));
  }
}
