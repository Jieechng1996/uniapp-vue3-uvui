<!--
 * @Date: 2024-08-02 09:52:55
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-19 18:18:27
 * @LastEditors: guojiecheng
-->
<template>
    <view v-if="showPermissionButton">
        <view class="flex p-2 bg-white" >
            <uv-button plain type="primary" class="mr-2" @click="btnPass">通过</uv-button>
            <uv-button plain type="error" class="mr-2" @click="btnReject">驳回</uv-button>
        </view>
        <uv-popup ref="popup" mode="bottom" props="userInfo">
            <view class="p-4">
                <view class="p-4 text-center font-bold">{{ params.title }}</view>
                <view>
                    <base-form
                        :legend="[{ key: 'opinion', label: '意见', type: 'input', required: true, props: { border: 'surround' } },]"
                        v-model="params" ref="form">
                    </base-form>
                </view>
                <view v-if="params.option === 'RJ'" class=" py-4 red mt-2 ">
                    备注:只能将单据驳回到提交人，提交人再次提交后将重新调用系统中配置的审批流，所有审批人都需要进行审批操作。</view>
                <uv-line></uv-line>
                <view class="flex my-2 justify-between">
                    <uv-button class="mr-2" @click="popup.close()">取消</uv-button>
                    <uv-button type="primary" @click="btnConfirm()">确定</uv-button>
                </view>
            </view>


        </uv-popup>
    </view>

</template>
<script setup>

import { baseForm } from '@/components'

import fetch from '@/config/fetch'
import { computed, onMounted, ref } from 'vue'
import { toast , alert ,error} from '@/common/message'
import store from '@/store'

const props = defineProps({
    procDefKey: {
        type: String,
        default: '',
        required: true
    },
    businessKey: {
        type: String,
        default: '',
        required: true
    }

})

const popup = ref()

const params = ref({})
const btnPass = () => {
    params.value = {
        title: '通过',
        menucode: 'db',
        option: 'Y'
    }
    popup.value.open()
}
const btnReject = () => {
    params.value = {
        title: '驳回',
        menucode: 'db',
        option: 'RJ'
    }
    popup.value.open()
}

const userInfo = computed(() => store.state.userInfo)

const showPermissionButton = ref(false)

const taskId = ref('')

const taskName = ref('')

const form = ref()

const btnConfirm = async () => {
    await form.value.validate().catch(e => {
        error(e[0].message)
            ; return Promise.reject(e)
    })

    await fetch.approval({
        taskId: taskId.value,
        saveonly: 'false',
        properties: {
            ...params.value
        }
    })

    alert('操作成功')

    setTimeout(() => {
        popup.value.close()
    }, 1500);

    emit('finish')

    getPermission()

}

const getPermission = async () => {

    let { data: { procInstId } } = await fetch.getBpmListByParam({ businessKey: props.businessKey, procDefKey: props.procDefKey })

    let { data } = await fetch.findTasksByProcInstId({ processInstanceId: procInstId })

    let item = data.find(item => item.assignee === userInfo.value.userName)

    if (item) {
        showPermissionButton.value = true
        taskId.value = item.taskId
        taskName.value = item.taskName
    }

    emit('onLoad', item)

}

const emit = defineEmits(['onLoad', 'finish'])

defineExpose({
    getPermission,
})

onMounted(() => {
    getPermission()
})


</script>
<style lang="scss" scoped></style>