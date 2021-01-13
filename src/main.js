import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ActionCableVue from 'actioncable-vue'

const actionCableVueOptions = {
  debug: true,
  debugLevel: 'error',
  connectionUrl: 'ws://localhost:3000/cable',
  connectImmediately: true
}

createApp(App)
  .use(Antd)
  .use(ActionCableVue, actionCableVueOptions)
  .mount('#app')
