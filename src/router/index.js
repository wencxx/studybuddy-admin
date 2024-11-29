import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from '../store'
import dashboard from '../views/Dashboard.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboard,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('../views/Users.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/feedbacks',
        name: 'feedbacks',
        component: () => import('../views/feedbacks.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/reports',
        name: 'reports',
        component: () => import('../views/Reports.vue'),
        meta: {
            requiresAuth: true
        }
    }
]


const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if(to.meta.requiresAuth && !authStore.isAuth){
        next('/')
    }else if(to.path === '/' && authStore.isAuth){
        next('/dashboard')
    }else{
        next()
    }
})

export default router