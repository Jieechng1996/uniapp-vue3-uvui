<!--
 * @Date: 2024-07-29 18:16:02
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-05 11:28:53
 * @LastEditors: guojiecheng
-->
<template>
    <view class="warp h100p p-3">
        <view class="rounded-xl bg-white text-black p-4">
            <view>
                <uv-image :src="formData.shortPicUrl" width="100%" height="200" mode="aspectFit"></uv-image>
            </view>
            <view>
                <text class="ion-android-alarm-clock text-xl"></text> 距离活动<text class="red">结束</text>还有
            </view>
            <view class="text-base left-6">
                <text class="red">{{ time.date }}</text>
                <text>天</text>
                <text class="red">{{ time.hour }}</text>
                <text>时</text>
                <text class="red">{{ time.minute }}</text>
                <text>分</text>
                <text class="red">{{ time.second }}</text>
                <text>秒</text>
            </view>
            <view class="text-base font-bold my-2">
                活动规则说明
            </view>
            <view class="rounded p-2 bg-gray-100">
                <uv-empty class="py-5" v-if="formData.remark"></uv-empty>
                <view v-else>{{ formData.remark }}</view>
            </view>
            <view class="mt-3">
                <uv-button :color="skin.primaryColor" @click="simpleNavigateTo('/pages_business/activity/executionDetail', {})">参与活动</uv-button>
            </view>
        </view>
    </view>

</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app"
import fetch from "@/config/fetch"
import { inject, onUnmounted, ref } from "vue"
import dayjs from "dayjs"
import { simpleNavigateTo } from "../../common/util"

const skin = inject("skin")

const formData = ref({})


const time = ref({
    date: '00',
    hour: '00',
    minute: '00',
    second: '00'
})

let timer = null

const getDetail = async () => {

    let { data } = await fetch.ecexActivity_getActivityDetail({})

    formData.value = data[0]

    timer = setInterval(() => {
        let times = dayjs().valueOf() - dayjs(formData.value.endDateActive).valueOf()
        time.value.date = dayjs(times).format('DD')
        time.value.hour = dayjs(times).format('HH')
        time.value.minute = dayjs(times).format('mm')
        time.value.second = dayjs(times).format('ss')
    }, 1000);
}

onUnmounted(() => {
    clearInterval(timer)
})



onLoad(() => {
    getDetail()
})

</script>
<style lang="scss" scoped>
.warp {
    background: #efefef;
}
</style>