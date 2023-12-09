import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import Vue from 'vue'

Vue.use(Toast, {
  position: 'top-right',
  duration: 5000,
})
