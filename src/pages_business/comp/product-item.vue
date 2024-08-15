<!--
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 17:02:53
 * @LastEditors: guojiecheng
-->
<template>
    <view class="flex p-2 pl-4" style="align-items: center;">
      <checkbox class="pl-2"  :checked="item.checked" disabled  v-if="props.shoppingCart" @click="emits('changeChecked', item)"/>
      <uv-image :src="item.shortPicUrl" width="80" height="80" class="mr-2" @click="emits('btnGoDetail', item)"></uv-image>
      <view class="text-sm" style="color: #46423F;" :style="{ width : !props.shoppingCart ? 'calc( 100% - 176px)' : 'calc( 100% - 136px)'}" @click="emits('btnGoDetail', item)">
        <view style="color: #bf8500;" class="text-base">{{ item.productName }}</view>
        <view>挂牌价：{{ '￥' + item.unitPrice }}</view>
        <view class="ellipsis">经营组织：{{ item.orgName  }}</view>
        <view>提货地：{{ item.productArea }}</view>
        <view>开售时间：{{ item.startTime }}</view>
      </view>
      <view class="flex-none p-2" v-if="!props.shoppingCart">
        <view class="font-normal">
          <text class="green mr-1" >无限量</text>
          <text class="green icon ion-checkmark"></text>
        </view>
        <view>
          <text >剩余量：</text>
          <text class="red">{{ item.productQty }}</text>
        </view>
        <view class="flex ">
          <uv-button type="primary" size="small" color="#cc3333" v-if="props.showJoinCart" @click="() => emits('btnJoinCart' , item)">加入购物车</uv-button>
          <uv-button type="primary" size="small" color="#cc3333" v-if="props.showByNow" @click="() => emits('btnByNow' , item)">立刻购买</uv-button>
          <uv-button type="primary" size="small" color="#cc3333" v-if="props.showCreateProtocol" @click="() => emits('btnCreateProtocol' , item)">生成协议</uv-button>
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
  showJoinCart : {
    type: Boolean,
    default: false
  },
  showByNow : {
    type: Boolean,
    default: false
  },
  shoppingCart: {
    type: Boolean,
    default: false
  },
  showCreateProtocol: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['btnJoinCart', 'btnGoDetail', 'changeChecked', 'btnCreateProtocol'])
</script>

<style lang="scss" scoped></style>
