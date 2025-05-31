// --- load stylesheet 
import "./style.scss" 

// --- create app 
import App from "./App.vue" 
import { createApp } from "vue"
const app = createApp(App)

// --- setup pinia 
import { pinia } from "./plugins/pinia.setup"
app.use(pinia) 

// --- setup view router 
import { router } from "./plugins/vue-router.setup"
app.use(router)

// --- setup state
import { initializeState } from "./stores/state.store"
initializeState()

// --- mount app 
app.mount("#app")
