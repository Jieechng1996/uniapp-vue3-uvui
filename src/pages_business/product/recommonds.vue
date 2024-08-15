<!--
 * @Date: 2024-07-26 14:03:01
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 14:31:30
 * @LastEditors: guojiecheng
-->
<template>
    <view class="text-base py-2 px-4" :style="{ color: skin.primaryColor }">
        根据您的浏览记录，推荐您购买以下产品：
    </view>
    <view class="list">
        <scroll-view scroll-y>
        <view class="h100p" style="background-color: #efefef;">
        <base-list :url="api.categoryNumberService_getProductInterface" :params="formData" ref="list">
            <template #default="{ list }">
                <view class="p-3">
                    <view v-for="(item, index) in list" :key="index" class="rounded-xl bg-white text-black mb-3" >
                        <product-item :item="item" showByNow @btnByNow="simpleNavigateTo('/pages_business/order/create')" ></product-item>
                    </view>
                </view>
            </template>
        </base-list>
    </view>
    </scroll-view>
    </view>
   
   
</template>
<script setup>


import { onLoad } from "@dcloudio/uni-app";
import { computed, inject, onMounted } from "vue";
import { toast } from "../../common/message";
import { simpleNavigateTo } from "../../common/util";
import { baseList } from "../../components";
import api from "../../config/api";
import fetch from "../../config/fetch";
import store from "../../store";
import productItem from "../comp/product-item.vue"
const skin = inject('skin')

const userInfo = computed(() => store.state.userInfo)


onLoad((options) => {
})

onMounted(() => {
   
})

</script>
<style lang="scss" scoped>
.list{
    height: calc(100% - 44px);
}
</style>