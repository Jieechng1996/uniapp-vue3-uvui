<!--
 * @Date: 2024-08-01 13:57:58
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-01 15:42:12
 * @LastEditors: guojiecheng
-->
<template>
    <uv-steps current="1" direction="column">
		<uv-steps-item :title="item.user" :desc="item.dept" v-for="(item, index) in list" :key="index" >
            <template #icon>
                <uv-icon :name="item.icon" :color="item.color" size="40"></uv-icon>
            </template>
            <template #title>
                <text class="text-base text-gray-600">{{ item.user }}</text>
            </template>
            <template #desc>
                <text class="text-sm  text-gray-600">{{ item.dept }}</text>
            </template>
        </uv-steps-item>
	</uv-steps>
</template>
<script setup>
import fetch from '@/config/fetch'
import { onMounted, ref } from 'vue'
const props = defineProps({
    processDefinitionKey: {
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

const list = ref([])

const refresh = async () => {
    let { data: { lines , nodes } } = await fetch.bpmProcessService_getGooflowProcessJSON({
        preview: true,
        processDefinitionKey: props.processDefinitionKey,
        businessKey: props.businessKey
    })



    let arr = []

    let nodeArr = Object.entries(nodes).map(([key, value]) => {
        return { key,  value }
    })

    let start = nodeArr.find(item => item.value.type === 'start')

    let end = nodeArr.find(item => item.value.type === 'end')

    
    
    let lineArr = Object.entries(lines).map(([key, value]) => {
        return { key,  value }
    })

    let times = 40

    if (!start || !end) {
        return
    }

    arr.push(start)

    while(start.key !== end.key && times > 0){
        times--
        let line = lineArr.find(item => item.value.from === start.key)
        start = nodeArr.find(item => item.key === line.value.to)
        if (start) {
            arr.push(start)
        }
    }

    

    list.value = arr.map(item => {
        item.user = item.value.users?.map(line => line.personName).join(',') || ' '
        item.dept = item.value.name || ' '
        item.type = item.value.type
        item.icon = 'account-fill'
        item.color = '#BFBFBF'
        if(item.value.preMarked){
            item.color = '#9AA9E2'
        }
        if(item.value.notReceivedMarken){
            item.icon = 'map-fill'
            item.color = '#CC0133'
        }
        if (item.type === 'start') {
            item.icon = 'play-circle-fill'
        }
        if (item.type === 'end') {
            item.icon = 'pause-circle-fill'
        }
        if (item.value.customMarked) {
            item.color = '#349933'
        }
        return item
    })


    console.log(arr)
}

onMounted(() => {
    refresh()
})

defineExpose({
    refresh
})
</script>
<style lang="scss" scoped>
:deep(.uv-steps-item__line--column){
    height: 70px !important;
}
:deep(.uv-steps-item--column){
    padding-top: 5px;
}
:deep(.uv-steps-item__wrapper--column){
    height: 45px;
}
:deep(.uv-steps-item__content--column){
    margin-left: 16px !important
}

</style>