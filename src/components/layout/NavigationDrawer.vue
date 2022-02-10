<template>
	<v-navigation-drawer v-model="drawer" color="teal" left app dark>
		<v-list dense nav class="py-0">
			<v-row class="align-center justify-center mt-5 mb-3 flex-column" >
				<v-avatar v-if="this.user.token" class="" size="100">
					<img class="" :src="user.photo" alt="">
				</v-avatar>
				<p class="white--text subtitle-1 mt-1">
					{{this.userName}}
				</p>
				<Login v-if="loginButton"/>
				<AutoComplete />
			</v-row>
			<v-divider class="my-2"></v-divider>
			<Pages v-for="page in pages" :key="page.title" :isLogged="isLogged" :page="page" />
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	import AutoComplete from '@/components/layout/AutoComplete'
	import Pages from '@/components/layout/Pages'
	import Login from '@/components/auth/Login'

	export default{
		props:['drawer', 'isLogged'],
		data(){
			return {
				loginButton: true,
				pages: [
				{ title: 'Katalog', icon: 'mdi-view-dashboard', path: '/', login: 'visible' },
				{ title: 'Mój Profil', icon: 'mdi-account', path: '/myprofile', login: 'hidden' },
				{ title: 'Moja książka kucharska', icon: 'mdi-book-open-page-variant', path: '/cookbook', login: 'hidden' },
				],
			}
		},
		computed:{
			user(){
				return this.$store.getters.getUserData;
			},
			userName(){
				if(this.$store.getters.getUserData.userName == null){
					this.loginButton = true;
				}else{
					this.loginButton = false;
					return this.$store.getters.getUserData.userName;
				}
			}
		},
		components:{
			AutoComplete, Pages, Login
		}
	}
</script>