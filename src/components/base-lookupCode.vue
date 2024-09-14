<!--
 * @Date: 2023-09-14 10:35:26
 * @Author: guojiecheng
 * @LastEditTime: 2024-09-14 17:02:48
 * @LastEditors: guojiecheng
-->
<template>
    <uv-popup ref="popup" background-color="#fff" type="bottom" v-bind="props.props">
        <view class="header">
            <view @click="cancel">清除选择</view>
            <view class="uni-primary" @click="confirm">确认</view>
        </view>
        <view class="popup-content">
            <picker-view class="picker-view" @change="change">
                <picker-view-column>
                    <view class="line" v-for="(item, index) in actions" :key="index">{{ item.meaning }}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </uv-popup>
</template>
<script setup>
import { onMounted, toRaw, watch } from 'vue';
import { ref } from 'vue';
import fetch from '@/config/fetch';
import store from '../store';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    lookupType: {
        type: String,
        default: ''
    },
    systemCode: {
        type: String,
        default: ''
    },
})

const lookupCode = ref('')

// watch(() => lookupCode.value, (value) => {
//     emit('update:modelValue', value)
// })

// watch(() => props.modelValue, (value) => {
//     if (value) {
//         lookupCode.value = value
//     }
// })

const emit = defineEmits(['callback', 'update:modelValue', 'confirm', 'cancel', 'onLoad'])

const change = (event) => {
    let index = event.detail.value[0]
    let item = actions.value[index]
    lookupCode.value = item.lookupCode
}

const actions = ref([])

const getLookupCode = async () => {
    let lookupCodes = toRaw(store.state.lookupCodeList) || []
    let lookupCodeList = lookupCodes.filter(item => item.lookupType === props.lookupType && item.systemCode === props.systemCode)
    if (lookupCodeList.length === 0) {
        let { data } = await fetch.baseLookupValuesService_find({
            lookupType: props.lookupType,
            systemCode: props.systemCode
        })
        lookupCodeList = data
        lookupCodes = [...lookupCodes, ...data]
        store.commit('SET_LOOKUP_CODE_LIST', lookupCodes)
        // wx.setStorageSync('lookupCodeList', lookupCode)
    }
    lookupCodeList.map((item) => {
        item.name = item.meaning
        item.value = item.lookupCode
        item.text = item.meaning
    })
    actions.value = lookupCodeList
    lookupCode.value = lookupCodeList[0].lookupCode
    emit('onLoad', lookupCodeList)

}
const confirm = (e) => {
    let item = actions.value.find(item => item.lookupCode === lookupCode.value)
    emit('confirm', item)
    emit('callback', item)
    //emit('update:modelValue', item.lookupCode)
    hideModal()
}
const cancel = (e) => {
    emit('cancel', {})
    emit('callback', {})
    //emit('update:modelValue', '')
    hideModal()
}

onMounted(() => {
   // getLookupCode()
})


const popup = ref()

const showModal = () => {
    popup.value.open('bottom')
    getLookupCode()
}

const hideModal = () => popup.value.close()

onMounted(() => {

})

defineExpose({
    showModal,
    hideModal
})
</script>
<style lang="scss" scoped>
.popup-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    height: 300px;
    background-color: #fff;
}

.current {

    // :deep(.uni-popup__wrapper-box){
    //     background-color: #fff;
    // }
    // .uni-popup{
    //     background-color: #fff !important;
    // }

}

:deep(.uni-popup__wrapper-box) {
    background-color: #fff;
}

.picker-view {
    width: 100%;
    height: 100%;
}

.line {
    line-height: 34px;
    text-align: center;
}

.header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1rpx solid #eee;
}
</style>