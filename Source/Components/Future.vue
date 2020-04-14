<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="center" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
		<h2>{{ $t('future.title') }}</h2>
		<br>
		<div class="fan">
			<Card v-for="(card, i) in cards" :key="card.name + i" :card="card"/>
		</div>
		<br>
		<h2><button @click="onClose" class="textButton">{{ $t('button.back') }}</button></h2>
	</div>
</template>

<script>
import { mapState } from 'vuex'

import Card from './Card.vue'

import Cards from '../cards.js'

export default {
	components: {
		Card
	},

	computed: {
		...mapState({
			cardNames: s => s.future
		}),

		cards() {
			return this.cardNames.map(n => {
				return Cards[n];
			});
		}
	},

	methods: {
		onClose() {
			this.$store.commit('setStatus', {status: 'play'});
		}
	}
}
</script>

<style>
.fan {
	width: 210px;
	height: 280px;
}

.fan .card {
	position: absolute;
	transform-origin: center 200%;
}

.fan .card:hover {
	z-index: 1;
}

.fan .card:first-child {
	transform: rotate(15deg);
}

.fan .card:last-child {
	transform: rotate(-15deg);
}

</style>
