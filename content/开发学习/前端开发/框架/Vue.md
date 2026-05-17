---
title: "Vue"
date: 2025-01-01
tags: []
---

# 0. Vue 简介
> [!note] 概述
> ## **什么是 Vue？—— 渐进式框架概念**
> 这是最核心的概念，也是 Vue 区别于其他框架的最大特点。
> - **官方定义**：Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。
>
> - **“渐进式”详解（关键重点）**：这意味着 Vue 的设计允许你根据项目需求，**像搭积木一样**，从简到繁地采用它的能力。
>
> 一个形象的比喻：Vue 就像一个**多功能瑞士军刀**。
> - 你可以在一个简单的静态页面中，只把它当作一个**脚本引入**，用它来渲染一些动态数据（就像只用军刀上的小刀）。
> - 随着页面变复杂，你可以开始使用它的**组件系统**来组织代码（就像用军刀上的剪刀和锉刀）。
> - 当应用成长为复杂的单页面应用 (SPA) 时，你再引入**官方路由** (Vue Router) 和**状态管理** (Vuex/Pinia) 等库（就像把军刀的其他工具都用上）。
>
> *这与 Spring 的“约定大于配置”思想异曲同工*：Vue 的“渐进式”给了你极大的灵活性，而不是强制你一开始就接受一整套复杂的约定和配置。
> - **与 React/Angular 的直观对比**：
> 	- **React**：更像是一个“库”，专注于视图层，路由、状态管理等需要社区方案，选择多但需要自行组合决策。
> 	- **Angular**：是一个“全栈式框架”，功能大而全，但上手成本和概念较多，需要你接受它完整的一套东西。
> 	- **Vue**：折中了两者，提供了**渐进式的核心+官方维护的配套方案**，在灵活性和开箱即用之间找到了平衡。
>
> 在开始 Vue 之前，需要学习 [[HTML-CSS]] 和 [[JavaScript学习|JavaScript]]。
>
> Vue.js 是一个 JVVM（类比 [[Spring]] 中的 MVC）的实现者，核心是实现了*DOM 监听和双向数据绑定*，使得页面能够随着数据的变化（或反之）而发生改变。

---

# 1. 基础篇
## 1.1 环境搭建与第一个 Vue 应用
- **引入方式**：CDN、Vue CLI、Vite
- **Vue 实例**：`new Vue({ el: '#app', data: {} })`
- **模板语法**：插值 `{{ }}`、指令 `v-bind`、`v-on`、`v-model`、`v-if`、`v-for`
- **生命周期钩子**：`created`、`mounted`、`updated`、`destroyed`

## 1.2 数据绑定与响应式
- **响应式原理**：Object.defineProperty / Proxy
- **计算属性**：`computed`
- **侦听器**：`watch`
- **数组变更检测**：`Vue.set`、`this.$set`

## 1.3 组件基础
- **组件定义**：全局组件、局部组件
- **组件通信**：`props`、`$emit`、`$parent`、`$children`
- **插槽**：`<slot>`、具名插槽、作用域插槽

## 1.4 条件渲染与列表渲染
- `v-if` / `v-else` / `v-else-if`
- `v-show`
- `v-for` 与 `key` 的重要性

---

# 2. 进阶篇
## 2.1 Vue Router
- **安装与配置**：`Vue.use(VueRouter)`
- **路由定义**：`routes`、`path`、`component`
- **导航守卫**：`beforeEach`、`beforeResolve`、`afterEach`
- **动态路由**：`params`、`query`

## 2.2 状态管理 (Vuex / Pinia)
- **Vuex 核心概念**：State、Getters、Mutations、Actions
- **Pinia**：更轻量、TypeScript 友好的替代方案
- **模块化**：命名空间、动态注册

## 2.3 组件进阶
- **混入 (Mixins)**：代码复用
- **自定义指令**：`Vue.directive`
- **过滤器**：`Vue.filter`
- **插件开发**：`Vue.use`

## 2.4 性能优化
- **懒加载**：路由懒加载、组件懒加载
- **虚拟滚动**：`vue-virtual-scroller`
- **防抖与节流**：`lodash` 或自定义

---

# 3. 实战篇
## 3.1 项目初始化
- **Vite + Vue 3**：`npm create vite@latest`
- **目录结构**：`src/components`、`src/views`、`src/router`、`src/store`
- **ESLint + Prettier**：代码规范

## 3.2 用户管理模块
- **表单验证**：`vee-validate` 或 `vuelidate`
- **API 交互**：`axios` 封装
- **状态持久化**：`vuex-persistedstate`

## 3.3 权限控制
- **路由守卫**：动态路由、角色权限
- **按钮级权限**：自定义指令 `v-permission`

## 3.4 部署与 CI/CD
- **构建优化**：`npm run build`
- **Docker 部署**：`Dockerfile`、`docker-compose`
- **自动化部署**：GitHub Actions / GitLab CI

---

# 4. 附录
- **官方文档**：https://cn.vuejs.org/
- **Vue 3 新特性**：Composition API、Teleport、Fragment
- **常见问题**：响应式失效、内存泄漏、SSR 问题