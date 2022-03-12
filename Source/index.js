// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

console.log(
	"%cTHIS GAME IS OPEN SOURCE\n%chttps://github.com/laurooyen/corona-game",
	"color: green; font-size: 36px;", "font-size: 21px;"
);

import Vue from 'vue'
import Vuex from 'vuex'

import i18n from "./i18n.js"

Vue.use(Vuex);

import App from './App.vue'

import '@/Styles/Style.css'
import '@/Styles/Animation.css'

import {socket} from './socket.js'

const audio = new Audio(require('@/Assets/MainTheme.mp3').default);

const store = new Vuex.Store({

	state: {
		status: 'login',
		game: '',
		name: '',
		cards: [],
		future: [],
		discardPile: [],
		players: [],
		player: '',
		draw: 0,
		left: 0,
		event: {
			type: null,
			player: null,
			target: null,
			card: null,
			block: null,
		},
	},

	mutations: {
		closeEvent(s) {
			if(s.status == 'event') s.status = 'play';
		},

		setStatus(s, d) {
			s.status = d.status;

			if(d.status == 'future') {
				s.future = d.future;
			}
		},

		setEvent(s, d) {
			s.status = 'event';
			s.event = d;
		},

		setPlayers(s, d) {
			s.players = d.players;
			s.player = d.player;
			s.draw = d.draw;
			s.left = d.left;
			s.discardPile = d.discardPile;
		},

		setCards(s, d) {
			s.cards = d.cards;
		},

		login(s, d) {
			s.name = d.name;
			s.game = d.game;
			s.status = 'start';

			audio.volume = 0.2;
			audio.loop = true;
			//audio.play();
		}
	},

});


socket.on('disconnect', () => {
	// TODO: Enable this
	//store.commit('setStatus', { status: 'login' });
});

socket.on('game.status', data => { store.commit('setStatus', data); });
socket.on('game.login', data => { store.commit('login', data); });
socket.on('game.event', data => { store.commit('setEvent', data); });
socket.on('game.players', data => { store.commit('setPlayers', data); });
socket.on('game.cards', data => { store.commit('setCards', data); });

const app = new Vue({
	el: '#app',
	store, i18n,
	components: { App },
	render: h => h(App),
});
