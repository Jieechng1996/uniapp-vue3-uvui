<!--
 * @Date: 2023-09-14 10:35:26
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-07 17:20:40
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
                        <view class="text-center" v-for="(item, index) in actions" :key="index">{{ item[props.keys.value] }}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </uv-popup>
</template>
<script setup>
import { onMounted , toRaw, watch} from 'vue';
import { ref } from 'vue';
import fetch from '@/config/fetch';
import store from '../store';
import httpServer from '@/common/httpServer';

const props =  defineProps({
    keys: {
        type: Object,
        default: () => ({})
    },
    api: {
        type: String,
        default: ''
    },
    params: {
        type: String,
        default: ''
    },
    props: {
        type: Object,
        default: () => ({})
    }
})

const value = ref('')

// watch(() => lookupCode.value, (value) => {
//     emit('update:modelValue', value)
// })

// watch(() => props.modelValue, (value) => {
//     if (value) {
//         lookupCode.value = value
//     }
// })

const emit = defineEmits(['callback', 'update:modelValue', 'confirm' , 'cancel'])

const change = (event) => {
    let index = event.detail.value[0]
    let item = actions.value[index]
    value.value = item[item.keys.key]
}

const actions = ref([])

const refreshList = async () => {
    let { data } = await httpServer.postV1(props.api , {
        ...props.params
    }).catch( err => {
        actions.value = []
        return Promise.reject(err)
    } )
    actions.value = data || []
    value.value = data[0][props.keys.key]
    
}
const confirm = (e) => {
    let item = actions.value.find( item => item[props.keys.key] === value.value )
    emit('callback', item)
    emit('confirm', item)
    //emit('update:modelValue', item.lookupCode)
    hideModal()
}
const cancel = (e) => {
    emit('callback', {})
    emit('cancel', item)
    //emit('update:modelValue', '')
    hideModal()
}

onMounted( () => {
    refreshList()
} )


const popup = ref()

const showModal = () => popup.value.open('bottom')

const hideModal = () => popup.value.close()

defineExpose({
    showModal,
    hideModal,
    refreshList
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

.item {
    line-height: 50px;
    text-align: center;
}

.header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1rpx solid #eee;
}
</style>