import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/404', 
    component: () => import('@/views/404') 
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home')
  },
  {
    path: '/edit',
    name: 'Edit',
    component: () => import('@/views/Edit')
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/Preview')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User')
  },
  // {
  //   path: '/upload',
  //   name: 'Upload',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Upload.vue')
  // },
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  routes
})

export default router
