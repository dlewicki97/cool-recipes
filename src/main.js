import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'
import 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

Vue.config.productionTip = false
var firebaseConfig = {
	apiKey: "AIzaSyDL8y7NwSxsYvaNf8M7K_MwMoNMhgMSzow",
	authDomain: "coolrecipes-f4e21.firebaseapp.com",
	databaseURL: "https://coolrecipes-f4e21.firebaseio.com",
	projectId: "coolrecipes-f4e21",
	storageBucket: "coolrecipes-f4e21.appspot.com",
	messagingSenderId: "387025921582",
	appId: "1:387025921582:web:bffc515356a4005b79a1bf",
	measurementId: "G-4BK3297DFV"
};

  // Initialize Firebase
  export const fb = firebase.initializeApp(firebaseConfig);
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  export const googleProvider = new firebase.auth.GoogleAuthProvider();
  export const facebookProvider = new firebase.auth.FacebookAuthProvider();

  new Vue({
  	router,
  	store,
  	vuetify,
  	render: h => h(App)
  }).$mount('#app')
