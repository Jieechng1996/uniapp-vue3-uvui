<!--
 * @Date: 2023-07-17 15:44:18
 * @Author: guojiecheng
 * @LastEditTime: 2026-03-26 18:26:53
 * @LastEditors: guojiecheng
-->
<template>
    <div class="flex flex-col w-full min-w-0">
        <!-- 文件列表 -->
        <div class="border border-gray-200 rounded-xl overflow-hidden w-full bg-white">
            <!-- 列表头部 -->
            <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <text class="text-sm font-medium text-gray-700">已上传文件</text>
                <text class="text-xs text-gray-500">{{ fileList.length }}/{{ limit }}</text>
            </div>

            <!-- 文件列表区域 -->
            <div class="max-h-64 overflow-y-auto">
                <div v-for="(item, index) in fileList" :key="index"
                    class=" px-4 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-50 transition-colors duration-150">
                    <div class="flex items-center flex-1 min-w-0 mr-2">
                        <!-- 文件图标 -->
                        <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-3">
                            <image v-if="isImageFile(item)" :src="item.filesPath" mode="aspectFill"
                                class="w-12 h-12 rounded-lg" @click="previewImage(index)" />
                            <div v-else class="w-12 h-12 rounded-lg flex items-center justify-center"
                                :class="getFileIconBgClass(item.filesName)">
                                <text class="text-xl">{{ getFileText(item.filesName) }}</text>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3 flex-shrink-0 ml-2">
                            <div v-if="isImageFile(item)"
                                class="w-9 h-9 rounded-full flex items-center justify-center active:bg-blue-100 transition-colors"
                                @click="previewImage(index)">
                                <text class="text-blue-500 text-base">预览</text>
                            </div>
                            <div class="w-9 h-9 rounded-full flex items-center justify-center active:bg-green-100 transition-colors"
                                @click="downloadFile(item)">
                                <text class="text-green-500 text-base">下载</text>
                            </div>
                            <div v-if="!disabled"
                                class="w-9 h-9 rounded-full flex items-center justify-center active:bg-red-100 transition-colors"
                                @click="remove(index)">
                                <text class="text-red-500 text-base">删除</text>
                            </div>
                        </div>

                        <!-- 文件信息 -->

                    </div>
                    <div class="min-w-0 flex-1 overflow-hidden">
                        <div class="font-medium text-gray-900 truncate text-sm">
                            {{ item.filesName || '未知文件' }}
                        </div>
                    </div>
                    <!-- 操作按钮 -->

                </div>

                <!-- 空状态 -->
                <div v-if="fileList.length === 0" class="flex flex-col items-center justify-center py-12">
                    <text class="text-4xl mb-3">📁</text>
                    <text class="text-gray-500 text-sm">暂无文件</text>
                    <text class="text-gray-400 text-xs mt-1">点击底部按钮上传</text>
                </div>
            </div>
        </div>

        <!-- 上传按钮 -->
        <div class="mt-4">
            <uv-button type="primary" size="default" shape="circle" :loading="loading"
                :disabled="disabled || fileList.length >= limit" @click="() => chooseFile()" class="w-full">
                <text class="mr-2" v-if="!loading">+</text>
                {{ loading ? '上传中...' : '上传附件' }}
            </uv-button>
            <!-- 数量提示 -->
            <text v-if="fileList.length >= limit" class="block text-center text-xs text-gray-500 mt-2">
                已达到最大文件数量限制 ({{ limit }}个)
            </text>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { uploadData } from '@/common/httpServer'
import api from '@/config/api'
import { confirm, warning } from '../common/message'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    limit: {
        type: Number,
        default: 100
    },
    disabled: {
        type: Boolean,
        default: false
    },
    accept: {
        type: String,
        default: ''
    },
    businessId: {
        type: [Number, String],
        default: ''
    },
    businessKey: {
        type: [Number, String],
        default: ''
    },
    bucketName: {
        type: [Number, String],
        default: ''
    },
    otherParams: {
        type: Object,
        default: () => ({})
    },
    buttonSize: {
        type: String,
        default: 'default'
    },
    buttonPosition: {
        type: String,
        default: 'bottom'
    },
    maxSize: {
        type: Number,
        default: 3 // 单位：MB
    }
})

const emit = defineEmits(['update:modelValue', 'success', 'remove', 'error'])

const fileList = ref([])
const loading = ref(false)

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
    if (val) {
        fileList.value = val
    }
}, { deep: true, immediate: true })

const chooseFile = () => {
    uni.chooseFile({
        count: 1,
        type: 'all',
        success: (res) => {
            console.log(res);
            choose(res)
        },
        fail: (err) => {
            console.error(err);
        }
    })
}

