<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on:dialog }">
			<v-tooltip class="" bottom>
				<template v-slot:activator="{ on:tooltip }">
					<v-btn style="font-size: 0.7rem" class="white--text text--lighten-2" text >
						<v-icon color="white" v-on="{...dialog, ...tooltip}">mdi-account-plus</v-icon>
					</v-btn>
				</template>
				<span>Zarejestruj się!</span>
			</v-tooltip>
		</template>
		<v-card>
			<v-card-title class="headline teal white--text" color="teal" teal primary-title>Dołącz do nas!</v-card-title>
			<v-card-text class="pa-5">
				<v-form ref="form">
					<v-text-field class="" color="teal" label="E-mail" v-model="email" :rules="[rules.required, rules.email]"></v-text-field>
					<v-text-field class="" color="teal" label="Nick" v-model="userName" :rules="[rules.required, rules.userUnique]"></v-text-field>
					<v-text-field class="" color="teal" label="Hasło" v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1" :rules="[rules.required, rules.minLength]"></v-text-field>
					<v-text-field class="" color="teal" label="Powtórz Hasło" :rules="[rules.required, rules.matchPassword]" v-model="passwordConfirm" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" @click:append="show2 = !show2"></v-text-field>
				</v-form>
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
	import Snackbar from '@/components/Snackbar'

	export default{
		data(){
			return{
				email: '',
				alertText: '',
				snackbar: false,
				snackbarColor: 'error',
				password: '',
				loading: false,
				passwordConfirm: '',
				userName: '',
				rules: {
					required: value => !!value || 'To pole jest wymagane!',
					email: value => {
						const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						return pattern.test(value) || 'Niepoprawny email!'
					},
					minLength: value => value.length >= 8 || 'Hasło musi mieć minimum 8 znaków!',
					matchPassword: value => value == this.password || 'Hasła muszą być takie same!',
					userUnique: value => !this.users.includes(value) || 'Ten nick jest już zajęty!',
				},
				show1: false,
				show2: false,
				dialog: false,
			}
		},
		methods: {
			submit(){
				if(this.$refs.form.validate()){
					const authData = {
						email: this.email,
						password: this.password,
						userName: this.userName
					};
					this.loading = true;
					this.$store.dispatch('signUp', authData);
				}
			},
			setSnackbarData(message){
				this.alertText = message;
				this.snackbar = true;
				this.loading = false;
			}
		},
		computed:{
			users(){
				return this.$store.getters.getUsers;
			},
			signUpErrors(){
				return this.$store.getters.getSignUpErrors;
			}
		},
		created(){
			this.$store.dispatch('getUsers');
		},
		watch:{
			signUpErrors(){
				if(this.signUpErrors.code == 'auth/email-already-in-use'){
					this.setSnackbarData('Ten email jest już zarejestrowany');
				}
			}
		},
		components:{
			Snackbar
		}
	}
</script>