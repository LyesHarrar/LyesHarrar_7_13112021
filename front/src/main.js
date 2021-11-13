//Création d'une nouvelle instance de Vue
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app') //Définition de l'emplacement dont la Vue est responsable