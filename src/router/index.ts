import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
import { done, start } from '../utils/nprogress'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue')
      },
      // 主播
      {
        path: '/anchor',
        name: 'Anchor',
        component: () => import('@/views/Anchor/index.vue')
      },
      // 直播记录
      {
        path: '/live',
        name: 'Live',
        component: () => import('@/views/Live/index.vue')
      },
      // 个人信息
      {
        path: '/info',
        name: 'Info',
        component: () => import('@/views/Wallet/info.vue')
      },
      // 充值记录
      {
        path: '/recharge',
        name: 'Recharge',
        component: () => import('@/views/Wallet/recharge.vue')
      },
      // 消费记录
      {
        path: '/expend',
        name: 'Expend',
        component: () => import('@/views/Wallet/expend.vue')
      },
      // 充值卡
      {
        path: '/card',
        name: 'Card',
        component: () => import('@/views/Wallet/card.vue')
      },
      // 提现申请
      {
        path: '/withdrawal',
        name: 'Withdrawal',
        component: () => import('@/views/Wallet/withdrawal.vue')
      },
      // 转账
      {
        path: '/transfer',
        name: 'Transfer',
        component: () => import('@/views/Wallet/transfer.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (_pre, _next) => {
  start()
})
router.afterEach(() => {
  done()
})

router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('authtoken')

  if (to.name !== 'Login' && !isAuthenticated) {
    // 如果未登录且目标路由不是登录页，则重定向到登录页面
    next({ name: 'Login' })
    ElMessage.error('请先登录')
  } else if (to.name === 'Login' && isAuthenticated) {
    // 如果已登录且目标路由是登录页，则重定向到首页
    next({ name: 'Home' })
  } else {
    // 否则，继续正常导航
    next()
  }
})

export function useRouter() {
  return router
}

export function useRoute() {
  return router.currentRoute
}

export default router
