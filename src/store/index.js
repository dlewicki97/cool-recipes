import Vue from 'vue'
import Vuex from 'vuex'
import register from './modules/register';
import autoLogin from './modules/autoLogin';
import logout from './modules/logout';
import login from './modules/login';
import users from './modules/users';
import recipes from './modules/recipes';
import files from './modules/files';
import googleAuth from './modules/googleAuth';
import facebookAuth from './modules/facebookAuth';

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		register,
		autoLogin,
		logout,
		login,
		users,
		recipes,
		files,
		googleAuth,
		facebookAuth
	},
	state:{
		userData:{
			userId: null,
			token: null,
			userName: null,
			expirationDate: null,
			photo: null,
			bio: null,
			docId: null,
			email: null
		}
		
	},
	getters:{
		getUserData(state){
			return state.userData;
		}
	},
	mutations : {
		setUserData(state, userData){
			for(let key in  userData){
				state.userData[key] = userData[key];
			}
		},
		clearAuthData(state){
			const obj = state.userData;
			Object.keys(obj).forEach(function(index) {
				obj[index] = null;
			});
		}
	}
})
