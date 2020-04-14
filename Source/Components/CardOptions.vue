<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>

	<div class="center cardOptions">

	<div v-for="option in options" :key="option.id" style="width: 100%;">

		<p>{{option.desc}}</p>
		<select v-model="results[option.id]" class="compact">
			<option :value="undefined" disabled>- Selection -</option>
			<option v-for="(value, i) in values(option)" :key="value + i" :value="value">{{value}}</option>
		</select>
		
	</div>

	<br>

	<h2>
		<button @click="onPlay" class="textButton" :disabled="!canPlay">{{ $t('button.play') }}</button>
		or
		<button @click="onClose" class="textButton">{{ $t('button.back') }}</button>
	</h2>

	</div>

</template>

<script>
import { mapState } from 'vuex'

import Cards from '../cards.js'

export default {
	props: {
		options: Array,
	},

	computed: {
		...mapState({
			name: s => s.name,
			cards: s => s.cards,
			players: s => s.players,
			discardPile: s => s.discardPile,
		}),

		canPlay() {
			return Object.keys(this.results).length == this.options.length;
		}
	},

	data: () => ({
		results: {},
	}),

	methods: {
		onPlay() {
			this.$emit('play', this.results);
		},

		onClose() {
			this.$emit('close');
		},

		values(option) {
			return option.get(this.name, this.cards, this.players, this.discardPile);
		},
	}
}
</script>

<style>
.cardOptions {
	width: 100%;
	padding: 64px;
}

.cardOptions p {
	margin-bottom: 5px;
}

.cardOptions select {
	margin-bottom: 15px;
}

.cardOptions select {
	width: 100%;
}
</style>
