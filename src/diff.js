/* eslint-disable no-console */
// 规则：
// 当节点类型一致时，比较属性是否相同, 产生一个属性补丁包{type: 'Attrs', ATTRS: {class: 'list-groupd'}}
// 2. 新的dom节点不存在 {type: 'REMOVE', index: xxx}
// 3.节点类型不相同，直接采用替换模式 {type: 'REPLACE', newNode: newNode}
// 4.文本变化 {type: 'TEXT', text: 1}

function diff (oldTree, newTree) {
  let patches = {}
  let index = 0 // 遍历树的第0个
  // 递归树，比较后的结果放到补丁包中
  walk(oldTree, newTree, index, patches)
  
  return patches
}

function diffAttr (oldAttrs, newAttrs) {
  let patch = {};
  for(let key in oldAttrs) {
    // 判断老的属性和新的属性是否相同
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key] // 有可能是undefined(新节点没有属性)
    }
  }
  for (let key in newAttrs) {
    // 老节点没有新节点的属性
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]
    }
  }
  return patch;
}
const ATTRS = 'ATTRS'
const TEXT = 'TEXT'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
let Index = 0

function diffChildren(oldChildren, newChildren, index, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, idx) => {
    // 索引不应该是index ------
    // index 每次传递给walk, index是递增的, 所有人都基于一个序号实现
    // walk(child, newChildren[idx], ++index, patches)
    walk(child, newChildren[idx], ++Index, patches)
  })
}

function isString (node) {
  return Object.prototype.toString.call(node) === '[object String]'
}

function walk (oldNode, newNode, index, patches) {
  let currentPatch = []; // 当前的补丁包
  if (!newNode) {
    currentPatch.push({type: REMOVE, index})
  } else if (isString(oldNode) && isString(newNode)) {
    // 判断文本是否一致
    if (oldNode !== newNode) {
      currentPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if (oldNode.type === newNode.type) {
    // 类型一致，比较属性和孩子
    // 比较属性是否有更改
    let attrs = diffAttr(oldNode.props, newNode.props)
    //attrs是否有值
    if (Object.keys(attrs).length > 0) {
      currentPatch.push({type: ATTRS, attrs})
    }
    // 如果有儿子节点 遍历儿子
    diffChildren(oldNode.children, newNode.children, index, patches)
  }
  if (currentPatch.length > 0) {
    // 将元素和补丁对应起来，放到大补丁中
    patches[index] = currentPatch
  } else {
    currentPatch.push({text: REPLACE, newNode})
  }
  return patches
}

export default diff