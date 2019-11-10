import { clamp } from "./utils.js";

export const MAX_COLOR_SATURATION = 100;
export const MAX_COLOR_HUE = 359;
export const MAX_COLOR_VALUE = 100;
export const MAX_COLOR_RGB = 255;
export const MAX_COLOR_RGBA = MAX_COLOR_RGB;
export const MAX_COLOR_ALPHA = 100;

export const MIN_HEX_LENGTH = 3;
export const MAX_HEX_LENGTH = 6;
export const MIN_RGBA_LENGTH = 1;
export const MAX_RGBA_LENGTH = 3;

export const HEX_REGEX = /^[\da-f]{0,6}$/i;
export const RGBA_REGEX = /^\d{0,3}$/;

export function cssColor(color) {
  if (!color) {
    return undefined;
  }

  const easyColor =
    _rgba(color) || _hex6(color) || _hex3(color) || _hsla(color);
  if (easyColor) {
    return easyColor;
  }
  return _browserCompute(color);
}

function _browserCompute(str) {
  if (typeof document === "undefined") {
    return undefined;
  }
  const elem = document.createElement("div");
  elem.style.backgroundColor = str;
  elem.style.position = "absolute";
  elem.style.top = "-9999px";
  elem.style.left = "-9999px";
  elem.style.height = "1px";
  elem.style.width = "1px";
  document.body.appendChild(elem);
  const eComputedStyle = getComputedStyle(elem);
  const computedColor = eComputedStyle && eComputedStyle.backgroundColor;
  document.body.removeChild(elem);

  if (computedColor === "rgba(0, 0, 0, 0)" || computedColor === "transparent") {
    switch (str.trim()) {
      case "transparent":
      case "#0000":
      case "#00000000":
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    return undefined;
  }

  return _rgba(computedColor);
}

function _rgba(str) {
  if (!str) {
    return undefined;
  }

  const match = str.match(/^rgb(a?)\(([\d., ]+)\)$/);
  if (match) {
    const hasAlpha = !!match[1];
    const expectedPartCount = hasAlpha ? 4 : 3;
    const parts = match[2].split(/ *, */).map(Number);

    if (parts.length === expectedPartCount) {
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: hasAlpha ? parts[3] * 100 : MAX_COLOR_ALPHA
      };
    }
  }
}

function _hsla(str) {
  const match = str.match(/^hsl(a?)\(([\d., ]+)\)$/);
  if (match) {
    const hasAlpha = !!match[1];
    const expectedPartCount = hasAlpha ? 4 : 3;
    const parts = match[2].split(/ *, */).map(Number);

    if (parts.length === expectedPartCount) {
      const rgba = hsl2rgb(parts[0], parts[1], parts[2]);
      rgba.a = hasAlpha ? parts[3] * 100 : MAX_COLOR_ALPHA;
      return rgba;
    }
  }
}

function _hex6(str) {
  if ("#" === str[0] && 7 === str.length && /^#[\da-fA-F]{6}$/.test(str)) {
    return {
      r: parseInt(str.slice(1, 3), 16),
      g: parseInt(str.slice(3, 5), 16),
      b: parseInt(str.slice(5, 7), 16),
      a: MAX_COLOR_ALPHA
    };
  }
}

function _hex3(str) {
  if ("#" === str[0] && 4 === str.length && /^#[\da-fA-F]{3}$/.test(str)) {
    return {
      r: parseInt(str[1] + str[1], 16),
      g: parseInt(str[2] + str[2], 16),
      b: parseInt(str[3] + str[3], 16),
      a: MAX_COLOR_ALPHA
    };
  }
}

export function hsl2rgb(h, s, l) {
  const hsv = hsl2hsv(h, s, l);

  return hsv2rgb(hsv.h, hsv.s, hsv.v);
}

export function hsv2rgb(h, s, v) {
  s = s / 100;
  v = v / 100;

  let rgb = [];

  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = v - c;

  switch (Math.floor(hh)) {
    case 0:
      rgb = [c, x, 0];
      break;

    case 1:
      rgb = [x, c, 0];
      break;

    case 2:
      rgb = [0, c, x];
      break;

    case 3:
      rgb = [0, x, c];
      break;

    case 4:
      rgb = [x, 0, c];
      break;

    case 5:
      rgb = [c, 0, x];
      break;
  }

  return {
    r: Math.round(MAX_COLOR_RGB * (rgb[0] + m)),
    g: Math.round(MAX_COLOR_RGB * (rgb[1] + m)),
    b: Math.round(MAX_COLOR_RGB * (rgb[2] + m))
  };
}

