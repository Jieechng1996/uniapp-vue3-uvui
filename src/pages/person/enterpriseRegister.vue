<!--
 * @Date: 2024-07-19 10:36:59
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-23 15:27:23
 * @LastEditors: guojiecheng
-->
<template>
    <view class="px-5 py-2">
        <base-form :legend="[
            { label: '公司名称：', key: 'customerName', required: true, props: { border: 'surround' } },
            { label: '注册地址', key: 'addressPrefix', required: true, type: 'region' },
            { label: ' ', key: 'addressSuffix', placeholder: '请输入详细地址', props: { border: 'surround' } },
            { label: '法人代表', key: 'legalRepresentative', required: true },
            { label: '公司电话', key: 'companyPhone', type: 'phone', required: true },
            { label: '联系人姓名', key: 'contactPeople', required: true },
            { label: '联系人电话', key: 'contractNumber', type: 'phone', required: true },
            { label: '社会信用代码/税务登记号', key: 'commerceRegNo', placeholder: '社会信用代码或税务登记号(二选一)', required: true, rules: commerceRegNoRules },
            { label: '开户行名称', key: 'bank', required: true },
            { label: '银行账号', key: 'bankAccount', required: true },
            { label: '收货地点', key: 'shopTo' },
            { label: '收单地点', key: 'billTo' },
        ]" v-model="formData" ref="companyForm" :form-props="{ labelWidth: 110 }"></base-form>

        <view class="mt-3">
            <uv-button type="primary" color="#cc3e3e" @click="() => btnSubmitMessage()">提交信息</uv-button>
        </view>
        <uv-modal ref="modal" title="提示" @confirm="() => btnGoPersonCenter()">
            <view class="slot-content">
                <view class="text-center mb-1">恭喜，您的企业信息已经提交成功!</view>
                <view class="text-center mb-1">请耐心等待富海内部审核!</view>
                <view class="text-center">为方便更快速的审核请联系<text class="red" @click="() => btnCallNumber('4000546718')">4000546718</text>,谢谢!</view>
			</view>
        </uv-modal>
    </view>
</template>
<script setup>
import { ref } from "vue";
import { baseForm, baseRegions } from "../../components";
import { error, success, toast } from "../../common/message";
import fetch from "../../config/fetch";

const companyForm = ref()

const formData = ref({
    customerName: ''
})

const modal = ref()


const btnSubmitMessage = async () => {
    await companyForm.value.validate().catch(e => {
        error(e[0].message)
            ; return Promise.reject(e)
    })
    let { data, msg } = await fetch.ecexCustomer_save({
        ...formData.value
    })

    modal.value.open()

    setTimeout(() => {
        modal.value.close()
        btnGoPersonCenter()
    },2000)
    
}

const btnCallNumber = (phoneNumber) => uni.makePhoneCall({
    phoneNumber
})

const btnGoPersonCenter = () => {
    uni.switchTab({
        url: '/pages/person/center'
    })
}

</script>
<style lang="scss" scoped></style>