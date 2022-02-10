<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on:dialog }">
			<v-tooltip class="" bottom>
				<template v-slot:activator="{ on:tooltip }">
					<v-btn style="font-size: 0.7rem" class="white--text" text v-on="{...dialog, ...tooltip}">
						<v-icon class="">mdi-login</v-icon>
					</v-btn>
				</template>
				<span>Zaloguj się!</span>
			</v-tooltip>
		</template>
		<v-card>
			<v-card-title class="headline teal white--text" color="teal" teal primary-title>Zaloguj się!</v-card-title>
			<v-card-text class="pa-5">
				<v-form ref="form">
					<v-text-field class="" color="teal" label="E-mail" v-model="email" :rules="[rules.required, rules.email]"></v-text-field>
					<v-text-field class="" color="teal" label="Hasło" v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1" :rules="[rules.required, rules.minLength]"></v-text-field>
				</v-form>
				<p>lub zaloguj się przez:</p>
				<div class="mb-2 d-flex flex-column">
					<v-btn class="mb-2 white--text" color="#dd4b39" @click="signInWithGoogle">
						<v-icon left class="">mdi-google-plus</v-icon>
						<p class="ma-0">Google</p>
					</v-btn>
					<v-btn class="white--text " color="#3578E5" @click="signInWithFacebook">
						<v-icon left class="">mdi-facebook</v-icon>
						<p class="ma-0">Facebook</p>
					</v-btn>
				</div>
				<p>Nie masz jeszcze konta? Zarejestruj się!</p>
				<Register />
				
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn color="teal" class="white--text" :loading="loading" @click="submit">Wyślij</v-btn>
				<v-btn color="error" class="white--text" @click="dialog = false">Zamknij</v-btn>
			</v-card-actions>
		</v-card>
		<Snackbar :snackbar="snackbar" :alertText="alertText" :snackbarColor="snackbarColor" />
	</v-dialog>
</template>

<script>
	import Register from './Register.vue'
	import Snackbar from '@/components/Snackbar';

	export default{
		data(){
			return{
				alertText: '',
				snackbar: false,
				email: '',
				password: '',
				snackbarColor: 'error',
				loading: false,
				rules: {
					required: value => !!value || 'To pole jest wymagane!',
					email: value => {
						const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						return pattern.test(value) || 'Niepoprawny email!'
					},
					minLength: value => value.length >= 8 || 'Hasło musi mieć minimum 8 znaków!',
					
				},
				show1: false,
				dialog: false,
			}
		},
		methods: {
			submit(){
				if(this.$refs.form.validate()){
					const authData = {
						email: this.email,
						password: this.password
					};
					this.loading = true;
					this.$store.dispatch('signIn', authData);
				}
			},
			signInWithGoogle(){
				this.$store.dispatch('signInWithGoogle');
			},
			signInWithFacebook(){
				this.$store.dispatch('signInWithFacebook');
			},
			setSnackbarData(message){
				this.alertText = message;
				this.snackbar = true;
				this.loading = false;
			}

			
		},
		components:{
			Register, Snackbar
		},
		computed:{
			loginErrors(){
				return this.$store.getters.getLoginErrors;
			},
			facebookLoginErrors(){
				return this.$store.getters.getFacebookErrors;
			}

		},
		watch:{
			loginErrors(){
				if(this.loginErrors.code == 'auth/user-not-found'){
					this.setSnackbarData('Nie znaleziono użytkownika, spróbuj ponownie');
				}else if(this.loginErrors.code == 'auth/wrong-password'){
					this.setSnackbarData('Nieprawidłowe hasło!');
				}
			},
			facebookLoginErrors(){
				if(this.facebookLoginErrors.code == 'auth/account-exists-with-different-credential'){
					this.setSnackbarData('Ten email jest juz zarejestrowany. Spróbuj zalogować się przez google lub zresetuj hasło');
				}
			}

		}
	}
</script>