<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<svg class="timer" viewBox="-50 -50 100 100">
		<circle :r="radius" :stroke="color" class="outer" />
		<g transform="rotate(-90)">
			<circle :r="radius" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset" class="inner"/>
		</g>
		<text :fill="color" class="text" alignment-baseline="central">{{text}}</text>
	</svg>
</template>

<script>
export default {
	props: {
		text: String,
		color: String,
		time: { type: Number, default: 1 },
		radius: { type: Number, default: 40 }
	},

	computed: {
		dasharray() {
			return 2 * Math.PI * this.radius;
		},

		dashoffset() {
			const length = 2 * Math.PI * this.radius;
			return -length - length * this.time;
		}
	},
}
</script>

<style>
.timer {
	width: 100%;
	height: 100%;
}

.timer .outer {
	fill: none;
	stroke-width: 6px;
}

.timer .inner {
	fill: none;
	stroke: #fff;
	stroke-width: 3px;
	stroke-linecap: round;
	transition: stroke-dashoffset 1s;
}

.timer .text {
	font-size: 24px;
	font-weight: 600;
	text-anchor: middle;
}
</style>
