<template>
	<v-snackbar v-model="snackbar" :timeout="4000" class="white--text" :color="snackbarColor" right>
		{{ alertText  }}
		<v-btn color="white" text @click="snackbar = false">
			Zamknij
		</v-btn>
	</v-snackbar>
</template>

<script>
	export default{
		props:['alertText','snackbarColor', 'snackbar']
		
	}
</script>