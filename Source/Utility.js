// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

const Util = {

	inRange(x, min, max) { // TODO: Deprecated
		return ((x - min) * (x - max) <= 0);
	},

	isAlphaNumeric(string) { // TODO: Deprecated
		return string.match(/^[0-9a-zA-Z]+$/);
	},

	escape(string) {
		const tags = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
		}

		return string.replace(/[&<>]/g, tag => {
			return tags[tag] || tag;
		});
	},

	gameID(length = 4) {
		let id = '';
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		for(let i = 0; i < length; i++) {
			id += chars[Math.floor(Math.random() * chars.length)];
		}

		return id;
	},

}

const ArrayUtil = {

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	},

	last(array, index = 0) {
		return array[array.length - index - 1];
	},

	repeat(value, length) {
		return new Array(length).fill(value);
	},

	random(array, element = null) {
		const index = Math.floor(Math.random() * array.length);
		return element ? array.splice(index, 0, element) : array[index];
	},

	remove(array, element) {
		const index = array.indexOf(element);
		if(index < 0) return undefined;
		return array.splice(index, 1)[0];
	},

	unique(array) {
		return [...new Set(array)];
	},

	removeOne(array, callback) {
		const index = array.findIndex(callback);
		if(index < 0) return undefined;
		return array.splice(index, 1)[0];
	},

	removeAll(array, callback) {
		let removed = [];
		let i = array.length;

		while (i--) {
			if (callback(array[i], i, array)) {
				removed.push(array[i]);
				array.splice(i, 1);
			}
		}

		return removed;
	}

}

module.exports = { Util, ArrayUtil };

/*
function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

Array.prototype.remove = function(element) {
	const index = this.indexOf(element);
	if(index < 0) return null;
	return array.splice(index, 1)[0];
}
*/