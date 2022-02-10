import {fb, db, facebookProvider} from '@/main'

const state = {
	errors: null
};

const getters = {
	getFacebookErrors(state){
		return state.errors;
	}
}

const mutations = {
	setFacebookErrors(state, errors){
		state.errors = errors;
	}
};

const actions = {
	signInWithFacebook({commit, getters, dispatch}){
		fb.auth().signInWithPopup(facebookProvider).then(function(result) {
			var users = getters.getUsers;
			var isUserExists = false;
			var user = result.user;
			for(let i=0 ; i < users.length ; i++){
				if(users[i].email == user.email ){
					isUserExists = true;
				}
			}
			console.log(getters);
			const userData = {
				userName: user.displayName,
				photo: user.photoURL,
				email: user.email,
				bio: ''
			};
			if(!isUserExists){
				db.collection('users').add(userData);
			}
			
			userData.token = user.refreshToken;
			userData.userId = user.uid;
			dispatch('fetchFacebookUser', userData);
		}).catch(function(errors) {
			console.log(errors);
			commit('setFacebookErrors', errors);
		});
	},
	fetchFacebookUser({commit,dispatch}, userData){
		db.collection('users').get().then(query=>{
			query.forEach(doc=>{
				if(doc.data().email == userData.email){
					const facebookUser = {};
					for(let key in doc.data()){
						facebookUser[key] = doc.data()[key];
					}
					facebookUser.token = userData.token;
					facebookUser.userId = userData.userId;
					facebookUser.docId = doc.id;
					const now = new Date();
					const timeToLogout = 3600;
					const expirationDate = new Date(now.getTime() + timeToLogout * 1000);
					facebookUser.expirationDate = expirationDate;
					for(let key in facebookUser){
						localStorage.setItem(key, facebookUser[key]);
					}
					commit('setUserData', facebookUser);
					dispatch('autoLogout', timeToLogout);
				}
			})
		})
	}
};

export default{
	state, getters, mutations, actions
};