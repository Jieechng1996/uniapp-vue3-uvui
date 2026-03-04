<!--
 * @Date: 2024-07-12 17:24:05
 * @Author: guojiecheng
 * @LastEditTime: 2026-01-29 10:51:28
 * @LastEditors: guojiecheng
-->
<template>
    <uv-upload :fileList="list" :maxCount="props.limit" :disabled="props.disabled" :deletable="!props.disabled"
        @afterRead="choose" @delete="delFile" accept="file" v-bind="props.props"></uv-upload>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { uploadData } from '@/common/httpServer'
import api from '@/config/api'
import { watch } from 'vue'
import { toRaw } from 'vue'



const props = defineProps({
    businessKey: {
        type: String,
        default: ''
    },
    businessId: {
        type: String,
        default: ''
    },
    bucketName: {
        type: String,
        default: ''
    },
    limit: {
        type: Number,
        default: 9
    },
    modelValue: {
        type: Array,
        default: []
    },
    addImage: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    props: {
        type: Object,
        default: () => ({})
    }
})

const list = ref([])

const chooseImage = () => new Promise((resolve, reject) => {
    uni.chooseImage({
        count: 1,
        success: (res) => {
            console.log(res)
            resolve(res)
        },
        fail: (err) => {
            // warning(err.errMsg)
            console.log(res)
            reject(err)
        }
    })
})

const emit = defineEmits(['update:modelValue', 'success', 'delete'])

// watch(() => list.value, (value) => {
//     emit('update:modelValue', value)
// }, { deep: true , immediate: true})

watch(() => props.modelValue, (value) => {
    if (value) {
        toRaw(value).forEach(item => {
            item.url = item.filesPath
        })
        list.value = value
    }
}, { deep: true, immediate: true })



const choose = async (res) => {
    // let { tempFilePaths } = await chooseImage()
    let { data } = await uploadData(api.fileUploadService_cosfile_documentUpload, res.file.url, { businessId: props.businessId, businessKey: props.businessKey, bucketName: props.bucketName })
    data.name = data.filesName
    data.extname = data.filesName.split('.')[1]
    data.url = data.filesPath
    list.value.push(data)
    emit('update:modelValue', list.value)
    emit('success', data)
    emit('callback', data)
}

const delFile = (event) => {
    list.value.splice(event, 1)
    emit('update:modelValue', list.value)
    emit('delete')
    emit('callback', {})
}

onMounted(() => {
    // list.value = props.modelValue
})
</script>
<style lang="scss" scoped>
.picture_img {
    width: 100%;
    height: 100%
}
</style>
