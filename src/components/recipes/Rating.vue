<template>
	<v-dialog v-model="dialog" persistent max-width="400">
		<template v-slot:activator="{ on }">
			<v-btn v-if="user.docId" v-on="on" color="teal" depressed class="ml-2 d-flex white--text align-center">
				<v-icon class="" left>mdi-star</v-icon>
				<p class="ma-0">Oceń</p>
			</v-btn>
		</template>
		<v-card class="">
			<v-card-title class="headline teal white--text" color="teal" teal primary-title>Oceń przepis!</v-card-title>
			<v-card-text class="pa-5 justify-center d-flex">
				<v-icon class="recipe-star" color="yellow darken-1" :size="star.size" v-for="(star, index) in starType" @mouseleave="resetStars" @mouseenter="fillStars(index)" @click="selectStar(index)"  :key="index">{{star.name}}</v-icon>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn color="teal" class="white--text" @click="rateRecipe">Wyślij</v-btn>
				<v-btn color="error" class="white--text" @click="closeDialog">Zamknij</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import * as RatingHelper from '@/helpers/RatingHelper';

	export default{
		props:['user', 'recipe'],
		data(){
			return{
				dialog: false,
				isSelected: false,
				selectedStar: null,
				starType: [
				{name: 'mdi-star-outline', size: 50}, 
				{name: 'mdi-star-outline', size: 50},
				{name: 'mdi-star-outline', size: 50},
				{name: 'mdi-star-outline', size: 50},
				{name: 'mdi-star-outline', size: 50}
				],
			}
		},
		methods:{
			resetStars(){
				for(let i=0 ; i<5 ;i++){
					if(this.selectedStar == null || this.selectedStar <= i){
						this.starType[i].name = 'mdi-star-outline';
					}
				}
			},
			fillStars(index){
				for(let i=0 ; i<index+1 ;i++){
					this.starType[i].name = 'mdi-star';
				}
			},
			selectStar(index){
				const data = {
					isSelected: this.isSelected,
					selectedStar: this.selectedStar,
					index: index
				};
				const selectStarResult = RatingHelper.selectStar(data);
				this.selectedStar = selectStarResult.selectedStar;
				this.isSelected = selectStarResult.isSelected;
				this.setStarsAttributes(index);

			},
			setStarsAttributes(index){
				const starsAttributes = RatingHelper.setStarsAttributes(this.starType, index, this.isSelected, this.selectedStar);
				this.selectedStar = starsAttributes.selectedStar;
				this.starType = starsAttributes.starType;
			},
			rateRecipe(){
				if(this.rating == null){
					this.recipe.rating.push({
						value: this.selectedStar,
						userID: this.$store.getters.getUserData.userId
					});
				}else{
					for(let i=0 ; i<this.recipe.rating.length ; i++){
						if(this.recipe.rating[i].userID == this.user.userId){
							this.recipe.rating[i].value = this.selectedStar;
						}
					}
				}
				
				this.$store.dispatch('updateRecipe', this.recipe);
				this.dialog = false;
			},
			closeDialog(){
				this.dialog = false;
			}
		},
		computed:{
			rating(){
				return this.$store.getters.getRating;
			}
		},
		watch:{
			rating(){
				if(this.rating != null) this.selectedStar = this.rating;
			}
		},
		created(){
			this.selectedStar = this.rating;
			this.setStarsAttributes(this.selectedStar - 1);
		}
	}
</script>
<style>
	.recipe-star{
		cursor: pointer;
	}
</style>