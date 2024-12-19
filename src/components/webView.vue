<!--
 * @Date: 2024-12-19 15:11:07
 * @Author: guojiecheng
 * @LastEditTime: 2024-12-19 16:52:54
 * @LastEditors: guojiecheng
-->
<template>
    <view class="w-full h-full">
        <web-view :src="src" ref="webview" />
    </view>
</template>
<script setup>

import {
    onLoad
} from '@dcloudio/uni-app'

const src = ref('')

const params = ref({})

const webview = ref()


onLoad((options) => {
    // src.value = options.url
    params.value = JSON.parse(options.params)
}) 
</script>
