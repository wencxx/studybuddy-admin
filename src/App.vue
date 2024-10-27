<template>
  <div class="flex h-screen"> 
    <sidebar v-if="isAuth" class="w-2/12 h-full border" />
    <router-view class="w-full h-full border p-20" :class="{'!w-10/12 ': isAuth}"/>
  </div>
</template>

<script setup>
import sidebar from '../src/components/Sidebar.vue'
import { useAuthStore } from './store'
import { computed } from 'vue'

const authStore = useAuthStore()

const isAuth = computed(() => authStore.isAuth )

</script>
