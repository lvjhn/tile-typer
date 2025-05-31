// --- create pinia plugin
import { createPinia } from 'pinia'
export const pinia = createPinia()

// -- use persisted state plugin
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)

