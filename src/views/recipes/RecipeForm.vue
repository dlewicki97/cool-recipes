<template>
	<v-card class="recipe-form-card">
		<v-card-title class="headline teal white--text" color="teal" teal primary-title>{{!$route.params.id ? 'Dodaj przepis!': 'Edytuj przepis!' }}</v-card-title>
		<v-card-text class="pa-5">
			<v-form ref="form">
				<v-row class="">
					<v-col class="" md="8" cols="12">
						<v-text-field class="" color="teal" label="Tytuł" v-model="recipe.name" :rules="[rules.required]"></v-text-field>
						<v-text-field class="" color="teal" label="Opis" v-model="recipe.description" :rules="[rules.required]"></v-text-field>
						<v-text-field class="" color="teal" label="Składniki" v-model="recipe.ingredients" :rules="[rules.required]"></v-text-field>
						<v-text-field class="" color="teal" label="Przepis" v-model="recipe.instructions" :rules="[rules.required]"></v-text-field>
					</v-col>
					<v-col class="" md="4" cols="12">
						<div class="text-center ">
							<v-avatar v-if="recipe.photo == ''" class="" :size="170">
								<v-icon dark class="grey--text" :size="50">mdi-camera</v-icon>
							</v-avatar>
							<div tile color=""  class="avatar-recipe">
								<img v-if="recipe.photo != ''" :src="recipe.photo" width="100%" height="auto" alt="">
							</div>
						</div>
						<v-file-input class="" color="teal" label="Zdjęcie" @change="avatar" counter show-size prepend-icon="mdi-camera" ></v-file-input>
					</v-col>
				</v-row>
				
			</v-form>
		</v-card-text>
		<v-divider></v-divider>
		<v-card-actions class="pa-4">
			<v-btn color="teal" class="white--text" :loading="loading" @click="submit">Wyślij</v-btn>
		</v-card-actions>
		<Snackbar :snackbar="snackbar" :alertText="alertText" :snackbarColor="snackbarColor" />
	</v-card>
</template>

<script>
	import {fb, db} from '@/main'
	import Snackbar from '@/components/Snackbar'

	export default{
		data(){
			return{
				snackbar: false,
				alertText: '',
				snackbarColor: 'teal',
				rules:{
					required: v => !!v || 'To pole jest wymagane!',
				},
				file: null

			}
		},
		methods:{
			submit(){
				if(this.$refs.form.validate()){
					if(this.$route.params.id != null){
						const recipeData = {
							description: this.recipe.description,
							ingredients: this.recipe.ingredients,
							instructions: this.recipe.instructions,
							name: this.recipe.name,
							rating: this.recipe.rating,
							userID: this.$store.getters.getUserData.docId,
							file: this.file,
							savedByUsers: this.recipe.savedByUsers,
							photo: this.recipe.photo,
							id: this.recipe.id
						};
						this.$store.commit('setRecipeFormLoading', true);
						if(this.file == null){
							setTimeout(()=>{this.$store.dispatch('editRecipe', recipeData);},1000);
						}else{
							this.$store.dispatch('editRecipe', recipeData);
						}
						
					}else{
						const recipeData = {
							description: this.recipe.description,
							ingredients: this.recipe.ingredients,
							instructions: this.recipe.instructions,
							name: this.recipe.name.charAt(0).toUpperCase() + 
           this.recipe.name.slice(1),
							rating: [],
							userID: this.$store.getters.getUserData.docId,
							file: this.file,
							savedByUsers: [],
						};
						this.$store.commit('setRecipeFormLoading', true);
						if(this.file == null){
							setTimeout(()=>{this.$store.dispatch('addRecipe', recipeData);},1000);
						}else{
							this.$store.dispatch('addRecipe', recipeData);
						}
					}
				}
			},
			avatar(event){
				if(event){
					this.recipe.photo = URL.createObjectURL(event);
					this.file = event;
					
				}else{
					this.recipe.photo = null;
				}
				
			}
		},
		computed:{
			recipe(){
				return this.$store.getters.getCurrentRecipe;
			},
			loading(){
				return this.$store.getters.getRecipeFormLoading;
			}
		},
		watch:{
			'$route.path'(){
				this.$store.commit('destroyCurrentRecipe');
				this.file = null;
			},
			loading(){
				if(this.loading == false){
					this.snackbar = true;
					this.alertText = 'Pomyślnie dodano/edytowano przepis!';
					this.file = null;
					setTimeout(()=>{this.$router.push('/');},4000);
				}
			}
		},
		components:{
			Snackbar
		},

	}
</script>

<style>
	.recipe-form-card{
		border: 1px solid #009688;
		margin: 50px;
	}

</style>