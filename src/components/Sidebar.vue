<template>
    <div class="flex flex-col gap-y-10 p-5">
        <h1 class="text-lg text-center font-semibold uppercase flex justify-center">StuddyBuddy|<p class="text-blue-500">Admin</p></h1>
        <nav>
            <ul class="flex flex-col gap-y-1">
                <li class="flex items-center gap-x-2 px-2 py-1 rounded" :class="{ 'bg-gray-200': $route.name === 'dashboard' }">
                    <Icon icon="uil:chart" class="text-xl" />
                    <router-link :to="{ name: 'dashboard' }" class="font-semibold text-lg">Dashboard</router-link>
                </li>
                <li class="flex items-center gap-x-2 px-2 py-1 rounded" :class="{ 'bg-gray-200': $route.name === 'users' }">
                    <Icon icon="mdi:user" class="text-xl" />
                    <router-link :to="{ name: 'users' }" class="font-semibold text-lg">Users</router-link>
                </li>
                <li class="flex items-center gap-x-2 px-2 py-1 rounded" :class="{ 'bg-gray-200': $route.name === 'feedbacks' }">
                    <Icon icon="mdi:feedback" class="text-xl" />
                    <router-link :to="{ name: 'feedbacks' }" class="font-semibold text-lg">Feedbacks</router-link>
                </li>
                <li class="flex items-center gap-x-2 px-2 py-1 rounded" :class="{ 'bg-gray-200': $route.name === 'reports' }">
                    <Icon icon="ic:round-report" class="text-xl" />
                    <router-link :to="{ name: 'reports' }" class="font-semibold text-lg">Reports</router-link>
                </li>
            </ul>
        </nav>
        <button class="border py-1 rounded border-blue-500 text-blue-500" @click="logout">Sign out</button>
    </div>
</template>

<script setup>
import { auth } from '../config/firebaseConfig'
import { signOut }  from 'firebase/auth'
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
    try {
        await signOut(auth)
        authStore.logout()

        router.push('/')
    } catch (error) {
        console.log(error.message)
    }
}
</script>