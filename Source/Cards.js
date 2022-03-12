// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const { ArrayUtil } = require('./Utility.js');

const ECardType = {
	Action: 'action', // TODO: Rename string
	Event:  'event', // TODO: Rename string
	Block:  'block',
	None:   'none',
}

const EBlockType = {
	Everyone: 'everyone',
	Others:   'others',
	Self:     'self',
}

const canBlock = (player, target, card) => {
	return card.block && (
		(card.blockType == EBlockType.Everyone) ||
		(card.blockType == EBlockType.Others && player != target) ||
		(card.blockType == EBlockType.Self && player == target)
	);
}

// ################################
// BLOCK
// ################################

const Nope = {
	name: 'Nope',
	color: '#000',

	type: ECardType.Block,
	block: null,
	exclusive: false, // blockType: EBlockType.Others

	timer: { text: 'NOPE', color: '#ff0000' },
}

Nope.block = Nope;

const FakeNews = {
	name: 'FakeNews',
	color: '#000',

	type: ECardType.Block,
	block: Nope,
	exclusive: false, // blockType: EBlockType.Everyone

	timer: { text: 'FAKE', color: '#ff8c00' },
}

const Vaccine = {
	name: 'Vaccine',
	color: '#14d200',

	type: ECardType.Block,
	block: null,
	exclusive: true, // blockType: EBlockType.Self

	timer: { text: 'HEAL', color: '#9acd32' },
}

// ################################
// PLAY
// ################################

const Sneeze = {
	name: 'Sneeze',
	color: '#f2ff87',

	type: ECardType.Action,
	block: Nope,

	effect(g) {
		g.drawCount++;
		g.next();
	}
}

const Skip = {
	name: 'Skip',
	color: '#000',

	type: ECardType.Action,
	block: Nope,

	effect(g) {
		g.drawCount--;
	}
}

const Future = {
	name: 'Future',
	color: '#000',

	type: ECardType.Action,
	block: Nope,

	effect(g) {
		const future = g.drawPile.slice(-3).map(c => c.name);
		g.io.to(g.player.id).emit('game.status', {status: 'future', future: future});
	}
}

const Shuffle = {
	name: 'Shuffle',
	color: '#000',

	type: ECardType.Action,
	block: Nope,

	effect(g) {
		ArrayUtil.shuffle(g.drawPile);
	}
}

const Hamster = {
	name: 'Hamster',
	color: '#ff9900',

	type: ECardType.Action,
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

	type: ECardType.Action,
	block: Nope,

	effect(g, d) {
		ArrayUtil.remove(g.player.cards, Cards[d.give]);
		g.player.cards.push(Cards[d.take]);
	},

	options: {
		give: (n, c, p, d) => {
			return ArrayUtil.unique(c.filter(c => Cards[c].name != 'IllegalPopUpShop'));
		},
		take: (n, c, p, d) => {
			return d;
		}
	}
}

const Multiply = {
	name: 'Multiply',
	color: '#2c8edf',

	type: ECardType.Action,
	block: Nope,

	effect(g, d) {
		g.player.cards.push(Cards[d.copy]);
	},

	options: {
		copy: (n, c, p, d) => {
			return ArrayUtil.unique(c.filter(c => Cards[c].type == ECardType.Action).map(c => Cards[c].name));
		}
	}
}

const AmericanHealthcare = {
	name: 'AmericanHealthcare',
	color: '#000',

	type: ECardType.Action,
	block: Nope,

	effect(g) {
		g.discardPile.push(...g.player.cards);
		g.player.cards = [Vaccine];
	}
}

const Lockdown = {
	name: 'Lockdown',
	color: '#0f0f83',

	type: ECardType.Action,
	block: Nope,

	effect(g, d) {
		const target = g.players.find(p => p.name == d.target);
		target.skip++;
	},

	options: {
		target: (n, c, p, d) => {
			return p.map(p => p.name);
		}
	}
}

const Handshake = {
	name: 'Handshake',
	color: '#f2cfbc',

	type: ECardType.Action,
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

	options: {
		otherA: (n, c, p, d) => {
			return Object.values(Cards).filter(c => c.type == ECardType.Action).map(c => c.name);
		},
		otherB: (n, c, p, d) => {
			return Object.values(Cards).filter(c => c.type == ECardType.Action).map(c => c.name);
		},
		self: (n, c, p, d) => {
			return ArrayUtil.unique(c.filter(c => Cards[c].name != 'Handshake')); // TODO: Use hard reference instead of 'Handshake' string
		},
		target: (n, c, p, d) => {
			return p.filter(p => p.name != n && !p.dead && !p.skip).map(p => p.name);
		}
	}
}

// ################################
// NONE
// ################################

const InfectedTissue = {
	name: 'InfectedTissue',
	color: '#0077f0',

	type: ECardType.None,
	block: null,
}

// ################################
// DRAW
// ################################

const HealthInspection = {
	name: 'HealthInspection',
	color: '#000',

	type: ECardType.Event,
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

	type: ECardType.Event,
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

	type: ECardType.Event,
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

	type: ECardType.Event,
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

	type: ECardType.Event,
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
	// Draw
	HealthInspection, Mutation, SuccesfulResearch, CoronaParty, Corona,
	// None
	InfectedTissue,
}

module.exports = { ECardType, Cards };
