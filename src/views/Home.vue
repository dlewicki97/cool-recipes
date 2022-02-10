<template>
	<v-container class="">
		<v-chip v-for="(sortChip, index) in sortChips" :key="index" class="mr-2 sort-chip mb-2" @click="sortRecipes(sortChip.sortBy, sortChip.sortType)" filter :filter-icon="sortChip.icon" :input-value="true">{{ sortChip.name }}</v-chip>
		<v-row class="">
			<v-col class=""  cols="12" md="4" sm="6" v-for="(recipe,index) in recipes" :key="recipe.id">
				<router-link class="" :to="`/recipe/${recipe.id}`" style="text-decoration: none;">
					<v-card class="h-100" >
						<v-card-title class="justify-center">
							<img class="" :src="recipe.photo" alt="" style=" height: 200px; width:100%;">
						</v-card-title>
						<v-card-text class="text-center">
							<div class="">
								<div class="caption grey--text">Przepis</div>
								<div class="">{{recipe.name}}</div>
							</div>
							<div class="">
								<div class="caption grey--text">Użytkownik</div>
								<div class="">{{getUserName(recipe.userID)}}</div>
							</div>
							<div class="">
								<div class="caption grey--text">Dodano</div>
								<div class="">{{recipe.date.toDate().toLocaleString()}}</div>
							</div>
							<div class="">
								<div class="caption grey--text">Ocena</div>
								<v-icon class="" color="yellow darken-1" :size="20" v-for="recipe in getRating(recipe.rating)" :key="recipe.rating">mdi-star</v-icon>						
								<v-icon class="" color="yellow darken-1" :size="20" v-for="recipe in 5-getRating(recipe.rating)" :key="recipe.rating">mdi-star-outline</v-icon>
							</div>
						</v-card-text>
						
					</v-card>
				</router-link>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import {getAverage} from '@/helpers/RatingHelper';
	export default{
		data(){
			return{
				sortChips:[
				{sortBy: 'date', sortType:'asc', name:'Czas Dodania', icon: 'mdi-chevron-up'},
				{sortBy: 'date', sortType:'desc', name:'Czas Dodania', icon: 'mdi-chevron-down'},
				{sortBy: 'name', sortType:'asc', name:'Nazwa', icon: 'mdi-chevron-up'},
				{sortBy: 'name', sortType:'desc', name:'Nazwa', icon: 'mdi-chevron-down'},
				{sortBy: 'rating', sortType:'asc', name:'Ocena', icon: 'mdi-chevron-up'},
				{sortBy: 'rating', sortType:'desc', name:'Ocena', icon: 'mdi-chevron-down'},
				]
			}	
			
		},
		props: ['givenRecipes'],
		computed:{
			recipes(){
				const recipes = this.$store.getters.getRecipes;
				const profileRecipes = [];
				if(this.$route.path == '/myprofile'){
					for(var i=0 ; i<recipes.length ; i++){
						if(recipes[i].userID == localStorage.getItem('docId')){
							profileRecipes.push(recipes[i]);
						}
					}
					return profileRecipes;
				}else{
					if(this.givenRecipes){
						return this.givenRecipes;
					}else{
						return recipes;
					}
				}
			}
		},
		methods:{
			getRating(rating){
				let ratingValues = [];
				for(let i =0 ;i<rating.length ; i++){
					ratingValues.push(rating[i].value);
				}
				return getAverage(ratingValues);
			},
			sortRecipes(sortBy, sortType){
				this.$store.dispatch('sortRecipes', {
					sortBy: sortBy,
					sortType: sortType
				});
			},
			getUserName(userID){
				return this.$store.getters.getUserName(userID);
			},
			
		},
		created(){
			this.$store.dispatch('loadRecipes');
		}
	}
</script>

<style>
	.sort-chip{
		cursor: pointer!important;
	}
</style>


