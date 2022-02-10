import Vue from 'vue'
import axios from '@/axios-files/axios-db'
import {fb, db} from '@/main'
import firebase from 'firebase'
import router from '@/router';

const state = {
	users: [],
	editLoading: false,
	errors: null
};

const getters = {
	getUsers(state){
		return state.users;
	},
	getRecipeUserName(state, getters){
		const userID = getters.getCurrentRecipe.userID;
		for(let i=0 ; i<state.users.length ; i++){
			if(state.users[i].docId == userID){
				return state.users[i].userName;
			}
		}
	},
	getUserName:(state) => (userID)=>{
		for(let i=0 ; i<state.users.length ; i++){
			if(state.users[i].docId == userID){
				return state.users[i].userName;
			}
		}
	},
	getEditLoading(state){
		return state.editLoading;
	},
	getEditErrors(state){
		return state.errors;
	}
}

const mutations = {
	setUsers(state, users){
		state.users = users;
	},
	setEditLoading(state, loading){
		state.editLoading = loading;
	},
	setEditErrors(state, errors){
		state.errors = errors;
	}
};

const actions = {
	getUsers({commit}){
		db.collection('users').get().then(query=>{
			var users = [];
			query.forEach(doc=>{
				var user = {};
				for(let key in doc.data()){
					user[key] = doc.data()[key];
				}
				user.docId = doc.id;
				users.push(user);
			});
			commit('setUsers', users);
		});
		
	},
	editUserWithFile({dispatch, commit}, userData){
		const storageRef = fb.storage().ref('avatars/'+localStorage.getItem('userId')+'/'+ userData.file.name);
		const uploadTask = storageRef.put(userData.file);
		uploadTask.on('state_changed', snapshot=>{
		}, error=>{
		}, ()=>{
			uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				delete userData.file;
				userData.photo = downloadURL;
				localStorage.setItem('photo', userData.photo);
				commit('setUserData', userData);
				const docId = userData.docId;
				delete userData.docId;
				db.collection('users').doc(docId).update(userData);
			});
		});
	},
	editUserWithoutFile({dispatch, commit}, userData){
		const docId = userData.docId;
		delete userData.docId;
		delete userData.file;
		commit('setUserData', userData);
		db.collection('users').doc(docId).update(userData);
	},
	changeUserPassword({commit}, passwordData){
		let user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(
			user.email, 
			passwordData.oldPassword
			);

		user.reauthenticateWithCredential(credential).then(function() {
			user.updatePassword(passwordData.newPassword).then(res => {
				console.log(res);
				commit('setEditLoading', false);
			}, (error) => {
				console.log(error);
			});
		}).catch(function(error) {
		});

	},
	deleteAccount({commit}, password){
		let user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(
			user.email, 
			password
			);

		user.reauthenticateWithCredential(credential).then(function() {
			user.delete().then(res => {
				console.log(res);
				commit('setEditLoading', false);
				commit('setEditErrors',{code: 'success'});
			}, (error) => {
				commit('setEditLoading', false);
			});
		}).catch(function(error) {
			commit('setEditErrors', error);
			commit('setEditLoading', false);
		});
	}
};

export default {
	state, getters, mutations, actions
};