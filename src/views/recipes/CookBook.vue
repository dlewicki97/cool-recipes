<template>
	<v-tabs
	:centered="true" color="teal" :grow="true"   class="ma-4">
	<v-tabs-slider></v-tabs-slider>
	<v-tab v-for="(tab, index) in tabs" :key="index" :href="`#tab-${index}`">
		{{tab.name}}
	</v-tab>
	<v-tab-item v-for="(tab, index) in tabs" :key="index" :value="`tab-${index}`" >
		<v-card flat tile>
			<v-card-text>
				<AutoComplete :color="tab.color" :list="tab.recipes"/>
				<Home :givenRecipes="tab.recipes" />
			</v-card-text>
		</v-card>
	</v-tab-item>
</v-tabs>

</template>

<script>
	import Home from '@/views/Home'
	import AutoComplete from '@/components/layout/AutoComplete'

	export default{
		components:{
			Home, AutoComplete
		},
		computed:{
			myRecipes(){
				return this.$store.getters.getMyRecipes;
			},
			savedRecipes(){
				return this.$store.getters.getSavedRecipes;
			},
			tabs(){
				return [{name: 'Moje przepisy', recipes: this.myRecipes, color: 'teal'},
				{name: 'Zapisane przepisy', recipes: this.savedRecipes, color: ''}];
			}
		}
	}
</script>