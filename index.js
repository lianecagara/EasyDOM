class EasyDOM {
    constructor(element) {
        if (typeof element === 'string') {
            this.element = document.createElement(element);
        } else if (element instanceof HTMLElement) {
            this.element = element;
        } else {
            this.element = document.createElement('span');
        }

        return new Proxy(this, {
            get(target, prop) {
                if (prop in target.element) {
                    return target.element[prop].bind(target.element);
                }
                return target[prop];
            }
        });
    }
    static get doc() {
        return new EasyDOM(document.body);
    }
    static onLoad(handler) {
        return document.addEventListener("DOMContentLoaded", handler);
    }
    
    static $all(...args) {
        const doc = new EasyDOM(document);
        return doc.$all(...args);
    }

    static $(...args) {
        return this.$all(...args)[0];
    }
    
    $(tag, ...etc) {
        const element = this.element.querySelector(tag, ...etc);
        return new EasyDOM(i);
    }
    
    $all(tag, ...etc) {
        const elements = this.element.querySelectorAll(tag, ...etc);
        return elements.map(i => new EasyDOM(i));
    }

    setText(text) {
        this.element.textContent = text;
        return this;
    }

    getText() {
        return this.element.textContent;
    }

    addClass(className) {
        this.element.classList.add(className);
        return this;
    }

    removeClass(className) {
        this.element.classList.remove(className);
        return this;
    }

    toggleClass(className) {
        this.element.classList.toggle(className);
        return this;
    }

    hasClass(className) {
        return this.element.classList.contains(className);
    }

    on(event, handler) {
        this.element.addEventListener(event, handler);
        return this;
    }

    off(event, handler) {
        this.element.removeEventListener(event, handler);
        return this;
    }

    onClick(handler) {
        return this.on('click', handler);
    }

    onLoad(handler) {
        return this.on('load', handler);
    }

    onMouseOver(handler) {
        return this.on('mouseover', handler);
    }

    onMouseOut(handler) {
        return this.on('mouseout', handler);
    }

    append(child) {
        if (child instanceof EasyDOM) {
            this.element.appendChild(child.element);
        } else if (child instanceof HTMLElement) {
            this.element.appendChild(child);
        } else {
            this.element.appendChild(document.createTextNode(child));
        }
        return this;
    }

    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        return this;
    }

    setAttr(attr, value) {
        this.element.setAttribute(attr, value);
        return this;
    }

    getAttr(attr) {
        return this.element.getAttribute(attr);
    }

    css(propertyOrObject, value) {
        if (typeof propertyOrObject === 'object') {
            for (const property in propertyOrObject) {
                this.element.style[property] = propertyOrObject[property];
            }
        } else if (value !== undefined) {
            this.element.style[propertyOrObject] = value;
        }
        return this;
    }

    getStyle(property) {
        return getComputedStyle(this.element)[property];
    }

    get computedStyle() {
        return new Proxy(getComputedStyle(this.element), {
            get(target, prop) {
                return target[prop];
            }
        });
    }

    get attr() {
        return new Proxy({}, {
            get: (target, prop) => {
                return this.getAttr(prop);
            },
            set: (target, prop, value) => {
                this.setAttr(prop, value);
                return true;
            }
        });
    }

    get allAttr() {
        const attributes = {};
        Array.from(this.element.attributes).forEach(attr => {
            attributes[attr.name] = attr.value;
        });
        return attributes;
    }
}
