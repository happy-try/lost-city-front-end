import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import ActionCableVue from 'actioncable-vue'

import router from './router/index.js'

const actionCableVueOptions = {
  debug: true,
  debugLevel: 'error',
  connectionUrl: 'ws://192.168.31.32:3000/cable',
  connectImmediately: true
}

createApp(App)
  .use(Antd)
  .use(ActionCableVue, actionCableVueOptions)
  .use(router)
  .mount('#app')
