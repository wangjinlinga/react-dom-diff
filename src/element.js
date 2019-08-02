
// 虚拟dom
class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

// 返回虚拟节点
function createElement(type, props, children) {
  return new Element(type, props, children)
}
// 设置属性
function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      if (node.tagName.toUpperCase() === 'INPUT' ||
        node.tagName.toUpperCase() === 'TEXTAREA'
      ) {
        node.value = value;
      } else {
        node.setAttribute(key, value)
      }
      break;
    case 'style':
      node.style.cssText = value;
      break;

    default:
      node.setAttribute(key, value)
      break;
  }
}

// 将虚拟dom转成真是dom
function render(eleObj) {
  let el = document.createElement(eleObj.type);
  for (let key in eleObj.props) {
    setAttr(el, key, eleObj.props[key])
  }
  // eslint-disable-next-line no-console
  eleObj.children.map(child => {
    child = (child instanceof Element)
      ? render(child)
      : document.createTextNode(child);
    el.appendChild(child)
  })
  return el;
}

// 将元素插入页面内
function renderDom(el, target) {
  target.appendChild(el);
}

export { createElement, render, Element, renderDom }