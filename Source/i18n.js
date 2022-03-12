// Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed.

import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

function load() {
	import(`@/Locales/${lang}.json`).then(msg => {
		VueI18n.setLocaleMessage(lang, msg.default || msg);
		VueI18n.locale = lang;
	});
}

import english from './Locales/en.json'
import dutch from './Locales/nl.json'

export default new VueI18n({
	locale: navigator.language.split(/-|_/)[0],
	fallbackLocale: 'en',
	messages: {en: english, nl: dutch}
});

export const supportedLocales = {
	en: 'English',
	nl: 'Nederlands',
}
