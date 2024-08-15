<!--
 * @Date: 2024-07-25 15:22:35
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 15:28:49
 * @LastEditors: guojiecheng
-->
<template>
    <web-view :src="src" />
</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
const src = ref('')
onLoad((options) => {
    src.value = options.src
    uni.setNavigationBarTitle = options.title || '网页跳转'
})
</script>
<style lang="scss" scoped>

</style>