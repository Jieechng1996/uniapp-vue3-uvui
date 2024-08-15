<!--
 * @Date: 2024-07-19 11:07:50
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-19 14:58:08
 * @LastEditors: guojiecheng
-->
<template>
    <uv-picker ref="picker" :columns="addressList" keyName="name" @change="change" @confirm="confirm" @cancel="claer" cancelText="清除选择" v-bind="props.props">
    </uv-picker>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";

import pcaCode from '@/lib/pca-code.json'

const props = defineProps({
    props: {
        type: Object,
        default: () => ({})
    }
})

const picker = ref()

const addressList = computed(() => [proviceLict.value, cityList.value, regionList.value])

const proviceLict = ref([])

proviceLict.value = pcaCode

const cityList = ref([])

cityList.value = proviceLict.value[0].children

const regionList = ref([])

regionList.value = cityList.value[0].children

const pickerValue = ref([11, 1101, 110101])

console.log(pcaCode)

const handlePickValueDefault = () => {
    pickerValue.value[0] = proviceLict.value.findIndex(item => Number(item.code) === defaultValue[0]);
    // 设置市
    cityList.value = this.provinces[this.pickerValue[0]]?.children || [];
    this.pickerValue[1] = this.citys.findIndex(item => Number(item.id) === this.defaultValue[1]);
    // 设置区
    this.areas = this.citys[this.pickerValue[1]]?.children || [];
    this.pickerValue[2] = this.areas.findIndex(item => Number(item.id) === this.defaultValue[2]);
    // 重置下位置
    this.$refs.picker.setIndexs([this.pickerValue[0], this.pickerValue[1], this.pickerValue[2]], true);
}

const change = (e) => {
    const { columnIndex, index, indexs } = e
    console.log(e)
    // 改变了省
    if (columnIndex === 0) {
        cityList.value = proviceLict.value[index]?.children || [0]
        regionList.value = cityList.value[0]?.children || [0]
        picker.value.setIndexs([index, 0, 0], true)
    } else if (columnIndex === 1) {
        regionList.value = cityList.value[index]?.children || []
        picker.value.setIndexs(indexs, true)
    }
}

const emits = defineEmits(['confirm', 'clear'])

const confirm = ({ value }) => {
    console.log('确认选择的地区：', value);
    emits('confirm' , value)
}
const claer = () => {
    emits('clear' , value)
}

const showModal = () => picker.value.open()

const hideModal = () => picker.value.close()

defineExpose({
    showModal,
    hideModal
})

onMounted(() => {
   //  picker.value.open();

})


</script>
<style lang="scss" scoped></style>