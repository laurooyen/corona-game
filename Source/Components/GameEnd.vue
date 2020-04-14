<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="center" style="width: 100%;">
		<h2>{{ $t('game-end.winner', {name: isWinner ? $t('common.you') : player}) }}</h2>
		<br>
		<h2><button @click="onClose" class="textButton">{{ $t('button.next') }}</button></h2>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	computed: {
		...mapState({
			name: s => s.name,
			player: s => s.player,
		}),

		isWinner() {
			return this.name == this.player;
		}
	},

	methods: {
		onClose() {
			this.$store.commit('setStatus', { status: 'support' });
		}
	}
}
</script>
