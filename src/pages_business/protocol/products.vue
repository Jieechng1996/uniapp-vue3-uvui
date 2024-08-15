<!--
 * @Date: 2024-07-26 17:00:25
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 17:05:06
 * @LastEditors: guojiecheng
-->
<template>
    <view class="h100p" style="background-color: #efefef;">
        <base-list :url="api.categoryNumberService_getProductInterface" :params="formData" ref="list">
            <template #default="{ list }">
                <view class="p-3">
                    <view v-for="(item, index) in list" :key="index" class="rounded-xl bg-white text-black mb-3" >
                        <product-item :item="item" showCreateProtocol @btnCreateProtocol="btnCreateProtocol" @btnGoDetail="btnGoDetail"></product-item>
                    </view>
                </view>
            </template>
        </base-list>
    </view>
</template>
<script setup>


import { onLoad } from "@dcloudio/uni-app";
import { computed, onMounted } from "vue";
import { toast } from "../../common/message";
import { simpleNavigateTo } from "../../common/util";
import { baseList } from "../../components";
import api from "../../config/api";
import fetch from "../../config/fetch";
import store from "../../store";

import productItem from "../comp/product-item.vue"

const userInfo = computed(() => store.state.userInfo)

const btnCreateProtocol = async ({productId }) => {
    let { msg } = await fetch.ecpExShoppingCart_save({
		productId,
		userId: userInfo.value.userId,
	})
	toast(msg)
    setTimeout(() => {
        simpleNavigateTo('/pages_business/protocol/list', { productId })
    }, 1500);
}

const btnGoDetail = ({ productId }) => {
    simpleNavigateTo('/pages_business/product/detail', { productId } )
}

onLoad((options) => {
})

onMounted(() => {
   
})

</script>
<style lang="scss" scoped></style>