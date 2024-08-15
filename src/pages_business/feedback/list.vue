<!--
 * @Date: 2024-08-06 14:07:23
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-06 15:10:17
 * @LastEditors: guojiecheng
-->
<template>
    <view class="h100p">
        <uv-navbar title="客户反馈" :fixed="false" @leftClick="leftClick" :bgColor="skin.primaryColor"
            leftIconColor="#fff" rightIcon="plus-circle" @rightClick="() =>  simpleNavigateTo('/pages_business/feedback/detail')">
            <template v-slot:right>
                <uv-icon size="20" name="plus-circle" color="#fff"></uv-icon>
            </template>
        </uv-navbar>
        <view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
        <view class="bg-gray-100 list">
            <base-list :url="api.ecpInCustomerServe_findPagination" :params="formData" ref="list">
                <template #default="{ list }">
                    <view class="p-3 ">
                        <view v-for="(item, index) in list" :key="index"
                            class="item bg-white text-black mb-3 rounded-lg" @click="simpleNavigateTo('/pages_business/feedback/detail',{ id : item.id })">
                            <view class="gold text-sm">{{ item.title }}</view>
                            <view class="text-gray-500 text-xs">{{ item.creationDate }}</view>
                        </view>
                    </view>
                </template>
            </base-list>
        </view>
    </view>


</template>
<script setup>
import { inject } from "vue";
import { simpleNavigateTo } from "../../common/util";
import { baseList } from "../../components";
import api from "../../config/api";

const skin = inject("skin");

const leftClick = () => {
    uni.navigateBack();
}

const rightClick = () => {
    simpleNavigateTo('/pages_business/feedback/detail')
}


</script>
<style lang="scss" scoped>
.list {
    height: calc(100% - var(--status-bar-height) - 44px);
}

.status_bar {
    height: var(--status-bar-height);
    width: 100%;
}
:deep(.uv-navbar__content__title){
    color: #fff;
}
:deep(.uv-icon__icon){
    color: #fff;
}
</style>