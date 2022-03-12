<!-- Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="center start">
		<h2>{{ $t('game-start.welcome', { name }) }}</h2>
		<br>
		<template v-if="name == host">
			<h3>{{ $t('game-start.share') }}</h3>
			<h2>{{game}}</h2>
			<br>
			<h3>{{ $t('game-start.start') }}</h3>
			<h2><button @click="onStart" class="textButton" :disabled="!canStart">{{ $t('button.start') }}</button></h2>
		</template>
		<template v-else>
			<h3>{{ $t('game-start.wait', { host }) }}</h3>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { socket } from '../socket.js'

export default {
	computed: {
		...mapState({
			name: s => s.name,
			game: s => s.game,
			players: s => s.players,
		}),

		host() {
			return this.players[0].name;
		},

		canStart() {
			return this.players.length > 1;
		}
	},

	methods: {
		onStart() {
			socket.emit('game.start');
		}
	}
}
</script>

<style>
.start {
	width: 100%;
}
</style>
