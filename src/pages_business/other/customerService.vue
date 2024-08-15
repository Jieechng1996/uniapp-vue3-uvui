<!--
 * @Date: 2
  components: { uvButton },024-07-25 14:17:56
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 15:29:10
 * @LastEditors: guojiecheng
-->
<template>
    <view class="p-3 leading-8">
        <view class="border-b border-solid border-gray-300 p-1 flex justify-between items-center">
            <view>
                <text>客服电话：</text><text @click="btnCallNumber('400-0546-718')"
                    class="text-red-600 font-bold">400-0546-718</text>
            </view>
            <view>
                <uv-button color="rgb(220 38 38)" size="small" plain
                    @click="btnCallNumber('400-0546-718')">点击拨打</uv-button>
            </view>
        </view>
        <view class="border-b border-solid border-gray-300 p-1 flex justify-between items-center">
            <view>
                <text>客服QQ：</text><text @click="btnOpenQQ(13232467)" class="text-green-600 font-bold">13232467</text>
            </view>
            <view>
                <uv-button color="rgb(22 163 74)" size="small" plain @click="btnOpenQQ(13232467)">
                    <!-- #ifdef APP -->
                    点击跳转QQ
                    <!-- #endif -->
                    <!-- #ifndef APP -->
                    点击复制
                    <!-- #endif -->
                </uv-button>
            </view>
        </view>
        <view class="border-b border-solid border-gray-300 p-1">
            <view>
                <text>在线咨询：</text><text class="text-blue-600 font-bold" @click="btnOpenWeb">点击跳转</text>
            </view>
        </view>
    </view>
</template>
<script setup>

import { toast } from "@/common/message";
import { inject } from "vue";
import { simpleNavigateTo } from "@/common/util";

const skin = inject('skin')
const btnCallNumber = (phoneNumber) => uni.makePhoneCall({
    phoneNumber
})

const btnOpenQQ = (number) => {
    // #ifdef APP
    plus.runtime.openURL('mqqwpa://im/chat?chat_type=wpa&uin=' + number, function (res) {
        plus.nativeUI.alert("本机没有安装QQ，无法启动");
    });
    // #endif

    // #ifndef APP
    uni.setClipboardData({
        data: number,
        success: () => {
            toast('已复制QQ号')
        }
    })
    // #endif
}

const btnOpenWeb = () => {
    simpleNavigateTo('/pages_business/web/webView', { src: 'http://q.url.cn/cdTHsH?_type=wpa&qidian=true' , title: '客服咨询' })
}
</script>
<style lang="scss" scoped></style>