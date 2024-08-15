<!--
 * @Date: 2024-08-06 16:28:50
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 16:58:02
 * @LastEditors: guojiecheng
-->
<template>
    <view class="p-2 h100p overflow-auto">
        <view class="shadow shadow-slate-300">
            <view class="p-2">
                <view class="gold text-center">
                    {{ news.title }}
                </view>
                <view class="py-2 flex justify-center text-gray-700">
                    <view class="mr-2">作者：{{ news.author }}</view>
                    <view>发布日期：{{ news.pubtime }}</view>
                </view>
                <view>
                    <rich-text :nodes="news.content"></rich-text>
                </view>
            </view>

        </view>
    </view>
</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app";
import fetch from "@/config/fetch";
import { ref } from "vue";

const news = ref({})

onLoad(async (options) => {
    let { data } = await fetch.tNewsInformationService_findById({ id: options.id })
    news.value = data
})
</script>
<style lang="scss" scoped></style>