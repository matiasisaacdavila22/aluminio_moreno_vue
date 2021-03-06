
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'signin' },
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayoutAdmin.vue'),
    children: [
      { path: '', component: () => import('pages/AdminProducts.vue'),name: 'adminDashboard', meta: {auth: true} },
      { path: 'products', component: () => import('pages/AdminProducts.vue'),name: 'adminProducts', meta: {auth: true} },
      { path: 'categories', component: () => import('pages/AdminCategories.vue'),name: 'adminCategories', meta: {auth: true} },
      { path: 'line', component: () => import('pages/AdminLine.vue'),name: 'adminLine', meta: {auth: true} },
      { path: 'model', component: () => import('pages/AdminModel.vue'),name: 'adminModel', meta: {auth: true} },
      { path: 'config', component: () => import('pages/AdminConfig.vue'),name: 'adminConfig', meta: {auth: true} },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
