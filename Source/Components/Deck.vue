<!-- Copyright (c) 2020 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<swiper :options="swiperOptions" class="swiper">
		<swiper-slide v-for="(card, i) in cards" :key="card.name + i">
			<Card :card="card"/>
		</swiper-slide>

		<div class="swiper-button-prev" slot="button-prev"></div>
		<div class="swiper-button-next" slot="button-next"></div>
	</swiper>
</template>

<script>
import Card from './Card.vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
	components: {
		Card, Swiper, SwiperSlide
	},

	props: {
		cards: Array
	},

	data() {
		let self = this;

		return {
			swiperOptions: {
				keyboard: true,
				centeredSlides: true,
				slidesPerView: 'auto',
				effect: 'coverflow',
				coverflowEffect: {
					rotate: 16,
					stretch: 15,
					depth: 100,
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				on: {
					slideChange() {
						self.$emit('change', this.realIndex);
					}
				}
			}
		}
	}
}
</script>

<style>
.swiper {
	width: 100%;
	padding: 20px 0;
}

.swiper-slide {
	width: initial;
	height: initial;
}

.swiper-slide-shadow-left {
	border-radius: 10px;
}

.swiper-slide-shadow-right {
	border-radius: 10px;
}
</style>
