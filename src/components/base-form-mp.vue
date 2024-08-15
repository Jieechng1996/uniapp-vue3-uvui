<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-08 14:27:23
 * @LastEditors: guojiecheng
-->
<template>
    <div className="w100p">
            <uv-form labelPosition="left" :model="formData" :rules="rules" errorType="border-bottom" v-bind="props.formProps" ref="formRef">
                <uv-form-item v-for="(item ,index) in props.legend" :key="index" :label="item.label" :name="item.key" :prop="item.key" borderBottom :required="item.required" v-bind="{ ...props.formItemProps , ...item.formItemProps }">
                    <view v-if="item.type === 'date'" class="w100p">
                        <uv-datetime-picker :ref="'datetimePicker'+index" mode="date"
                                :value="dayjs().valueOf()"
                                @confirm="({ value, mode }) => {
                                    if (mode === 'date') {
                                        formData[item.key] = dayjs(value).format('YYYY-MM-DD')
                                    }
                                }"
                                cancelText="清除选择"
                                @cancel="() => {
                                    formData[item.key] = ''
                                }"
                                v-bind="item.timeProps" ></uv-datetime-picker>
                        <uv-input className="w100p" v-model="formData[item.key]" :placeholder="item.placeholder || '请选择'" clearable readonly border="surround" suffixIcon="arrow-right" @click="() => proxy.$refs['datetimePicker'+index].value.open()" v-bind="{...item.props}"  ></uv-input>
                    </view>
                    <view v-else-if="item.type === 'slot'">
                        <slot :name="item.key" > </slot>
                    </view>
                    <view v-else class="w100p">
                        <uv-input v-model="formData[item.key]" placeholder="item.placeholder || '请输入'" clearable :disabled="item.disabled || props.disabled" border="surround" v-bind="{...item.props }"  />
                    </view>
                </uv-form-item>
            </uv-form>
        </div>

</template>

<script setup>
import dayjs from "dayjs";
import { getCurrentInstance, reactive, ref, watch } from "vue";


const props = defineProps({
    legend: {
        type: Array,
        default: []
    },
    modelValue: {
        type: Object,
        default: {}
    },
    gutter: {
        type: Number,
        default: 20
    },
    span: {
        type: Number,
        default: 8
    },
    showButton: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    formData: {
        type: Object,
        default: null
    },
    formProps: {
        type: Object,
        default: () => ({})
    },
    formItemProps: {
        type: Object,
        default: () => ({})
    },
    rules: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue', 'btnSearch', 'dataOnChange']);

watch(() => props.modelValue, (value) => {
    if (value) {
        for (let i in value) {
            formData[i] = value[i]
        }
    }

}, { deep: true, immediate: true })

watch(() => formData, (value) => {
    if (value) {
        emit('update:modelValue', value)
        emit('dataOnChange', toRaw(value)) //提供一个onChange方法，避免多个form存在时可能有响应式失效
    }
}, { deep: true, immediate: true })

const validate = () => new Promise((resolve, reject) => formRef.value.validate().then(res => resolve(res)).catch(e => reject(e)))

const validateField = (props) => new Promise((resolve, reject) =>
    formRef.value.validateField(props, errMsg => errMsg ? reject(errMsg) : resolve(errMsg))
)

defineExpose({
    validate,
    validateField
})

const curRules = ref({})

let rules = { ...props.rules }

props.legend.forEach(item => {
    rules[item.key] = rules[item.key] || []
    if (item.rules && item.rules.length !== 0) {
        rules[item.key] = [...rules[item.key], ...item.rules]
    }
    if (item.type === 'phoneNumber' || item.type === 'phone') {
        rules[item.key] = [...rules[item.key], {
            validator: (rule, value, callback) => !(value && !phoneNumber.test(value)), message: '手机号格式错误', trigger: ['change']
        }]
    }
    if (item.type === 'email') {
        rules[item.key] = [...rules[item.key], {
            validator: (rule, value, callback) => !(value && !email.test(value)), message: '邮箱格式错误', trigger: ['change']
        }]
    }
    if (item.required) {
        rules[item.key] = [...rules[item.key], {
            required: true,
            message: item.label + '为必填字段',
            trigger: ['blur', 'change']
        }]
    }
})

curRules.value = Object.entries(rules).length === 0 ? null : rules

const formData = reactive({})

const formRef = ref()

const { proxy } = getCurrentInstance()

</script>

<style lang="scss" scoped></style>
