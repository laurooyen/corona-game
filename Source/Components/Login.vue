<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="center container">
		<form @submit.prevent="onLogin" class="login">
			<input v-model="name" type="text" :placeholder="$t('login.name')">
			<input v-model="gameUpper" type="text" :placeholder="$t('login.game')">

			<select v-model="$i18n.locale">
				<option v-for="(name, code) in locales" :key="code" :value="code">{{ name }}</option>
			</select>

			<button type="submit" class="button outlined">{{ game ? $t('login.join'): $t('login.create') }}</button>
			
			<p v-if="error" class="error">{{ $t(error) }}</p>
		</form>
	</div>
</template>

<script>
import { socket } from '../socket.js'

import { supportedLocales } from '@/i18n'

export default {
	data() {
		return {
			name: '',
			game: '',
			error: '',
		}
	},
	
	computed: {
		gameUpper: {
			get () { return this.game },
			set (text) { this.game = text.toUpperCase()},
		},

		locales() {
			return supportedLocales;
		}
	},

	created() {
		socket.on('game.error', data => {
			this.error = data.message;
		});
	},

	methods: {
		onLogin() {
			this.error = null;
			socket.emit('game.login', {
				name: this.name,
				game: this.game,
			});
		}
	}
}
</script>

<style>

.error {
	color: red;
	text-align: center;
	font-size: 0.75em;
	margin-top: 16px;
}

.container {
	width: 90%;
	max-width: 250px;
}

.login {
	background: rgba(0, 0, 0, 0.9);

	box-shadow:0 0 32px black;

	padding: 16px;

	border-radius: 10px;
}

.login input,
.login select,
.login button {
	width: 100%;
}

.login input,
.login select {
	margin-bottom: 16px;
}
</style>
