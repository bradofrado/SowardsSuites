import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import rooms from './mock-data.js'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

let data = {
    rooms: rooms,
    isLoading: true
}

new Vue({
  router,
  data,
  render: h => h(App),
  watch: {
    '$route': function(to, from) {
      console.log(`Went from ${from.path} to ${to.path}`);
      this.$root.$data.isLoading = true;
    }
  }
}).$mount('#app')
