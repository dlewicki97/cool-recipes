<template>
	<v-container class="recipe-container">
		<v-row class="">
			<v-col class="" cols="12" md="8" sm="8">
				<img :src="recipe.photo" alt="" class="recipe-img"></v-col>
				<v-col class="justify-center d-flex flex-column" cols="12" md="4" sm="4">
					<div class="d-flex justify-end">
						<v-btn v-if="!this.recipe.savedByUsers.includes(user.docId) && user.docId != null && user.docId != recipe.userID" depressed color="teal" class="white--text d-flex align-center" @click="saveRecipe">
							<v-icon class="" left>mdi-plus</v-icon>
							<p class="ma-0">Zapisz</p>
						</v-btn>
						<v-btn v-if="user.docId == recipe.userID" @click="editRecipe" depressed color="teal" class="white--text d-flex align- mr-2">
							<v-icon class="" left>mdi-pencil</v-icon>
							<p class="ma-0">Edytuj</p>
						</v-btn>
						<v-btn v-if="user.docId == recipe.userID" @click="deleteRecipe" depressed color="error" :loading="deleteLoading" class="white--text d-flex align-center">
							<v-icon class="" left>mdi-trash-can</v-icon>
							<p class="ma-0">Usuń</p>
						</v-btn>
						<v-btn v-if="this.recipe.savedByUsers.includes(user.docId) ? true : false" depressed color="grey" class="white--text d-flex align-center" @click="unSaveRecipe">
							<v-icon class="" left>mdi-check</v-icon>
							<p class="ma-0">Zapisano</p>
						</v-btn>
					</div>
					<h2 class="display-1">{{recipe.name}}</h2>
					<p>Dodano: {{recipe.date.toDate().toLocaleString()}}</p>
					<div class="d-flex">
						<v-icon class="" color="yellow darken-1" :size="20" v-for="(recipe, index) in rating" :key="recipe.rating">mdi-star</v-icon>						
						<v-icon class="" color="yellow darken-1" :size="20" v-for="(recipe,index) in 5-rating" :key="recipe.rating">mdi-star-outline</v-icon>
						<Rating :user="user" :recipe="recipe"/>
					</div>
					<div>
						<p>Autor: {{recipeUserName}}</p>
					</div>
				</v-col>
			</v-row>
			<v-row class="flex-column">
				<h2 class="title">Opis:</h2>
				<p>{{recipe.description}}</p>
			</v-row>
			<v-row class="flex-column">
				<h2 class="title">Składniki:</h2>
				<p>{{recipe.ingredients}}</p>
			</v-row>
			<v-row class="flex-column">
				<h2 class="title">Przepis:</h2>
				<p>{{recipe.instructions}}</p>
			</v-row>
			<Snackbar :snackbar="snackbar" :alertText="alertText" :snackbarColor="snackbarColor" />
		</v-container>
	</template>

	<script>
		import Rating from '@/components/recipes/Rating';
		import Snackbar from '@/components/Snackbar';
		import {getAverage} from '@/helpers/RatingHelper';

		export default{
			data(){
				return{
					snackbar: false,
					alertText: '',
					saved: false,
					snackbarColor: 'teal',
					currentUserID: localStorage.getItem('docId'),
				}
			},
			components:{
				Rating, Snackbar
			},
			watch:{
				'$route.params.id'(){
					this.$store.dispatch('setCurrentRecipe',this.$route.params.id);
				}
			},
			computed:{
				recipe(){
					return this.$store.getters.getCurrentRecipe;
				},
				user(){
					return this.$store.getters.getUserData;
				},
				rating(){
					let ratingValues = [];
					for(let i =0 ;i<this.recipe.rating.length ; i++){
						ratingValues.push(this.recipe.rating[i].value);
					}
					return getAverage(ratingValues);
				},
				recipeUserName(){
					return this.$store.getters.getRecipeUserName;
				},
				deleteLoading(){
					return this.$store.getters.getDeleteLoading;
				}

			},
			created(){
				this.$store.dispatch('loadRecipes');
				this.$store.commit('setCurrentRecipe', this.$route.params.id);
			},
			methods:{
				closeSnackbar(){
					console.log($event);
				},
				deleteRecipe(){
					if(!confirm('Ta operacja trwale usunie Twój przepis, czy kontynuować?')){
						return;
					}
					this.$store.commit('setDeleteLoading', true);
					this.$store.dispatch('deleteRecipe',this.recipe.id);
					this.snackbar = true;
					this.alertText = 'Pomyślnie usunięto przepis!';
					setTimeout(()=>{
						this.$router.push('/');
						this.$store.dispatch('loadRecipes');
					},4000);
				},
				saveRecipe(){
					if(!localStorage.getItem('token')){
						alert('Musisz się zalogować!');
						return;
					}
					const recipe = this.recipe;
					if(!recipe.savedByUsers){
						recipe.savedByUsers = [];
					}
					if(!recipe.savedByUsers.includes(localStorage.getItem('docId'))){
						recipe.savedByUsers.push(localStorage.getItem('docId'));
						this.saved = true;
					}
					this.$store.dispatch('updateRecipe', recipe);
				},
				unSaveRecipe(){
					const recipe = this.recipe;
					if(!recipe.savedByUsers){
						recipe.savedByUsers = [];
					}
					for(let i=0; i<recipe.savedByUsers.length ; i++){
						if(recipe.savedByUsers[i] == localStorage.getItem('docId')){
							recipe.savedByUsers.splice(i,1);
						}
					}
					this.$store.dispatch('updateRecipe', recipe);
					this.saved = false;
				},
				editRecipe(){
					this.$router.push('/recipeform/'+this.recipe.id);
				},
			},
			beforeRouteLeave(to,from,next){
				if(to.path == '/recipeform'){
					this.$store.commit('destroyCurrentRecipe');
				}
				next();
			}
		}
	</script>

	<style>
		.recipe-container{
			padding: 5rem;
		}
		.recipe-img{
			max-width: 80%;
			height: auto;
		}

	</style>