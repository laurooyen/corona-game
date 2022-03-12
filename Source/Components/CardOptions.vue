<!-- Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>

	<div class="center cardOptions">

	<div v-for="(optionGetter, optionName) in options" :key="optionName" style="width: 100%;">

		<p>{{ $t(`cards.${card.name}.options.${optionName}`) }}</p>
		<select v-model="results[optionName]" class="compact">
			<option :value="undefined" disabled>- Selection -</option> <!-- TODO: Hardcoded language -->
			<option v-for="(value, i) in values(optionGetter)" :key="value + i" :value="value">{{value}}</option>
		</select>
		
	</div>

	<br>

	<h2>
		<button @click="onPlay" class="textButton" :disabled="!canPlay">{{ $t('button.play') }}</button>
		{{ $t('common.or') }}
		<button @click="onClose" class="textButton">{{ $t('button.back') }}</button>
	</h2>

	</div>

</template>

<script>
import { mapState } from 'vuex'

export default {
	props: {
		card: Object,
		options: Object,
	},

	computed: {
		...mapState({
			name: s => s.name,
			cards: s => s.cards,
			players: s => s.players,
			discardPile: s => s.discardPile,
		}),

		canPlay() {
			return Object.keys(this.results).length == Object.keys(this.options).length;
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
			return option(this.name, this.cards, this.players, this.discardPile);
		},
	}
}
</script>

<style>
.cardOptions {
	max-width: 500px;
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
