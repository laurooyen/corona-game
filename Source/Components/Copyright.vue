<!-- Copyright (c) 2020-2022 Lauro Oyen, Corona Game contributors. All rights reserved. -->
<!-- Licensed under the MIT license. See LICENSE.md for full terms. This notice is not to be removed. -->

<template>
	<footer class="copyright">
		Copyright © {{year}} <a href="https://github.com/laurooyen" target="_blank">Lauro Oyen</a>. All rights reserved.
	</footer>
</template>

<script>
export default {
	computed: {
		year() {
			return new Date().getFullYear();
		}
	}
}
</script>

<style>
.copyright {
	left: 6px;
	right: 6px;
	bottom: 6px;
	position: fixed;
	
	font-size: 11px;
	text-align: center;
	
	z-index: 10;
	color: #fff8;
	text-shadow: 0 0 8px black;
}
</style>
