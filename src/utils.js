const _toString = Object.prototype.toString;

export const KeyCodes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
}

export function creEle(type, props, children) {
    const node = document.createElement(type);
    let childs = [].slice.call(arguments, 2);

    if (_toString.call(childs[0]) === "[object Array]") {
        childs = childs[0];
    }

    function toEle(child) {
        if (child instanceof HTMLElement) {
        return child;
        }
        return document.createTextNode(String(child));
    }

    function merge(attr, prop) {
        for (const key in prop) {
        if (_toString.call(prop[key]) === "[object Object]") {
            merge(attr[key], prop[key]);
        } else {
            attr[key] = prop[key];
        }
        }
    }

    merge(node, props);

    for (let i = 0; i < childs.length; i++) {
        node.appendChild(toEle(childs[i]));
    }

    return node;
}

export function clamp(value, max, min = 0) {
    return value < min ? min : value > max ? max : value;
}

export function setState(context, state) {
    Reflect.ownKeys(state).forEach(props => {
        if (Reflect.has(context, props)) {
            Reflect.set(context, props, state[props]);
        }
    })
}