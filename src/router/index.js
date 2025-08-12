import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Menu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/news/:date',
      name: 'news',
      component: () => import('../views/Menu.vue')
    },
    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/MyBill',
      name: 'MyBill',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      
      component: () => import('../views/Menu.vue')
    },
    {
      path: '/Report',
      name: 'Report',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/Menu',
      name: 'Menu',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      
      component: () => import('../views/Menu.vue')
    },
    {
      path: '/Cart',
      name: 'Cart',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      
      component: () => import('../views/Menu.vue')
    },
    {
      path: '/Comments',
      name: 'Comments',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/AllBills',
      name: 'AllBills',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      
      component: () => import('../views/AllBills.vue')
    },

    ////////////////////////////////////////////
  {
    path: '/login',
    name: 'staff-login',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/LoginView.vue')
  },

  {
    path: '/register',
    name: 'staff-register',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/StaffView.vue')
  },


  ]
})

export default router
