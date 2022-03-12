<!-- Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div>
		<div class="center" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
			<transition name="fade">
				<h2 v-if="name == player">{{ $t('play.turn') }}</h2>
				<h2 v-else> {{ $tc('play.wait', cardNames.length) }} </h2>
			</transition>

			<h3>{{ $tc('play.left', left) }}</h3>

			<Deck :cards="cards" @change="i => {cardIndex = i}"/>

			<transition name="fade">
				<h2 v-if="name == player">
					<button @click="onPlay" class="textButton" :disabled="!canPlay">{{ $t('button.play') }}</button>
					{{ $t('common.or') }}
					<button @click="onDraw" class="textButton">{{ $t('button.draw') }} {{draw}}</button>
				</h2>
			</transition>
		</div>

		<transition name="fade">
			<div v-if="optionsVisible" class="overlay" style="background: #000e;">
				<CardOptions :card="card" :options="card.options" @play="onPlayOptions" @close="onClose"/>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { socket } from '../socket.js'

import Deck from './Deck.vue'
import CardOptions from './CardOptions.vue'

import { ECardType, Cards } from '../cards'

export default {
	components: {
		Deck, CardOptions
	},

	computed: {
		...mapState({
			name: s => s.name,
			draw: s => s.draw,
			left: s => s.left,
			player: s => s.player,
			cardNames: s => s.cards,
		}),

		cards() {
			return this.cardNames.map(n => {
				return Cards[n];
			});
		},

		card() {
			return this.cards[this.cardIndex];
		},

		canPlay() {
			return this.card && this.card.type == ECardType.Action;
		}
	},

	data: () => ({
		cardIndex: 0,
		optionsVisible: false,
	}),

	watch: {
		cards() { // TODO: Deck should watch this and emit change event.
			if(this.cardIndex >= this.cardNames.length) {
				this.cardIndex = this.cardNames.length - 1;
			}
		}
	},

	methods: {
		onDraw() {
			socket.emit('game.draw');
		},

		onPlay() {
			if(this.card.hasOwnProperty('options')) {
				this.optionsVisible = true;
				return;
			}

			socket.emit('game.play', {
				card: this.card.name
			});
		},

		onPlayOptions(options) {
			this.optionsVisible = false;

			socket.emit('game.play', Object.assign({
				card: this.card.name
			}, options));
		},

		onClose() {
			this.optionsVisible = false;
		}
	}
}
</script>
