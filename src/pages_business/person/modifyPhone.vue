<!--
 * @Date: 2024-07-19 16:33:46
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-16 11:41:40
 * @LastEditors: guojiecheng
-->
<template>
    <view class="px-4">
        <base-form :legend="[
            { label: '手机号', key: 'mobilePhone', type: 'slot', required: true },
            { label: '短信验证', key: 'verificationCode', required: true, props: { type: 'number' } },
        ]" v-model="formData" ref="form" :form-props="{ labelWidth: 110 }" :rules="rules">
            <template #mobilePhone>
                <uv-input v-model="formData.mobilePhone" placeholder="请输入手机号码" type="number">
                    <template #suffix>
                        <uv-button size="small" type="primary" @click="() => getVerificationCode()"
                            :disabled="!formData.mobilePhone && !!countDown" :color="skin.primaryColor">{{ countDown ?
            `请在${countDown}s后再获取` : '获取验证码' }}</uv-button>
                    </template>
                </uv-input>
            </template>
        </base-form>

        <view class="mt-3">
            <uv-button type="primary" :color="skin.primaryColor" @click="() => btnSubmit()">提交</uv-button>
        </view>
    </view>

</template>
<script setup>
import { inject, ref } from "vue";
import { baseForm } from "../../components";
import { phoneNumber, password } from '@/lib/regexp'
import { toast, warning } from "../../common/message";
import fetch from "../../config/fetch";

const skin = inject('skin')

const formData = ref({})


const rules = ref({
    mobilePhone: [
        {
            validator: (rule, value, callback) => !(value && !phoneNumber.test(value)), message: '手机号格式错误', trigger: ['change']
        }
    ],
})

const countDown = ref(0)

const getVerificationCode = async () => {
    let mobilePhone = formData.value.mobilePhone

    if (!mobilePhone) {
        warning('请输入手机号')
        return
    }

    if (!phoneNumber.test(mobilePhone)) {
        warning('手机号格式错误')
        return
    }

    let { msg } = await fetch.codeService_mallSendSMS({
        captchaCodeKey: formData.value.captchaCodeKey,
        captchaCode: formData.value.mobileYzm,
        actionType: "REGISTER_ECMALL",
        mobilePhone
    })

    toast(msg)

    countDown.value = 60

    let count = setInterval(() => {
        countDown.value = countDown.value - 1
        if (countDown.value === 0) {
            clearInterval(count)
        }
    }, 1000)

}

const form = ref()

const btnSubmit = async () => {
    await form.value.validate().catch(e => {
        error(e[0].message)
            ; return Promise.reject(e)
    })

    let { msg, data } = await fetch.baseUsersService_modifyMobilePhoneBySMS({ ...phoneFormData.value })

    success(msg)

    store.commit('SET_USER_INFO', { ...userInfo.value, mobilePhone: data.mobilePhone })

    setTimeout(() => {
        uni.redirectTo({ url: '/pages/person/login' })
    }, 1500);

}  

</script>
<style lang="scss" scoped></style>