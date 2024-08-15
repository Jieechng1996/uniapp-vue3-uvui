<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 17:15:20
 * @LastEditors: guojiecheng
-->
<template>
  <view>
    <view class="text-center p-1" style="color:#13a2ff;background-color: #ddd;">
      <text>——</text>
      <text class="icon iconfont text-lg"></text>
      <text>{{ props.title }}</text>
      <text>——</text>
    </view>
    <uv-tabs :list="props.tabs" lineColor="#e42112" :current="current" @change="({ index }) => current = index"
      itemStyle="padding-left: 15px; padding-right: 15px; height: 44px;"></uv-tabs>
    <swiper :style="{ height: productList.length * 132 + 'px' }" :current="current"
      @change="({ detail }) => current = detail.current">
      <swiper-item v-for="( line, subscript ) in list" :key="subscript">
        <view v-for="(item, index) in productList" :key="index">
          <product-item :item="item" @btnJoinCart="(item) => emits('btnJoinCart', item)"></product-item>
          <view class="px-4"><uv-line></uv-line></view>
        </view>
        <view v-if="!productList.length">
          <uv-empty mode="list"></uv-empty>
        </view>
      </swiper-item>
    </swiper>
  </view>

</template>

<script setup>
import productItem from "./product-item.vue";
import { onMounted, ref } from "vue"
import fetch from '@/config/fetch'

const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true
  },
  tabs: {
    type: Array,
    default: [],
    required: true
  }
})

const emits = defineEmits(['btnJoinCart'])

const list = ref(props.tabs)

const productList = ref([])

const current = ref(0)

const change = (value) => {
  console.log(value)
}
onMounted(async () => {
  let { data } = await fetch.ecpExFlashPicturesService_getHomePageProducts({})
  productList.value = data
})

</script>

<style lang="scss" scoped>
.swiper {
  height: 100%;
}
</style>
