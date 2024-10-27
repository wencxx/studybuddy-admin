import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from '../store'

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
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
    }else{
        next()
    }
})

export default router