import Vue from 'vue'
import axiosAuth from '@/axios-files/axios-auth'
import {db, auth} from '@/main'

const state = {
	errors: null
};

const getters = {
	getSignUpErrors(state){
		return state.errors;
	}
}

const mutations = {
	setSignUpErrors(state, errors){
		state.errors = errors;
	}
};

const actions = {
	signUp({commit, dispatch}, authData){
		auth.createUserWithEmailAndPassword(authData.email, authData.password).then(cred=>{
			const userData = {
				userId: cred.user.uid,
				token: cred.user.refreshToken,
				userName: authData.userName
			}
			const now = new Date();
			const timeToLogout = 3600;
			const expirationDate = new Date(now.getTime() + timeToLogout * 1000);
			localStorage.setItem('token', userData.token);
			localStorage.setItem('userId', userData.userId);
			localStorage.setItem('expirationDate', expirationDate);
			commit('setUserData', userData);
			delete authData.password;
			authData.photo = 'https://firebasestorage.googleapis.com/v0/b/coolrecipes-f4e21.appspot.com/o/placeholders%2Favatar_placeholder.png?alt=media&token=a53a239f-ed1e-4de8-ba7c-80c29f82f52f';
			authData.bio = "";
			dispatch('saveNewUser', authData);
			dispatch('autoLogout', timeToLogout);
		}).catch(err=>{
			commit('setSignUpErrors', err);
		});
		
	},
	saveNewUser({getters}, authData){
		if(!getters.getUserData.token){
			return
		}
		db.collection('users').add(authData);
	},
	
};

export default {
	state, getters, mutations, actions
};