import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router/index.js'
import { createPinia } from 'pinia'
import locale from 'element-plus/dist/locale/zh-cn.js'


const app=createApp(App)
const pinia=createPinia();
app.use(pinia)
app.use(router)
app.use(ElementPlus,{locale})
app.mount('#app')
