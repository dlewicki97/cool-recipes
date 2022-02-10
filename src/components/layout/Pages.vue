<template>
	<v-list-item  link router :to="page.path" v-if="isLogged  || !isLogged && page.login == 'visible'">
		<v-list-item-icon>
			<v-icon>{{ page.icon }}</v-icon>
		</v-list-item-icon>
		<v-list-item-content>
			<v-list-item-title>{{ page.title }}</v-list-item-title>
		</v-list-item-content>
	</v-list-item>
</template>

<script>
	export default{
		props:['isLogged', 'page']
	}
</script>