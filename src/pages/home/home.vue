<!--
 * @Date: 2024-07-04 10:31:06
 * @Author: guojiecheng
 * @LastEditTime: 2024-12-19 16:57:36
 * @LastEditors: guojiecheng
-->
<template>
	<view class="flex justify-center items-center p-5"> welcome </view>
</template>

<script setup>
import { onMounted } from "vue";
import { webViewNavigateTo } from "@/common/appWebView.js";

onMounted(() => {
	webViewNavigateTo("http://192.168.92.56:8016/mobmall/", { id: 1 });
});
</script>
<style scoped></style>
