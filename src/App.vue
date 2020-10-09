<template>
	<v-app>
		<router-view />
	</v-app>
</template>

<script>
	export default {
		name: 'App',

		data: () => ({
			a: 1,
		}),
	};
</script>
