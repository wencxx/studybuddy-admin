import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)

app.component('Icon', Icon)
app.use(router)
app.use(pinia)
app.mount('#app')
