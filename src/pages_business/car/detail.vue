<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 15:30:02
 * @LastEditors: guojiecheng
-->
<template>
  <view class="px-5 py-2">
    <base-form :legend="[
      { label: '司乘姓名：', key: 'userName', required: true },
      { label: '车牌号码：', key: 'licensePlateNumber', required: true },
      { label: '身份证号码：', key: 'driverNumber', required: true },
      { label: '手机号码：', key: 'driverPhoneNumber', required: true , type: 'phone'},
      { label: '备注：', key: 'remark', required: true},
    ]" v-model="formData" ref="registerForm" :form-props="{ labelWidth: 100 }" :rules="rules">
      
    </base-form>
    <view class="mt-3"> 
      <uv-button type="primary" color="#cc3e3e" @click="() => btnRegister()">确认</uv-button>
    </view>
   
  </view>
</template>

<script setup>

import { baseForm } from '@/components'
import { ref } from 'vue';
import api from '@/config/api';
import dayjs from 'dayjs';
import { success, toast, warning } from '../../common/message';
import fetch from '@/config/fetch';
import { simpleNavigateTo } from '@/common/util'
import CryptoJS from "crypto-js"
import { phoneNumber, password } from '@/lib/regexp'
import store from  '@/store'

const formData = ref({
  agreement: ''
})

const rules = ref({
  userName: [
    { min: 2, max: 20, message: '用户名必须在2-20位之间', trigger: ['change'] },
  ],
  password: [
    { min: 6, max: 16, message: '密码必须在6-16位之间', trigger: ['change'] },
    {
      validator: (rule, value, callback) => !(value && !password.test(value)) , message: '请包含大写字母、小写字母、数字', trigger: ['change']
    }
  ],
  confirmPassword: [
    { validator: (rule, value, callback) => !(value && formData.value.password !== value), message: '两个密码需要一致', trigger: ['change'] }
  ],
  agreement: [
    {
      validator: (rule, value, callback) => !!value, message: '请勾选阅读用户注册协议',trigger: ['change']
    }
  ]
})

const verificationImg = ref('')

const countDown = ref(0)

const refireshImag = () => {
  uni.request({
    url: api.codeService_getImg,
    data: {
      imgCodeKey: dayjs().valueOf(),
      actionType: 'REGISTER_ECMALL'
    },
    method: 'get',
    header: {
      "Content-Type": 'application/json',
      "Accept": "*/*",
      "pf": "ECMOBMALL"
    },
    timeout: 60000,
    responseType: 'arraybuffer',
    success: ({ header, data }) => {
      formData.value.captchaCodeKey = header.imgcodekey
      verificationImg.value = "data:image/png;base64," + wx.arrayBufferToBase64(data)
    },
    fail: (res) => {
      warning(res.errMsg)
    },
  })

}

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

const registerForm = ref()

const btnRegister = async () => {
  await registerForm.value.validate().catch(e => {
    toast(e[0].message)
      ; return Promise.reject(e)
  })

  let { msg } = await fetch.authentication_register({
    ...formData.value,
    password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(formData.value.password)),
    confirmPassword: '',
    actionType: "REGISTER_ECMALL"
  })

  toast(msg)
  

  let res = await fetch.authentication_login({
    userName: formData.value.userName,
    pwd: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(formData.value.password)),
    actionType: 'PURE_UAP'
  })
  toast(res.msg)

  store.commit('SET_USER_INFO', res.data)

  setTimeout(() => {
    simpleNavigateTo('/pages/person/enterpriseRegister' )
    // uni.switchTab({ url: '/pages/person/enterpriseRegister' })
  }, 1500);
}

</script>

<style lang="scss" scoped></style>
