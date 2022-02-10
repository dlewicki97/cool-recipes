import {fb, db, googleProvider} from '@/main'

const state = {
	errors: null
};

const getters = {
	getGoogleErrors(state){
		return state.errors;
	}
}

const mutations = {
	setGoogleErrors(state, errors){
		state.errors = errors;
	}
};

const actions = {
	signInWithGoogle({commit, getters, dispatch}){
		fb.auth().signInWithPopup(googleProvider).then(function(result) {
			var users = getters.getUsers;
			var isUserExists = false;
			var user = result.user;
			for(let i=0 ; i < users.length ; i++){
				if(users[i].email == user.email ){
					isUserExists = true;
				}
			}
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
			dispatch('fetchGoogleUser', userData);
		}).catch(function(errors) {
			commit('setGoogleErrors', errors);
			console.log(errors);
		});
	},
	fetchGoogleUser({commit,dispatch}, userData){
		db.collection('users').get().then(query=>{
			query.forEach(doc=>{
				if(doc.data().email == userData.email){
					const googleUser = {};
					for(let key in doc.data()){
						googleUser[key] = doc.data()[key];
					}
					googleUser.token = userData.token;
					googleUser.userId = userData.userId;
					googleUser.docId = doc.id;
					const now = new Date();
					const timeToLogout = 3600;
					const expirationDate = new Date(now.getTime() + timeToLogout * 1000);
					googleUser.expirationDate = expirationDate;
					for(let key in googleUser){
						localStorage.setItem(key, googleUser[key]);
					}
					commit('setUserData', googleUser);
					dispatch('autoLogout', timeToLogout);
				}
			})
		})
	}
};

export default{
	state, getters, mutations, actions
};