<!-- Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="overlay" style="overflow-y: auto">
		<div class="manual">

			<h1>{{ $t('rules.title') }}</h1>
			<p>{{ $t('rules.desc') }}</p>

			<h2>{{ $t('rules.begin.title') }}</h2>
			<p>{{ $t('rules.begin.desc') }}</p>

			<h2>{{ $t('rules.turns.title') }}</h2>
			<p>{{ $t('rules.turns.desc') }}</p>

			<h2>{{ $t('rules.end.title') }}</h2>
			<p>{{ $t('rules.end.desc') }}</p>
		
			<template v-for="type in types">

				<h2 :key="`${type}-title`">{{ $t(`rules.card-types.${type}.title`) }}</h2>
				<p :key="`${type}-desc`">{{ $t(`rules.card-types.${type}.desc`) }}</p>

				<div :key="card" v-for="card in cards(type)" class="content">
					<img :key="`${card}-img`" :src="require(`@/Assets/Images/${card}.svg`).default">
					<div>
						<h3 :key="`${card}-title`">{{ $t(`cards.${card}.title`) }}</h3>
						<p :key="`${card}-desc`">{{ $t(`cards.${card}.desc`) }}</p>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import { ECardType, Cards } from '../cards.js'

export default {
	computed: {
		types() {
			return Object.values(ECardType);
		},
	},

	methods: {
		cards(type) {
			return Object.values(Cards).filter(c => c.type == type).map(c => c.name);
		}
	}
}
</script>

<style>

.manual {
	margin: 50px auto;
	max-width: 500px;
	padding: 0 20px;
	text-align: justify;
	text-shadow: 0 0 8px black;
}

.manual .content {
	display: flex;
	align-items: center;
	text-align: left;
	margin: 20px 0;
}

.manual .content img {
    margin-right: 20px;
	float: left;
	width: 80px;
	height: 80px;
	background: white;
	border-radius: 10px;
	flex-shrink: 0;
}

.manual p {
	text-align: center;
}

.manual .content p {
	font-size: 0.8em;
	text-align: left;
}

.manual h3 {
	text-align: left;
}

.manual h2 {
	color: #00b0f0;
	margin-top: 16px;
}

</style>
