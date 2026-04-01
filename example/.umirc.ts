import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  reactQuery: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: '产品管理',
      path: '/demo',
      routes: [
        {
          path: '/demo',
          component: './demo',
        },
        {
          name: '新建产品',
          path: '/demo/create',
          component: './demo/form',
          hideInMenu: true,
        },
        {
          name: '产品详情',
          path: '/demo/:id',
          component: './demo/detail',
          hideInMenu: true,
        },
        {
          name: '编辑产品',
          path: '/demo/:id/edit',
          component: './demo/form',
          hideInMenu: true,
        },
      ],
    },
  ],
  mock: {},
  npmClient: 'pnpm',
});

