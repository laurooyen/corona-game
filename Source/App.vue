<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div id="app">

		<div class="background" :class="{subtle: status != 'login'}"></div>

		<transition name="fade">
			<Players v-if="status != 'login'"/>
		</transition>

		<transition name="fade" mode="out-in">
			<keep-alive>
				<component :is="statusComponent(status)"/>
			</keep-alive>
		</transition>

		<Copyright/>
		
	</div>
</template>

<script>
import Login from './Components/Login.vue'
import Players from './Components/Players.vue'
import Play from './Components/Play.vue'
import Event from './Components/Event.vue'
import Future from './Components/Future.vue'
import Copyright from './Components/Copyright.vue'
import Support from './Components/Support.vue'
import GameStart from './Components/GameStart.vue'
import GameEnd from './Components/GameEnd.vue'
import Manual from './Components/Manual.vue'

import { mapState } from 'vuex'

import { socket } from './socket.js'

export default {
	components: {
		Play, Login, Players, Event, Future, GameStart, Copyright, Support, GameEnd, Manual
	},

	computed: {
		...mapState({
			name: s => s.name,
			game: s => s.game,
			status: s => s.status,
		})
	},

	methods: {
		statusComponent(status) {
			const map = new Map([
				['login', 'Login'],
				['start', 'GameStart'],
				['play', 'Play'],
				['event', 'Event'],
				['future', 'Future'],
				['winner', 'GameEnd'],
				['support', 'Support'],
				['manual', 'Manual'],
			]);

			return map.get(status);
		},
	}
}
</script>
