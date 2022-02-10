import Vue from 'vue'
import {fb, db} from '@/main'
import router from '@/router';
import firebase from 'firebase';

const state = {
	recipes: [],
	currentRecipe:{
		description: '',
		ingredients: '',
		instructions: '',
		name: '',
		rating: [],
		date: '',
		photo: '',
		savedByUsers: [],
	},
	recipeFormLoading: false,
	deleteLoading: false
	
};

const getters = {
	getRecipes(state){
		for(let i=0 ;i<state.recipes.length ;i++){
			if(!Array.isArray(state.recipes[i].rating)){
				state.recipes[i].rating = [];
			}
		}
		return state.recipes;
	},
	getCurrentRecipe(state){
		return state.currentRecipe;
	},
	getSavedRecipes(state){
		const savedRecipes = [];
		for(let i=0 ; i<state.recipes.length ; i++){
			if(state.recipes[i].savedByUsers){
				if(state.recipes[i].savedByUsers.includes(localStorage.getItem('docId'))){
					savedRecipes.push(state.recipes[i]);
				}
			}
			
		}
		return savedRecipes;
	},
	getMyRecipes(state){
		const myRecipes = [];
		for(let i=0 ; i<state.recipes.length ; i++){
			if(state.recipes[i].userID == localStorage.getItem('docId')){
				myRecipes.push(state.recipes[i]);
			}
		}
		return myRecipes;
	},
	getRecipe:(state)=>(recipeId)=>{
		for(let i =0 ; i<state.recipes.length ; i++){
			if(state.recipes[i].id == recipeId){
				return state.recipes[i];
			}
		}
	},
	getRecipeFormLoading(state){
		return state.recipeFormLoading;
	},
	getDeleteLoading(state){
		return state.deleteLoading;
	},
	getRating(state, getters){

		let isRated = false;
		let rate = 0;
		const user = getters.getUserData;
		for(let i=0 ; i<state.currentRecipe.rating.length ; i++){
			if(state.currentRecipe.rating[i].userID == user.userId){
				rate = state.currentRecipe.rating[i].value;
				isRated = true;
				break;
			}
		}
		return isRated ? rate : null;
	}
};

const mutations = {
	setRecipes(state, recipes){
		state.recipes = recipes;
	},
	setCurrentRecipe(state, id){
		state.recipes.forEach((item,index)=>{
			if(item.id == id){
				for(let key in item){
					state.currentRecipe[key] = item[key];
				}
			}
		});
	},
	destroyCurrentRecipe(state){
		for(let key in state.currentRecipe){
			state.currentRecipe[key] = '';
		}
	},
	setRecipeFormLoading(state, loading){
		state.recipeFormLoading = loading;
		console.log('ustawianko');
	},
	setDeleteLoading(state, loading){
		state.deleteLoading = loading;
	}
};

const actions = {
	loadRecipes({commit}){
		db.collection('recipes').orderBy('date', 'desc').get().then((query) =>{
			const recipes = [];
			query.forEach(function(doc) {

				const recipe = {};
				for(let key in doc.data()){
					recipe[key] = doc.data()[key];
				}
				recipe['id'] = doc.id;
				recipes.push(recipe);
				
			});
			commit('setRecipes', recipes);
			const routerParamId = router.history.current.params.id;
			if(routerParamId){
				commit('setCurrentRecipe', routerParamId);
			}
		});
	},
	setCurrentRecipe({commit, dispatch}, id){
		commit('setCurrentRecipe', id);
	},
	deleteRecipe({commit},id){
		db.collection('recipes').doc(id).delete().then(()=>{
			commit('setDeleteLoading', false);
		});
	},
	addRecipe({dispatch, commit},recipeData){
		if(recipeData.file != null){
			const storageRef = fb.storage().ref('recipes/'+localStorage.getItem('userId')+'/'+ recipeData.file.name);
			const uploadTask = storageRef.put(recipeData.file);
			uploadTask.on('state_changed', snapshot=>{
			}, error=>{
			}, ()=>{
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					delete recipeData.file;
					recipeData.photo = downloadURL;
					recipeData.date = firebase.firestore.FieldValue.serverTimestamp();
					db.collection('recipes').add(recipeData);
					dispatch('loadRecipes');
					commit('setRecipeFormLoading', false);
				});
			});
		}else{
			delete recipeData.file;
			recipeData.date = firebase.firestore.FieldValue.serverTimestamp();
			recipeData.photo = 'https://firebasestorage.googleapis.com/v0/b/coolrecipes-f4e21.appspot.com/o/placeholders%2Frecipe_placeholder.png?alt=media&token=a23e9154-81c1-4d70-83a1-af110b2649c9';
			db.collection('recipes').add(recipeData);
			dispatch('loadRecipes');
			console.log('bez zdjecia');
			commit('setRecipeFormLoading', false);
		}
		
	},
	updateRecipe({commit},recipe){
		db.collection('recipes').doc(recipe.id).update(recipe);
	},
	editRecipe({dispatch, commit}, recipeData){
		if(recipeData.file != null){
			const storageRef = fb.storage().ref('recipes/'+localStorage.getItem('userId')+'/'+ recipeData.file.name);
			const uploadTask = storageRef.put(recipeData.file);
			uploadTask.on('state_changed', snapshot=>{
			}, error=>{
			}, ()=>{
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					delete recipeData.file;
					recipeData.photo = downloadURL;
					db.collection('recipes').doc(recipeData.id).update(recipeData);
					commit('setRecipeFormLoading', false);
				});
			});
		}else{
			delete recipeData.file;
			dispatch('updateRecipe', recipeData);
			commit('setRecipeFormLoading', false);
		}
	},
	sortRecipes({commit, getters}, sortData){
		
		if(sortData.sortBy == 'rating'){
			var recipes = getters.getRecipes;
			var sortRatings = [];
			for(let i =0 ;i<recipes.length; i++){
				if(recipes[i].rating.length != 0){
					let ratings = [];
					for(let j=0 ; j<recipes[i].rating.length ; j++){
						ratings.push(recipes[i].rating[j].value);
					}
					
					var rating = ratings.reduce((a,b)=> {return a+b;}) / ratings.length;
				}else{
					var rating = 0;
				}
				
				sortRatings.push([recipes[i].id, rating]);
			}
			if(sortData.sortType == 'asc'){
				sortRatings.sort((a,b)=>{
					return a[1] - b[1];
				});
			}else{
				sortRatings.sort((a,b)=>{
					return b[1] - a[1];
				});
			}
			var sortedRecipes = [];
			for(let i=0 ; i<sortRatings.length ;i++){
				sortedRecipes.push(getters.getRecipe(sortRatings[i][0]));
			}
			commit('setRecipes', sortedRecipes);
			

			
		}else{
			db.collection('recipes').orderBy(sortData.sortBy, sortData.sortType).get().then(query=>{
				const recipes = [];
				query.forEach(function(doc) {

					const recipe = {};
					for(let key in doc.data()){
						recipe[key] = doc.data()[key];
					}
					recipe['id'] = doc.id;
					recipes.push(recipe);

				});

				commit('setRecipes', recipes);
			})
		}
		
	}

};

export default{
	state, getters, mutations, actions
};

