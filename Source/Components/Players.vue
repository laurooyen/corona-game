<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div style="text-align: center; overflow-x: auto;">
		<div ref="players" class="players">
			<a v-for="p in players" :key="p.name" :class="{dead:p.dead, active:p.name == player}">
				{{p.name}}
				<span v-if="p.cards > 0">{{p.cards}}</span>
				<span v-if="p.skip > 0" style="color: indianred">{{p.skip}}</span>
			</a>
			<div class="indicator" :style="lineStyle"></div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'

import { socket } from '../socket.js'

export default {

	computed: {
		...mapState({
			players: s => s.players,
			player: s => s.player,
		}),
	},

	data() {
		return {
			lineStyle: {
				width: 0,
				left: '50%',
			}
		}
	},

	watch: {
		players: function() {this.slideLine()},
		player: function() {this.slideLine()},
	},

	methods: {
		slideLine() {
			if(this.$refs.players) {
				this.$nextTick(() => {
					const element = this.$refs.players.querySelector('.active');

				if(!element) return;

				element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'center'});
	
				this.lineStyle.width = element.offsetWidth - 10;
				this.lineStyle.left = element.offsetLeft + 5;
				})
			}
		}
	},
}
</script>

<style scoped>
span {
	color: #00b0f0;
	margin-left: 3px;
}

.players {
	position: relative;
	white-space: nowrap;
	display: inline-block;
	box-sizing: border-box;
	padding: 8px 0;
}

.players a {
	padding: 0 15px;
	color: #fff;
	overflow: hidden;
	text-align: center;
}

.players a.dead {
	color: #888;
}

.players .dead span {
	display: none;
}

.indicator {
	height: 4px;
	bottom: 0;
	position:absolute;
	
	border-radius: 2px;
	background-color: #00b0f0;
	
	transition: all ease-in-out 0.5s;
}
</style>
