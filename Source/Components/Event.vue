<!-- Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="center" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
	
		<i18n tag="h2" :path="`event.${event.type}`">
			<template #player><span>{{textName(event.player)}}</span></template>
			<template #target><span>{{textName(event.target)}}</span></template>
		</i18n>

		<br>

		<Card :card="card">
			<transition name="zoom">
				<div v-if="blockVisible" @click="onBlock" class="overlay dark pointer">
					<Timer :text="timerText" :color="timerColor" :time="time"/>
				</div>
			</transition>
		</Card>
		
	</div>
</template>

<script>

import Card from './Card.vue'
import Timer from './Timer.vue'

import { mapState } from 'vuex'
import {socket} from '../socket.js'

import { Cards } from '../cards'

const blockDelay = 6000;
const blockTime = 5000;

export default {
	components: {
		Card, Timer
	},

	computed: {

		...mapState({
			name: s => s.name,
			event: s => s.event,
			cards: s => s.cards,
			status: s => s.status,
		}),

		card() {
			return Cards[this.event.card];
		},

		canBlock() {
			if(!this.card.block) return false;
			if((this.name == this.event.player) != this.card.block.exclusive) return false;
			if(!this.cards.includes(this.card.block.name)) return false; // TODO: Don't try to compare name
	
			return true;
		},

		timerText() {
			return this.canBlock ? this.card.block.timer.text : '';
		},

		timerColor() {
			return this.canBlock ? this.card.block.timer.color : 'grey';
		},
	},

	data: () => ({
		time: 1,
		blockVisible: false,
		timeout: null,
		sound: new Audio(),
	}),

	watch: {
		event() {
			this.onIO();
		},
	},

	created() {
		this.onIO();
	},

	methods: {

		onIO() {

			this.time = 1;
			this.blockVisible = false;
			clearTimeout(this.timeout);

			if(this.event.block) {
				this.sound.src = require(`@/Assets/Audio/${this.card.name}.mp3`).default;
				this.sound.play();
			}

			this.timeout = setTimeout(() => {
				if(this.event.block) {
					this.blockVisible = true;
					this.timerFunc();
				} else {
					this.$store.commit('closeEvent');
				}
			}, blockDelay);
		},

		timerFunc() {
			if(this.time > 0) {
					this.timeout = setTimeout(() => {
						this.time -= 0.1
						this.timerFunc()
					}, blockTime / 10)
				} else {
					this.blockVisible = false;
					this.$store.commit('closeEvent');
				}
		},

		textName(name) {
			return name == this.name ? this.$i18n.t('common.you') : name;
		},

		onBlock() {
			if(this.canBlock) {
				socket.emit('game.play', {
					card: this.card.block.name,
					target: this.event.player,
				});
				this.blockVisible = false;
			}
		},
	}
}
</script>

<style scoped>
span {
	color: #00b0f0;
	font-weight: bold;
}
</style>
