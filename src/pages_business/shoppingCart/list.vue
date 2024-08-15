<!--
 * @Date: 2024-07-26 15:37:14
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 16:53:06
 * @LastEditors: guojiecheng
-->
<template>
    <view class="box" style="background-color: #efefef;">
        <base-list :url="api.categoryNumberService_getProductInterface" v-model="list">
            <template #default>
                <view class="p-3">
                    <view v-for="(item, index) in list" :key="index" class="rounded-xl bg-white text-black mb-3" >
                        <product-item :item="item" shoppingCart @changeChecked="() => item.checked = !item.checked" @btnGoDetail="() => item.checked = !item.checked"></product-item>
                    </view>
                </view>
            </template>
        </base-list>
    </view>
    <view class="flex justify-between items-center px-4 py-2 border-b border-solid border-gray-200">
        <view class="flex items-center" @click="() => btnSelectAll()">
            <checkbox :checked="checkAll" disabled/>
            <text>全选</text>
        </view>
       
        <uv-button :color="skin.primaryColor" size="small" @click="() => btnCreate()">生成订单</uv-button>
    </view>
</template>
<script setup>


import { onLoad } from "@dcloudio/uni-app";
import { computed, inject, onMounted, ref } from "vue";
import { toast , warning} from "../../common/message";
import { simpleNavigateTo } from "../../common/util";
import { baseList } from "../../components";
import api from "../../config/api";
import fetch from "../../config/fetch";
import store from "../../store";

import productItem from "../comp/product-item.vue"

const skin = inject('skin')

const userInfo = computed(() => store.state.userInfo)

const list = ref([])

const checkAll = ref(false)

const btnSelectAll = () => {
    checkAll.value = !checkAll.value
    list.value.forEach(item => {
        item.checked = checkAll.value
    })
}

const btnCreate = () => {
    let arr = list.value.filter(item => item.checked)
    if(arr.length == 0){
        warning('请至少选择一条数据')
        return
    }
    simpleNavigateTo('/pages_business/order/create')
}

</script>
<style lang="scss" scoped>
.box{
    height: calc(100% - 48px);
}
:deep(.uni-checkbox-input-disabled) {
    background: #fff !important;

    svg path {
        color: #007aff;
        fill: #007aff
    }
}
</style>