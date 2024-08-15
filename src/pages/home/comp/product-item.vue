<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-25 16:20:56
 * @LastEditors: guojiecheng
-->
<template>
    <view class="flex p-2" style="align-items: center;">
      <uv-image :src="item.shortPicUrl" width="80" height="80" class="mr-2"></uv-image>
      <view class="text-sm" style="width: calc( 100% - 176px);color: #46423F;">
        <view style="color: #bf8500;" class="text-base">{{ item.productName }}</view>
        <view>挂牌价：{{ '￥' + item.unitPrice }}</view>
        <view class="ellipsis">经营组织：{{ item.orgName  }}</view>
        <view>提货地：{{ item.productArea }}</view>
        <view>开售时间：{{ item.startTime }}</view>
      </view>
      <view class="flex-none p-2">
        <view class="font-normal">
          <text class="green mr-1" >无限量</text>
          <text class="green icon ion-checkmark"></text>
        </view>
        <view>
          <text >剩余量：</text>
          <text class="red">{{ item.productQty }}</text>
        </view>
        <view class="flex ">
          <uv-button type="primary" size="small" color="#cc3333" @click="() => emits('btnJoinCart' , item)">加入购物车</uv-button>
        </view>
      </view>
    </view>
</template>

<script setup>

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
    required: true
  },
})

const emits = defineEmits(['btnJoinCart'])
</script>

<style lang="scss" scoped></style>
