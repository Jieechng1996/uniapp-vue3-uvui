<template>
    <view class="h100p" style="background-color: #efefef;">
        <base-list :url="api.activity_mall_findPagination" ref="products" @onLoad="dataOnLoad">
            <template #default>
                <view class="p-3">
                    <view v-for="(item, index) in list" :key="index" class="rounded-xl bg-white text-black mb-3">
                        <view class="p-2 leading-6" style="color: #bf8500">
                            <view class="text-base">{{ item.productItemName }}</view>
                            <view>
                                <text>活动状态：</text><text class="red">{{ item.statusText }}</text>
                            </view>
                            <view>
                                <text>开始时间：</text><text class="text-gray-800">{{ item.startDateActive }}</text>
                            </view>
                            <view>
                                <text>结束时间：</text><text class="text-gray-800">{{ item.endDateActive }}</text>
                            </view>
                            <view>
                                <text>提货厂区：</text><text class="text-gray-800">{{ item.productArea }}</text>
                            </view>
                            <view class="flex justify-end">
                                <uv-button plain :color="skin.primaryColor" size="small"
                                    :disabled="item.statusText !== '进行中'" @click="btnJoinBidding">参与竞价</uv-button>
                            </view>
                        </view>

                    </view>
                </view>
            </template>
        </base-list>
        <uv-modal ref="modal" title="提示" :confirmColor="skin.primaryColor" showCancelButton cancelText="不用了谢谢"
            confirmText="购买推荐产品" @confirm="() => simpleNavigateTo('/pages_business/product/recommonds')"
            @cancel="() => simpleNavigateTo('/pages_business/activity/activityDetail')">
            <view class="text-base text-gray-900">
                你有推荐购买的产品，是否购买?
            </view>
        </uv-modal>
    </view>
</template>
<script setup>


import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { computed, inject, onMounted, ref, toRaw } from "vue";
import { toast } from "../../common/message";
import { simpleNavigateTo } from "../../common/util";
import { baseList } from "../../components";
import api from "../../config/api";
import store from "../../store";

import productItem from "../comp/product-item.vue"

const skin = inject('skin')

const userInfo = computed(() => store.state.userInfo)

const list = ref([])

const dataOnLoad = (array) => {
    console.log(toRaw(array))

    let currentTime = dayjs().valueOf()
    list.value = toRaw(array).map(item => {
        item.statusText = dayjs(item.startDateActive).valueOf() > currentTime ? '未开始' : (dayjs(item.endDateActive).valueOf() < currentTime ? '已结束' : '进行中')
        return item
    })
}

const modal = ref()

const btnJoinBidding = () => {
    modal.value.open()
}

onMounted(() => {


})

</script>
<style lang="scss" scoped></style>