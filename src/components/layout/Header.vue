<template>
	<v-container>
		<AppBar :isLogged="isLogged" :drawer="drawer" />
		<NavigationDrawer :drawer="drawer" :isLogged="isLogged"/>
	</v-container>
</template>

<script>
	
	
	import AppBar from '@/components/layout/AppBar'
	import NavigationDrawer from '@/components/layout/NavigationDrawer'

	export default {
		data () {
			return {
				drawer: true,
			}
		},
		components:{
			AppBar, NavigationDrawer
		},
		computed:{
			isLogged(){
				return this.$store.getters.getUserData.token != null  ? true : false;
			}
		}
	}
</script>

