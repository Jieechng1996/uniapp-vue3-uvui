<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 11:03:07
 * @LastEditors: guojiecheng
-->
<template>
  <view class="px-5 py-2">
    <base-form :legend="[
      { label: '用户名：', key: 'userName', required: true, props: { border: 'surround' } },
      { label: '密码：', key: 'password', required: true, props: { border: 'surround', type: 'password' } },
      { label: '确认密码：', key: 'confirmPassword', required: true, props: { border: 'surround', type: 'password' } },
      { label: '验证码：', key: 'mobileYzm', required: true, type: 'slot' },
      { label: '手机号码：', key: 'mobilePhone', required: true, type: 'slot' },
      { label: '短信验证：', key: 'verificationCode', required: true, props: { border: 'surround' } },
      { key: 'agreement', type: 'slot' },
    ]" v-model="formData" ref="registerForm" :form-props="{ labelWidth: 90 }" :rules="rules">
      <template #mobileYzm>
        <uv-input v-model="formData.mobileYzm" placeholder="请输入验证码">
          <template #suffix>
            <uv-image width="80px" height="20px" :src="verificationImg" fit="cover" @click="() => refireshImag()" />
          </template>
        </uv-input>
      </template>
      <template #mobilePhone>
        <uv-input v-model="formData.mobilePhone" placeholder="请输入手机号码" type="number">
          <template #suffix>
            <uv-button size="small" type="primary" @click="() => getVerificationCode()"
              :disabled="!formData.mobilePhone && !!countDown" color="#cc3e3e">{{ countDown ?
      `请在${countDown}s后再获取` : '获取验证码' }}</uv-button>
          </template>
        </uv-input>
      </template>
      <template #agreement>
        <div class="flex">
          <checkbox-group @change="({ detail: {value} }) =>  formData.agreement = value.length" class="checkbox">
            <checkbox value="agree" class="text-xs" size="small"><text>我已阅读并同意<text @click.stop="simpleNavigateTo('/pages/person/agreement')"
                  class="red">《富海用户注册协议》</text></text></checkbox>
          </checkbox-group>
        </div>
      </template>
    </base-form>
    <uv-button type="primary" color="#cc3e3e" @click="() => btnRegister()">注册</uv-button>
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
    return Promise.reject(e)
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
