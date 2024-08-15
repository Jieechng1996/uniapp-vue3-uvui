<!--
 * @Date: 2
  components: { uvEmpty },
  components: { uvImage },024-07-29 11:37:20
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 10:04:45
 * @LastEditors: guojiecheng
-->
<template>
    <view class="list h100p">
        <scroll-view scroll-y>
            <view class="p-3">
                <view v-for="(item, index) in list" :key="index" class="rounded-xl bg-white text-black mb-3 p-4" @click="() => btnGo()">
                    <view class="mb-2">
                        <uv-image :src="item.imgUrl" width="100%" mode="widthFix"></uv-image>
                    </view>
                    <view class=" font-bold text-center">{{ item.activityRegionName }}</view>
                </view>
            </view>
        </scroll-view>
        <view v-if="list.length === 0" class="pt-10">
            <uv-empty></uv-empty>
        </view>
    </view>

</template>
<script setup>


import { computed, inject, onMounted, ref } from "vue";
import fetch from "../../config/fetch";
import store from "../../store";
import { simpleNavigateTo } from "../../common/util";

const skin = inject('skin')

const userInfo = computed(() => store.state.userInfo)

const list = ref([])

const getList = async () => {
    let { data } = await fetch.ecexActivity_getActivityRegion({})
    list.value = data
}

const btnGo = () => {
    simpleNavigateTo('/pages_business/activity/products')
}

onMounted(() => {
    getList()
})



</script>
<style lang="scss" scoped>
.list {
    background-color: #efefef;
}
</style>