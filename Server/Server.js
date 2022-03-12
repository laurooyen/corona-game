// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const fs = require('fs');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const PORT = process.env.PORT || 3000;
const LOG_FILE = path.resolve(__dirname, '../logs/connections.txt');

function log(message) {
	const timestamp = new Date().toISOString();
	fs.appendFile(LOG_FILE, timestamp + ' ' + message + '\n', function () {});
}

const app = express();

const server = app.listen(PORT);

// --------------------------------
// LOGIC
// --------------------------------

const io = socket(server, {
	// TODO: This enables CORS for all origins
	cors: {
		methods: ["GET", "POST"],
	}
});

const Game = require('./Game.js');
const Player = require('./Player.js');
const { Util, ArrayUtil } = require('../Source/Utility.js');

const users = new Map();
const games = new Array();

io.on('connection', function(socket) {

	socket.on('disconnect', () => {
		if(!users.has(socket.id)) return;

		const { player, game } = users.get(socket.id);

		log('LOGOUT - ' + game.id + ' - ' + player.name);
		
		ArrayUtil.remove(game.players, player);
		socket.leave(game.id);
		users.delete(socket.id);
		
		game.sendPlayers();

		if(game.players.length == 0) {
			ArrayUtil.remove(games, game);
		}
	});

	socket.on('game.login', data => {

		if(users.has(socket.id)) {
			socket.emit('game.error', { message: 'error.connected' });
			return;
		}

		const name = Util.escape(data.name);

		if(!name || name.length > 16) {
			socket.emit('game.error', { message: 'error.name-invalid' });
			return;
		}

		let game;

		if(data.game) {
			game = games.find(g => g.id == data.game);

			if(!game) {
				socket.emit('game.error', { message: 'error.game-invalid' });
				return;
			}
		} else {
			game = new Game(io);
		}

		if(game.started) {
			socket.emit('game.error', { message: 'error.game-started' });
			return;
		}

		if(game.players.some(p => p.name == name)) {
			socket.emit('game.error', 'error.name-exists');
			return;
		}

		const player = new Player(socket.id, name);

		log('LOGIN - ' + game.id + ' - ' + player.name);

		games.push(game);
		game.players.push(player);
		game.player = player;

		socket.join(game.id);

		users.set(socket.id, {
			game: game,
			player: player
		});

		socket.emit('game.login', {
			game: game.id,
			name: player.name,
		});

		game.sendPlayers();
	});

	socket.on('game.start', data => {
		if(!users.has(socket.id)) return;
		const { player, game } = users.get(socket.id);
		game.onStart(player, data);
	});

	socket.on('game.play', data => {
		if(!users.has(socket.id)) return;
		const { player, game } = users.get(socket.id);
		game.onPlay(player, data);
	});

	socket.on('game.draw', data => {
		if(!users.has(socket.id)) return;
		const { player, game } = users.get(socket.id);
		game.onDraw(player, data);
	});
});
