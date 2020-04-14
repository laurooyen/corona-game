<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<div class="card" :class="{disabled}">
		<div class="border" :style="{ borderColor: card.color }">
			<p class="title">{{ $t(`cards.${card.name}.title`) }}</p>
			<div>
				<img :src="require(`@/Assets/Images/${card.name}.svg`).default">
			</div>
			<p class="desc">{{ $t(`cards.${card.name}.desc`) }}</p>
		</div>
		<slot/>
	</div>
</template>

<script>
export default {
	props: {
		card: Object,
		disabled: Boolean,
	},
}
</script>

<style>
.card {
	width: 200px;
	height: 280px;
	border-radius: 10px;
	background: white;
	box-shadow: 3px 3px 7px rgba(0,0,0,0.4);
	padding: 5px;
	text-align: center;
	line-height: 1;
	position: relative;
	transition: all ease 0.5s;
}

.card .overlay {
	border-radius: 10px;
}

.card .border {
	width: 100%;
	height: 100%;
	border: 2px solid black;
	border-radius: 8px;
	padding: 5px;
	display: flex;
	flex-direction: column;
}

.card .title {
	color: black;
	font-weight: bold;
	font-stretch: condensed;
	text-transform: uppercase;
}

.card .desc {
	color: #888;
	font-size: 11px;
}

.card .border div {
	width: 100%;
	height: 100%;
}

.card .border img {
	width: 100%;
	height: 100%;
}
</style>
