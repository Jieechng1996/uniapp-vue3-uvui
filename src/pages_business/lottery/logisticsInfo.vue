<!--
 * @Date: 2024-08-12 15:46:33
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-12 16:25:32
 * @LastEditors: guojiecheng
-->
<template>
    <view class="px-3">
        <base-form :legend="[
            { label: '奖品名称：', key: 'prizeName', type: 'text' },
            { label: '快递公司：', key: 'shippingCompany', type: 'text' },
            { label: '快递单号：', key: 'shippingNo', type: 'text' },
            { label: '收货联系人：', key: 'shippingPeople', required: true },
            { label: '收货联系电话：', key: 'shippingPhone' , required: true , type: 'phone'},
            { label: '收货地址：', key: 'shippingAddress', required: true },
        ]" v-model="formData" ref="form" :form-props="{ labelWidth: 120 }"></base-form>
        <view class="mt-3">
            <uv-button type="primary" :color="skin.primaryColor" @click="btnSave()">确认</uv-button>
        </view>
    </view>
    
</template>
<script setup>
import { baseForm } from '@/components'
import { inject, ref } from 'vue'
import fetch from '@/config/fetch'
import { toast } from '../../common/message'
const skin = inject('skin')
const formData = ref({
    shippingPeople: ''
})
const form = ref()
const getDetail = async () => {
         
}
const btnSave = async () => {
    await form.value.validate().catch(e => {
        toast(e[0].message)
            ; return Promise.reject(e)
    })

    let { msg } = await fetch.fillShippingInfo({
        ...formData.value
    })

    toast(msg)

    setTimeout(() => {
        uni.navigateBack()
    }, 1500);

    
}
</script>
<style lang="scss" scoped>

</style>