export function hsl2hsv(h, s, l) {
  s *= (l < 50 ? l : 100 - l) / 100;
  const v = l + s;

  return {
    h: h,
    s: v === 0 ? 0 : ((2 * s) / v) * 100,
    v: v
  };
}

export function hsv2hex(h, s, v) {
  const { r, g, b } = hsv2rgb(h, s, v);

  return rgb2hex(r, g, b);
}

export function rgb2hsv(r, g, b) {
  let h = NaN;
  let s;
  let v;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // hue
  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else if (b === max) {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  // saturation
  s = Math.round((max === 0 ? 0 : delta / max) * 100);

  // value
  v = Math.round((max / MAX_COLOR_RGB) * 100);

  return { h, s, v };
}

export function rgb2hex(r, g, b) {
  return [_rgbToPaddedHex(r), _rgbToPaddedHex(g), _rgbToPaddedHex(b)].join("");
}

/** Converts an RGB component to a 0-padded hex component of length 2. */
function _rgbToPaddedHex(num) {
  num = clamp(num, MAX_COLOR_RGB);
  const hex = num.toString(16);

  return hex.length === 1 ? "0" + hex : hex;
}

export function getColorFromString(inputColor) {
  const color = cssColor(inputColor);

  if (!color) {
    return;
  }

  return {
    ...getColorFromRGBA(color),
    str: inputColor
  };
}

export function getColorFromRGBA(rgba) {
  const { a = MAX_COLOR_ALPHA, b, g, r } = rgba;
  const { h, s, v } = rgb2hsv(r, g, b);
  const hex = rgb2hex(r, g, b);
  const str = _rgbaOrHexString(r, g, b, a, hex);

  return { a, b, g, h, hex, r, s, str, v };
}

export function _rgbaOrHexString(r, g, b, a, hex) {
  return a === MAX_COLOR_ALPHA || typeof a !== "number"
    ? `#${hex}`
    : `rgba(${r}, ${g}, ${b}, ${a / MAX_COLOR_ALPHA})`;
}

export function getFullColorString(color) {
  return `#${hsv2hex(color.h, MAX_COLOR_SATURATION, MAX_COLOR_VALUE)}`;
}

export function updateSV(color, s, v) {
  const { r, g, b } = hsv2rgb(color.h, s, v);
  const hex = rgb2hex(r, g, b);

  return {
    a: color.a,
    b: b,
    g: g,
    h: color.h,
    hex: hex,
    r: r,
    s: s,
    str: _rgbaOrHexString(r, g, b, color.a, hex),
    v: v
  };
}

export function updateH(color, h) {
  const { r, g, b } = hsv2rgb(h, color.s, color.v);
  const hex = rgb2hex(r, g, b);

  return {
    a: color.a,
    b: b,
    g: g,
    h: h,
    hex: hex,
    r: r,
    s: color.s,
    str: _rgbaOrHexString(r, g, b, color.a, hex),
    v: color.v
  };
}

export function updateA(color, a) {
  return {
    ...color,
    a: a,
    str: _rgbaOrHexString(color.r, color.g, color.b, a, color.hex)
  };
}

export function correctHex(hex) {
  if (!hex || hex.length < MIN_HEX_LENGTH) {
    return "ffffff";
  }
  if (hex.length >= MAX_HEX_LENGTH) {
    return hex.substring(0, MAX_HEX_LENGTH);
  }
  return hex.substring(0, MIN_HEX_LENGTH);
}

export function correctRGB(color) {
  return {
    r: clamp(color.r, MAX_COLOR_RGB),
    g: clamp(color.g, MAX_COLOR_RGB),
    b: clamp(color.b, MAX_COLOR_RGB),
    a: typeof color.a === "number" ? clamp(color.a, MAX_COLOR_ALPHA) : color.a
  };
}
