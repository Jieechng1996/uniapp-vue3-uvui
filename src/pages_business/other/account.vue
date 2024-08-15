<template>
    <view>
        <view class="font-bold py-2 px-4" style="background: #e4e4e4;"> 资金信息</view>
        <uv-tabs :list="[
            { name: '华联', status: 'EFFECT' },
            { name: '联合', status: 'MAKING' },
            { name: '富海化学', status: 'APPROVED' },
            { name: '海旺', status: 'CLOSED' },
            { name: '富地', status: 'CLOSED' }
        ]" lineColor="#e42112" itemStyle="padding-left: 20px; padding-right: 20px; height: 44px;"></uv-tabs>
        <view class="py-2 px-4 leading-6">
            <view>客户余额：{{ balanceData.balance }}</view>
            <view>信用额度：{{ balanceData.credit }}</view>
        </view>
        <view class="font-bold py-2 px-4" style="background: #e4e4e4;"> 交易记录</view>
        <view class="list">
            <base-list :url="api.ecExCustomerBalance_findOrderDetail" :params="formData" ref="list">
                <template #default="{ list }">
                    <view class="p-3 box">
                        <view v-for="(item, index) in list" :key="index" class=" bg-white text-black border-b border-solid border-gray-300 pb-2 mb-2 ">
                            <view class="flex justify-between items-center">
                                <view class="font-bold text-base">{{ item.orderCode }}</view>
                            </view>
                            <view class="leading-6">订单类型：{{ item.businessTypeText }}</view>
                            <view class="leading-6">车牌号码：{{ item.licensePlateNumber }}</view>
                            <view class="leading-6">订单日期：{{ item.orderDate }}</view>
                            <view class="leading-6">产品名称：{{ item.productName }}</view>
                        </view>
                    </view>
                </template>
            </base-list>
        </view>
    </view>
</template>
<script setup>
import fetch from '@/config/fetch'
import { onMounted, ref } from 'vue'
import api from '@/config/api'
import { baseList } from '../../components'
const balanceData = ref({})
const getDetail = async ({ companyId }) => {
    let { data } = await fetch.ecExCustomerBalance_findBalanceByCompanyId({
        companyId
    })

    console.log(data)

    for (let i in data) {
        balanceData.value[i] = data[i]
    }

}

onMounted(() => {
    getDetail({})
})

</script>
<style lang="scss" scoped>
.list {
    height: calc( 100% - 192px );
}
</style>