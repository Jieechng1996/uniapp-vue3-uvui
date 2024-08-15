<!--
 * @Date: 2024-07-25 11:12:45
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 11:23:15
 * @LastEditors: guojiecheng
-->
<template>
    <view class="list h100p">
        <base-list :url="api.ecexCollectionDetails_findPagination" :params="formData" ref="list">
                <template #default="{ list }">
                    <view class="p-3">
                        <view v-for="(item, index) in list" :key="index" class="rounded-xl bg-white text-black border-b border-solid border-gray-300 pb-2 mb-2 py-2 px-4 ">
                            <view class="leading-6">客户：{{ item.customerName }}</view>
                            <view class="leading-6">开票单位：{{ item.orgName }}</view>
                            <view class="leading-6">单据编号：{{ item.orderCode }}</view>
                            <view class="leading-6">单据类型：{{ item.businesstypeText }}</view>
                            <view class="leading-6">提交时间：{{ item.commitDate }}</view>
                            <view class="leading-6">截止时间：{{ item.orderDate }}</view>
                            <view class="leading-6">占款金额：{{ item.amount }}</view>
                            <view class="leading-6">占款总金额：{{ item.sumOrderAmount }}</view>
                        </view>
                    </view>
                </template>
            </base-list>
    </view>
</template>
<script setup>
import { baseForm ,baseList} from "../../components";
import api from "../../config/api";
</script>
<style lang="scss" scoped>
.list {
    background: #efefef;
}

.item {
    border-radius: 10px;
}

</style>