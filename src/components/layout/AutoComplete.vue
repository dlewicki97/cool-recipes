<template>
	<v-autocomplete v-model="model" :items="items" :search-input.sync="search" clearable hide-details  item-text="name" label="Wyszukaj przepis..." class="pa-4" :color="color">
		<template v-slot:no-data>
			<v-list-item>
				<v-list-item-title>
					Znajdź
					<strong>przepis</strong>
					dla siebie!
				</v-list-item-title>
			</v-list-item>
		</template>
		<template v-slot:item="{ item }">
			<div @click="goTo(item.id)" tag="router-link" :to="'/recipe/'+item.id" class="d-flex completeListItem" style="width:100%">
				<v-list-item-avatar color="indigo" class="headline font-weight-light white--text">
					<img :src="item.photo" alt="">
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title v-text="item.name"></v-list-item-title>
				</v-list-item-content>
			</div>
		</template>
	</v-autocomplete>
</template>

<script>
	export default {
		props: ['list', 'color'],
		data(){
			return{
				model: null,
				items: [],
				search: null,
			}
			
		},
		watch: {
			search (val) {
				if (this.items.length > 0) {
					return;
				}
				if(this.list == null){

					this.items = this.recipes;
				}else{
					this.items = this.list;
				}
			},
		},
		computed:{
			recipes(){
				return this.$store.getters.getRecipes;
			}
		},
		beforeRouteLeave(to,from,next){
			this.model = '';
			next();
		},
		methods:{
			goTo(id){
				this.$router.push('/recipe/'+id);
			}
		}
	}
</script>

<style>
	.completeListItem{
		border-bottom: 1px solid #009688;
	}
</style>