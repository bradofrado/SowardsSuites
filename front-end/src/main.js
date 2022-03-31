import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VCalendar from 'v-calendar';

//Import dayjs and use utc plugin
import dayjs from 'dayjs'
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(VCalendar);

Vue.use(dayjs);

Vue.config.productionTip = false

let data = {
    isLoading: true,
    user: null
}

new Vue({
  router,
  data,
  render: h => h(App),
  watch: {
    '$route': function() {
      this.$root.$data.isLoading = true;
    }
  }
}).$mount('#app')
