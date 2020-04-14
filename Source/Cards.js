// Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const { ArrayUtil } = require('./Utility.js');

const ECardType = {
	Action: 'action',
	Event:  'event',
	Block:  'block',
	None:   'none',
}

const EBlockType = {
	Others:   'others',
	Everyone: 'everyone',
	Self:     'self',
}

function canBlock(player, target, card) {
	if(!card.block) return false;
	if(card.blockType == EBlockType.Everyone) return true;

	return (player == target) != (card.blockType == EBlockType.others);
}

// ################################
// BLOCK
// ################################

const Nope = {
	name: 'Nope',
	color: '#000',

	type: 'block',
	block: null,
	exclusive: false,

	timer: { text: 'NOPE', color: '#ff0000' },
}

Nope.block = Nope;

const FakeNews = {
	name: 'FakeNews',
	color: '#000',

	type: 'block',
	block: Nope,
	exclusive: false,

	timer: { text: 'FAKE', color: '#ff8c00' },
}

const Vaccine = {
	name: 'Vaccine',
	color: '#14d200',

	type: 'block',
	block: null,
	exclusive: true,

	timer: { text: 'HEAL', color: '#9acd32' },
}

// ################################
// PLAY
// ################################

const Sneeze = {
	name: 'Sneeze',
	color: '#f2ff87',

	type: 'play',
	block: Nope,

	effect(g) {
		g.drawCount++;
		g.next();
	}
}

const Skip = {
	name: 'Skip',
	color: '#000',

	type: 'play',
	block: Nope,

	effect(g) {
		g.drawCount--;
	}
}

const Future = {
	name: 'Future',
	color: '#000',

	type: 'play',
	block: Nope,

	effect(g) {
		const future = g.drawPile.slice(-3).map(c => c.name);
		g.io.to(g.player.id).emit('game.status', {status: 'future', future: future});
	}
}

const Shuffle = {
	name: 'Shuffle',
	color: '#000',

	type: 'play',
	block: Nope,

	effect(g) {
		ArrayUtil.shuffle(g.drawPile);
	}
}

const Hamster = {
	name: 'Hamster',
	color: '#ff9900',

	type: 'play',
	block: Nope,

	effect(g) {
		const sorted = g.players.filter(p => !p.dead && !p.skip).sort((a, b) => a.cards.length - b.cards.length);
		if(sorted.length < 2) return;

		g.drawCount = sorted[1].cards.length - sorted[0].cards.length + 1;
		g.player = sorted[0];
	}
}

const IllegalPopUpShop = {
	name: 'IllegalPopUpShop',
	color: '#000',

	type: 'play',
	block: Nope,

	effect(g, d) {
		ArrayUtil.remove(g.player.cards, Cards[d.give]);
		g.player.cards.push(Cards[d.take]);
	},

	options: [
		{id: 'give', desc: "Card from yourself to give", get(n, c, p, d) {
			return ArrayUtil.unique(c.filter(c => Cards[c].name != 'IllegalPopUpShop'));
		}},
		{id: 'take', desc: "Card from the discard pile to take", get(n, c, p, d) {
			return d;
		}},
	]
}

const Multiply = {
	name: 'Multiply',
	color: '#2c8edf',

	type: 'play',
	block: Nope,

	effect(g, d) {
		g.player.cards.push(Cards[d.copy]);
	},

	options: [
		{id: 'copy', desc: "Card to duplicate", get(n, c, p, d) {
			return ArrayUtil.unique(c.filter(c => Cards[c].type == 'play').map(c => Cards[c].name));
		}},
	]
}

const AmericanHealthcare = {
	name: 'AmericanHealthcare',
	color: '#000',

	type: 'play',
	block: Nope,

	effect(g) {
		g.discardPile.push(...g.player.cards);
		g.player.cards = [Vaccine];
	}
}

const Lockdown = {
	name: 'Lockdown',
	color: '#0f0f83',

	type: 'play',
	block: Nope,

	effect(g, d) {
		const target = g.players.find(p => p.name == d.target);
		target.skip++;
	},

	options: [
		{id: 'target', desc: "Player to lock up", get(n, c, p, d) {
			return p.map(p => p.name);
		}},
	]
}

const Handshake = {
	name: 'Handshake',
	color: '#f2cfbc',

	type: 'play',
	block: Nope,

	effect(g, d) {
		const target = g.players.find(p => p.name == d.target);

		if(ArrayUtil.remove(target.cards, Cards[d.otherA])) {
			g.player.cards.push(Cards[d.otherA]);
		} else if(ArrayUtil.remove(target.cards, Cards[d.otherB])) {
			g.player.cards.push(Cards[d.otherB]);
		} else if (ArrayUtil.remove(g.player.cards, Cards[d.self])) {
			target.cards.push(Cards[d.self]);
		}
	},

	options: [
		{id: 'otherA', desc: "First choice to steal", get(n, c, p, d) {
			return Object.values(Cards).filter(c => c.type == 'play').map(c => c.name);
		}},
		{id: 'otherB', desc: "Second choice to steal", get(n, c, p, d) {
			return Object.values(Cards).filter(c => c.type == 'play').map(c => c.name);
		}},
		{id: 'self', desc: "Card to give if requested cards are not available", get(n, c, p, d) {
			return ArrayUtil.unique(c.filter(c => Cards[c].name != 'Handshake'));
		}},
		{id: 'target', desc: "Player to steal from", get(n, c, p, d) {
			return p.filter(p => p.name != n && !p.dead && !p.skip).map(p => p.name);
		}},
	]
}

// ################################
// NONE
// ################################

const InfectedTissue = {
	name: 'InfectedTissue',
	color: '#0077f0',

	type: 'none',
	block: null,
}

// ################################
// DRAW
// ################################

const HealthInspection = {
	name: 'HealthInspection',
	color: '#000',

	type: 'draw',
	block: FakeNews,

	effect(g) {
		const infected = g.players.find(p => p.cards.includes(InfectedTissue));
		if(!infected) return;
		g.discardPile.push(Corona);
		g.onEffect(infected, Corona, {}, true); // TODO: Will this work?

		// TODO: Give corona to infected.
	}
}

const Mutation = {
	name: 'Mutation',
	color: '#000',

	type: 'draw',
	block: FakeNews,

	effect(g) {
		for(const player of g.players) {
			ArrayUtil.remove(player.cards, Vaccine);
			g.discardPile.push(Vaccine);
		}
	}
}

const SuccesfulResearch = {
	name: 'SuccesfulResearch',
	color: '#000',

	type: 'draw',
	block: FakeNews,

	effect(g) {
		for(const player of g.players) {
			player.cards.push(Vaccine);
		}
	}
}

const CoronaParty = {
	name: 'CoronaParty',
	color: '#000',

	type: 'draw',
	block: FakeNews,

	effect(g) {
		for(const player of g.players) {
			if(player == g.player) continue;
			// TODO: Implement
		}
	}
}

const Corona = {
	name: 'Corona',
	color: '#5e7394',

	type: 'draw',
	block: Vaccine,

	effect(g) {
		g.player.dead = true;
	}
}

const Cards = {
	// Block
	Nope, FakeNews, Vaccine,

	// Play
	Sneeze, Skip, Future, Shuffle, Hamster, IllegalPopUpShop, Multiply, AmericanHealthcare, Lockdown, Handshake,

	// None
	InfectedTissue,
	
	// Draw
	HealthInspection, Mutation, SuccesfulResearch, CoronaParty, Corona,
}

module.exports = Cards;
