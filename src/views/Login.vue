<template>
    <div class="flex items-center justify-center bg-gray-100">
        <form @submit.prevent="signIn" class="bg-white w-1/4 h-fit rounded shadow p-4 space-y-5">
            <h1 class="text-center font-semibold text-lg">Hi Admin</h1>
            <p v-if="err" class="bg-red-500 pl-2 rounded py-[2px] text-white">{{ err }}</p>
            <div class="flex flex-col gap-y-2">
                <div class="flex flex-col gap-y-2">
                    <label>Username</label>
                    <input type="text" class="border h-8 rounded pl-2" v-model="username">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Password</label>
                    <input type="password" class="border h-8 rounded pl-2" v-model="password">
                </div>
                <button v-if="!signingIn" class="bg-blue-500 py-1 rounded text-white hover:bg-blue-600 mt-3">Sign in</button>
                <button v-else class="bg-blue-500 py-1 rounded text-white hover:bg-blue-600 mt-3 animate-pulse" disabled>Signing in...</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../config/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthStore } from '../store'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('') 
const password = ref('') 


const err = ref('')
const signingIn = ref(false)

const signIn = async () => {
    try {
        signingIn.value = true
        const userCredentials = await signInWithEmailAndPassword(auth, `${username.value}@gmail.com`, password.value)
        const user = userCredentials.user

        authStore.signIn(user.accessToken)

        router.push('dashboard')
    } catch (error) {
        console.log(error.code)
        if(error.code === 'auth/invalid-credential'){
            err.value = 'invalid credentials'
        }else{
            err.value = error.message
        }
    }finally{
        signingIn.value = false
    }
}
</script>