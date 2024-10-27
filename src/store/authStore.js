import { defineStore } from 'pinia'

const useAuthStore = defineStore('authStore', {
     state: () => ({
        isAuth:!!localStorage.getItem('isAuth'),
        token: localStorage.getItem('token') || null
     }),
     actions: {
        async signIn(token){
            localStorage.setItem('token', token)
            localStorage.setItem('isAuth', true)

            this.token = token
            this.isAuth = true
        },
        async logout(){
            localStorage.removeItem('token')
            localStorage.removeItem('isAuth')

            this.token = null
            this.isAuth = false
        }
     }
})

export default useAuthStore