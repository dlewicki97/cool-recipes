import Vue from 'vue'
import axios from '@/axios-files/axios-db'

const actions = {
	
	autoLogin({commit, getters, dispatch}){
		const token = localStorage.getItem('token');
		if(!token){
			return
		}
		const expirationDate = localStorage.getItem('expirationDate');
		const now = new Date();
		if(Date.parse(now) >= Date.parse(expirationDate)){
			dispatch('logout');
			return
		}
		const userData = {};
		for(let key in getters.getUserData){
			userData[key] = localStorage.getItem(key);
		}
		commit('setUserData', userData);
	}
};

export default {actions};
