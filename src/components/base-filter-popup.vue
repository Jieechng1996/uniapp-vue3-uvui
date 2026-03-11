<!-- src/components/ContractFilterPopup.vue -->
<template>
  <view class="filter-popup">
    <uv-popup
      ref="popupRef"
      background-color="#fff"
      mode="right"
      :safeAreaInsetTop="false"
      :show="show"
      @close="handleClose"
    >
      <view class="w-screen h-screen flex flex-col">
        <!-- 导航栏 -->
        <uv-navbar
          :title="props.title"
          :safeAreaInsetTop="false"
          :fixed="false"
          @leftClick="handleClose"
          bgColor="#F8F8F8"
          leftIconColor="#333"
          leftIcon="close"
        />

        <!-- 表单区域 -->
        <scroll-view scroll-y class="flex-1" :style="{ height: scrollViewHeight }">
          <view class="px-3 py-4">
            <base-form
              :legend="filterFields"
              v-model="formData"
              ref="formRef"
              :form-props="{ labelWidth: 120 }"
            />
          </view>
        </scroll-view>

        <!-- 底部按钮 -->
        <view class="py-4 px-3 flex gap-4 bg-white border-t border-gray-100">
          <view class="flex-1">
            <uv-button @click="handleReset" plain>重置</uv-button>
          </view>
          <view class="flex-1">
            <uv-button @click="handleSearch" type="primary">搜索</uv-button>
          </view>
        </view>
      </view>
    </uv-popup>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ========== Props ==========
const props = defineProps({
  /** 弹窗显示状态 */
  show: {
    type: Boolean,
    default: false
  },
  /** 表单数据 */
  modelValue: {
    type: Object,
    default: () => ({})
  },
  /** 默认筛选字段配置 */
  fields: {
    type: Array,
    default: () => []
  },
  /** 默认值（用于重置） */
  defaultValues: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: '筛选'
  } 
})

// ========== Emits ==========
const emit = defineEmits(['update:modelValue', 'update:show', 'search', 'reset', 'close'])

// ========== 响应式数据 ==========
const popupRef = ref(null)
const formRef = ref(null)

// 表单数据（本地副本）
const formData = ref({ ...props.modelValue })

// 筛选字段配置
const filterFields = computed(() => {
  if (props.fields?.length) {
    return props.fields
  }
})

// 滚动视图高度
const scrollViewHeight = computed(() => {
  return 'calc(100% - 101px)'
})

// ========== 方法 ==========

/**
 * 关闭弹窗
 */
const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

/**
 * 重置表单
 */
const handleReset = () => {
  formData.value = { ...props.defaultValues }
  emit('update:modelValue', formData.value)
  emit('reset')
}

/**
 * 搜索
 */
const handleSearch = () => {
  emit('update:modelValue', formData.value)
  emit('update:show', false)
  emit('search', formData.value)
}

/**
 * 打开弹窗
 */
const open = () => {
  emit('update:show', true)
  popupRef.value?.open()
}

/**
 * 关闭弹窗
 */
const close = () => {
  emit('update:show', false)
  popupRef.value?.close()
}

// ========== 监听 ==========
watch(() => props.modelValue, (newVal) => {
  formData.value = { ...newVal }
}, { deep: true })

watch(() => props.show, (newVal) => {
  if (newVal) {
    popupRef.value?.open()
  } else {
    popupRef.value?.close()
  }
})

// ========== 暴露方法 ==========
defineExpose({
  open,
  close,
  formData
})
</script>

<style lang="scss" scoped>
.filter-popup {
  :deep(.uv-popup) {
    z-index: 999 !important;
  }
  
  :deep(.uv-navbar__content) {
    z-index: 1000 !important;
  }
}
</style>