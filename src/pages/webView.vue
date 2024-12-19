<!--
 * @Date: 2024-12-19 15:11:07
 * @Author: guojiecheng
 * @LastEditTime: 2024-12-19 16:58:50
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

import {
    onMounted,
    ref
} from 'vue'

const src = ref('')

const params = ref({})

const webview = ref()

onMounted(() => {
    console.log(webview.value.evalJS)
})

onLoad((options) => {
     src.value =  JSON.parse(options.path)
    params.value = JSON.parse(options.params)
}) 
</script>
