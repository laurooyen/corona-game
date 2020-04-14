// Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

module.exports = class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name;

		this.cards = [];

		this.dead = false;
		this.skip = 0;
	}

	available() {
		return !dead && !skip;
	}
}
