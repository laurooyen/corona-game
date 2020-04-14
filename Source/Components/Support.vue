<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="center support" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
		<h2>{{$t('support.title')}}</h2>
		<h3>{{$t('support.desc')}}</h3>
		<br>
		<a href="https://paypal.me/laurooyen" target="_blank" style="background: #fff">
			<img :src="require('@/Assets/PayPal.svg').default"/>
		</a>
		<a href="https://patreon.com/bePatron?u=25943402" target="_blank" style="background: #e85b46">
			<img :src="require('@/Assets/Patreon.svg').default"/>
		</a>
		<br>
		<h2><button @click="onClose" class="textButton">{{ $t('button.next') }}</button></h2>
	</div>
</template>

<script>
export default {
	methods: {
		onClose() {
			this.$store.commit('setStatus', {status: 'start'});
		}
	}
}
</script>

<style scoped>
.support a {
	width: 200px;
	height: 40px;
	padding: 10px;
	border-radius: 5px;
	display: inline-block;
	margin: 5px;
	box-shadow: 3px 3px 7px rgba(0,0,0,0.4);
	transition: all 0.2s;
}

.support a:hover {
	transform: scale(1.05);
}

.support img {
	width: 100%;
	height: 100%;
}
</style>