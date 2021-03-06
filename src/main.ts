// register vue composition api globally
import '@unocss/reset/tailwind.css'
import ElementPlus from 'element-plus'
// Element Plus
import 'element-plus/dist/index.css'
import PhosphorVue from 'phosphor-vue'
import { createPinia } from 'pinia'
import LocalStorageService from 'services/local_storage'
import { useUserStore } from 'store/user'
import 'uno.css'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/element/index.scss'
import './styles/main.scss'

const app = createApp(App)

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(PhosphorVue)

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.auth
  const hasNoToken = !LocalStorageService.instance.hasAccessToken()
  if (requiresAuth && hasNoToken) {
    return next('/login')
  }

  const userStore = useUserStore()

  const requiresAdmin = to.meta?.admin
  if (requiresAdmin && !userStore.isAdmin) {
    return next('/')
  }
  next()
})

app.mount('#app')