// 选择文件并上传
const choose = async (res) => {
    console.log(res);
    const file = res.tempFiles[0]
    const size = file.size

    // 文件大小验证
    const maxSizeBytes = props.maxSize * 1024 * 1024
    if (size > maxSizeBytes) {
        return warning(`文件大小不能超过 ${props.maxSize}MB`)
    }

    // 文件类型验证
    if (props.accept) {
        const allowedTypes = props.accept.split(',').map(type => type.trim().toLowerCase())
        const fileExtension = file.name.split('.').pop().toLowerCase()
        const isValidType = allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return type === `.${fileExtension}`
            } else if (type.endsWith('/*')) {
                const mimeTypePrefix = type.replace('/*', '')
                return file.type?.startsWith(mimeTypePrefix)
            } else {
                return type === file.type
            }
        })

        if (!isValidType) {
            return warning(`只能上传 ${allowedTypes.join(', ')} 类型的文件`)
        }
    }

    loading.value = true
    try {
        const { data } = await uploadData(api.v2_file_save, res.tempFilePaths[0], {
            businessId: props.businessId,
            businessKey: props.businessKey,
            bucketName: props.bucketName,
            ...props.otherParams
        })

        console.log(data);

        // 保存文件大小信息
        fileList.value.push(data)
        emit('update:modelValue', fileList.value)
        emit('success', data)
    } catch (error) {
        console.error('上传错误:', error)
        warning('上传失败')
        emit('error', error)
    } finally {
        loading.value = false
    }
}

// 删除文件
const delFile = (index) => {
    fileList.value.splice(index, 1)
    emit('update:modelValue', fileList.value)
    emit('remove')
}

// 移除文件（兼容方法）
const remove = (index) => {
    confirm({
        msg: '确定要删除此文件吗？',
        callBack: () => {
            delFile(index)
        }
    })
}

// 判断是否为图片文件
const isImageFile = (file) => {
    if (!file || !file.filesPath) return false
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    const ext = file.filesPath.split('.').pop().toLowerCase()
    return imageExtensions.includes(ext)
}

// 获取文件图标背景色
const getFileIconBgClass = (fileName) => {
    if (!fileName) return 'bg-gray-100'
    const ext = fileName.split('.').pop().toLowerCase()
    const bgMap = {
        'pdf': 'bg-red-50',
        'doc': 'bg-blue-50',
        'docx': 'bg-blue-50',
        'xls': 'bg-green-50',
        'xlsx': 'bg-green-50',
        'ppt': 'bg-orange-50',
        'pptx': 'bg-orange-50',
        'txt': 'bg-gray-100',
        'zip': 'bg-yellow-50',
        'rar': 'bg-yellow-50'
    }
    return bgMap[ext] || 'bg-gray-100'
}

// 获取文件图标 class
const getFileText = (fileName) => {
    if (!fileName) return 'file'
    return fileName.split('.').pop().toLowerCase()
}

// 获取文件扩展名
const getFileExtension = (fileName) => {
    if (!fileName) return ''
    return fileName.split('.').pop().toUpperCase()
}

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 预览图片
const previewImage = (index) => {
    const imageList = fileList.value
        .filter(item => isImageFile(item))
        .map(item => item.filesPath)
    const currentIndex = fileList.value.filter((item, i) => i <= index && isImageFile(item)).length - 1
    uni.previewImage({
        urls: imageList,
        current: currentIndex
    })
}

// 下载/打开文件
const downloadFile = (file) => {
    if (!file || !file.filesPath) return
    if (isImageFile(file)) {
        uni.previewImage({
            urls: [file.filesPath]
        })
    } else {
        uni.showLoading({ title: '下载中' })
        uni.downloadFile({
            url: file.filesPath,
            success: (res) => {
                uni.hideLoading()
                if (res.statusCode === 200) {
                    uni.openDocument({
                        filePath: res.tempFilePath,
                        showMenu: true
                    })
                }
            },
            fail: (err) => {
                uni.hideLoading()
                console.error('下载失败:', err)
                warning('下载失败')
            }
        })
    }
}

onMounted(() => {
    fileList.value = props.modelValue || []
})
</script>

<style lang="scss" scoped>
/* 移动端样式优化 */
.max-h-64 {
    max-height: 16rem;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
    width: 4px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}

/* 点击反馈 */
.active\:bg-gray-50:active {
    background-color: #f9fafb;
}

.active\:bg-blue-100:active {
    background-color: #dbeafe;
}

.active\:bg-green-100:active {
    background-color: #dcfce7;
}

.active\:bg-red-100:active {
    background-color: #fee2e2;
}
</style>