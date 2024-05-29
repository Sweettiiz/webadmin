import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' }, // Change redirect to 'login'
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'login' }, // Change redirect to 'login'
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'system-management',
        path: '/system-management',
        component: RouteViewComponent,
        children: [
          {
            name: 'company',
            path: 'company',
            component: () => import('../pages/company/Company.vue'),
          },
          {
            name: 'user-management',
            path: 'user-management',
            component: () => import('../pages/user-management/UserManagement.vue'),
          },
          {
            name: 'issue-dashboard',
            path: 'issue-dashboard',
            component: () => import('../pages/issue-dashboard/IssueDashboard.vue'),
          },
        ],
      },
      {
        name: 'operation-management',
        path: '/operation-management',
        component: RouteViewComponent,
        children: [
          {
            name: 'token-management',
            path: 'token-management',
            component: () => import('../pages/token-management/TokenManagement.vue'),
          },
          {
            name: 'storage',
            path: 'storage',
            component: () => import('../pages/storage/Storage.vue'),
          },
          {
            name: 'company-token',
            path: 'company-token',
            component: () => import('../pages/company-token/CompanyToken.vue'),
          },
          {
            name: 'user-token',
            path: 'user-token',
            component: () => import('../pages/user-token/UserToken.vue'),
          },
        ],
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

export default router
