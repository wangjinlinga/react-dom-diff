/* eslint-disable no-console */
import { createElement, render, renderDom } from './element'
import diff from './diff'
import patch from './patch'

let vertualDom = createElement(
  'ul',
  { class: 'list' },
  [
    createElement('li', { class: 'item' }, ['a']),
    createElement('li', { class: 'item' }, ['b']),
    createElement('li', { class: 'item' }, ['c']),
  ]
)

let vertualDom2 = createElement(
  'ul', 
  {class: 'group'},
  [
    createElement('li', {class: 'item'}, ['1']),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['3']),
  ]
)

// dom diff 作用 根据两个虚拟对象创建补丁，描述改变的内容，用来跟新dom

// dom diff 的三种优化策略
// 1. 平级比较、
// 2. 不会跨级比较
// 2. 平级比较换位置，会根据key直接换位置，减少dom操作

// 先序深度优先遍历

let patches = diff(vertualDom, vertualDom2)
console.log(patches)
let el = render(vertualDom)
renderDom(el, window.root)
// 给元素打补丁，重新更新视图
patch(el, patches)

// 问题 （依赖index处理以下问题）
// 如果评级元素有互换，那会导致重新渲染
// 新增节点也不会被更新
