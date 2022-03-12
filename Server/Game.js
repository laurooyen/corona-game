// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const { ECardType, Cards } = require('../Source/Cards.js');
const { Util, ArrayUtil } = require('../Source/Utility.js');

module.exports = class Game {
	constructor(io) {
		this.io = io;
		this.id = Util.gameID();

		this.started = false;

		this.players = [];

		this.drawPile = [];
		this.discardPile = [];
		this.data = null;

		this.player = null; // The player whose turn it is.

		this.timer = null;
		this.blockCount = 0;
		this.blockTime = 11500;

		this.drawCount = 1;
	}

	onStart(player) {
		this.player = ArrayUtil.random(this.players);

		this.drawPile = [];
		this.discardPile = [];

		this.drawCount = 1;

		this.drawPile.push(...ArrayUtil.repeat(Cards.Nope, 10));
		this.drawPile.push(...ArrayUtil.repeat(Cards.FakeNews, 2));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Vaccine, 2));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Sneeze, 5));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Skip, 5));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Future, 4));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Shuffle, 3));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Hamster, 2));
		this.drawPile.push(...ArrayUtil.repeat(Cards.IllegalPopUpShop, 3));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Multiply, 2));
		this.drawPile.push(...ArrayUtil.repeat(Cards.AmericanHealthcare, 2));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Lockdown, 3));
		this.drawPile.push(...ArrayUtil.repeat(Cards.Handshake, 10));

		ArrayUtil.shuffle(this.drawPile);
		
		// Give each player a Vaccine and some other cards.
		for(const player of this.players) {
			player.dead = false;
			player.skip = 0;

			const cards = this.drawPile.splice(0, 7);
			player.cards = [Cards.Vaccine, ...cards];
		}

		this.drawPile.push(
			Cards.InfectedTissue,
			//Cards.HealthInspection,
			Cards.Mutation,
			Cards.SuccesfulResearch,
			//Cards.CoronaParty,
		);

		this.drawPile.push(...ArrayUtil.repeat(Cards.Corona, this.players.length - 1));

		ArrayUtil.shuffle(this.drawPile);
		
		this.sendPlayers();
		
		for(const player of this.players) {
			this.sendCards(player);
		}

		this.started = true;

		this.io.to(this.id).emit('game.status', {
			status: 'play'
		});
	}

	next() {
		const next = this.players.indexOf(this.player) + 1;

		for(let i = 0; i < this.players.length; i++) {
			const player = this.players[(next + i) % this.players.length];

			if(player.dead) {
				continue;
			}

			if(player.skip > 0) {
				player.skip--;
				continue;
			}

			return this.player = player;
		}
	}

	sendPlayers() {
		const players = this.players.map(p => {
			return {
				name: p.name,
				cards: p.cards.length,
				dead: p.dead,
				skip: p.skip,
			}
		});
		
		this.io.to(this.id).emit('game.players', {
			players: players,
			player: this.player.name,
			draw: this.drawCount,
			left: this.drawPile.length,
			discardPile: ArrayUtil.unique(this.discardPile.filter(c => c.type != ECardType.Event).map(c => c.name)),
		});
	}

	sendCards(player) {
		const cards = player.cards.map(c => {
			return c.name;
		});

		this.io.to(player.id).emit('game.cards', {
			cards: cards,
		});
	}

	onEffect(player, card, data) {
		if(card.type == ECardType.None) {
			this.data = data;
			return;
		}

		if(card.type == ECardType.Action) {
			if(player != this.player) return;
		}

		if(card.type == ECardType.Event) {
			if(player != this.player) return;
		}

		if(card.type == ECardType.Block) {
			if(!ArrayUtil.last(this.discardPile, 1).block) return; // Can last card be blocked
			if((player.name == data.target) != card.exclusive) return; // TODO: Use canBlock

			clearTimeout(this.timer);
			this.blockCount++;
		} else {
			this.data = data;
		}

		this.io.to(this.id).emit('game.event', {
			type: card == Cards.Vaccine ? 'survive' : data.target && card.type == ECardType.Action ? 'target' : card.type,
			player: player.name,
			target: card == Cards.Vaccine ? null : data.target,
			card: card.name,
			block: true,
		});

		this.sendCards(player);
		this.sendPlayers();
		
		this.timer = setTimeout(() => {
			const card = ArrayUtil.last(this.discardPile, this.blockCount);

			if(this.blockCount % 2 == 0) {
				card.effect(this, this.data);
			} else {
				if(card.type == ECardType.Event) {
					// TODO: This won't work if opted out early
					ArrayUtil.remove(this.discardPile, card);
					ArrayUtil.random(this.drawPile, card);
				}
			}
	
			this.blockCount = 0;

			if(this.drawCount == 0 || this.player.dead) {
				this.drawCount = 1;
				this.next();
			}

			const alive = this.players.filter(p => !p.dead);

			if(alive.length == 1) {
				this.started = false;

				this.io.to(this.id).emit('game.status', {
					status: 'winner',
				});
			}

			this.sendPlayers();
			for(const player of this.players) {
				this.sendCards(player);
			}

		}, this.blockTime);
	}

	onPlay(player, data) {
		const card = Cards[data.card];

		if(card.type == ECardType.None || card.type == ECardType.Event) return;

		if(card.hasOwnProperty('options')) {
			for (const [key, value] of Object.entries(card.options)) {
				if(!value(player.name, player.cards.map(c => c.name), this.players, this.discardPile).includes(data[key])) {
					return;
				};
			}
		}

		if(!ArrayUtil.remove(player.cards, card)) return;

		this.discardPile.push(card);

		this.onEffect(player, card, data);
	}

	onDraw(player, data) {
		if(player != this.player) return;

		const card = this.drawPile.pop();

		this.drawCount--;

		if(card.type == ECardType.Event) {
			this.discardPile.push(card);
			this.onEffect(player, card, {});
		} else {
			player.cards.push(card);

			this.io.to(player.id).emit('game.event', {
				type: ECardType.Event,
				player: player.name,
				target: null,
				card: card.name,
				block: false,
			});

			if(this.drawCount == 0) {
				this.drawCount = 1;
				this.next();
			}
			
			this.sendCards(player);
			this.sendPlayers();
		}
	}
}
