<!--
 * @Date: 2024-07-12 10:45:02
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 17:28:03
 * @LastEditors: guojiecheng
-->
<template>
    <view class="w100p bg-white p-3">
        <view class="flex header">
            <view>
                {{ userInfo.userName }}
            </view>
            <view>
                {{ currentDate }}
            </view>
        </view>
        <view class="flex items-center justify-center">
            <view class="btn flex items-center justify-center mt-16" @click="btnGotoDetail">
                <view class="text text-center">
                    <view class="text-4xl">打卡</view>
                    <view class="mt-3">{{ currentTime }}</view>
                </view>
            </view>
        </view>
        <view class="flex items-center justify-center mt-3">
            <uv-icon color="red" size="24" name="empty-address"  v-if="currentAddress"></uv-icon>
            <uv-loading-icon color="red" size="20" v-else></uv-loading-icon>
            <view class="text-sm">{{ currentAddress || '获取定位中...' }}</view>
        </view>

    </view>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import dayjs from "dayjs";
import store from "../../store";
import { onLoad } from "@dcloudio/uni-app";
import { getCurrentLocationByBmap } from '@/common/map'

const userInfo = computed(() => store.state.userInfo)

const currentDate = ref(dayjs().format('YYYY-MM-DD'))

const currentTime = ref(dayjs().format('HH:mm:ss'))

const timer = setInterval(() => {
    currentDate.value = dayjs().format('YYYY-MM-DD')
    currentTime.value = dayjs().format('HH:mm:ss')
}, 1000);

const currentAddress = ref('')

const btnGotoDetail = () => {
    uni.navigateTo({ url: '/pages/attendance/detail' })
}

onLoad(() => {
})

onMounted(async () => {
    let { content : { address , poi_desc } } = await getCurrentLocationByBmap()
    currentAddress.value = poi_desc ||  address
})

onBeforeUnmount(() => {
    clearInterval(timer)
})

</script>

<style lang="scss" scoped>
.header {
    justify-content: space-between;
    line-height: 32px;
    color: #2C3E50;
    background: #fbfbfb;
}

.btn {
    width: 60vw;
    height: 60vw;
    color: #fff;
    background: #5ac6f1;
    border-radius: 50%;
}
</style>