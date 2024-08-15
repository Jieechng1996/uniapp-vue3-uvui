<!--
 * @Date: 2024-08-07 11:19:43
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-09 16:10:05
 * @LastEditors: guojiecheng
-->
<template>
  <view class="h100p overflow-auto">
    <view class="px-3">
      <base-form
        :legend="[
          {
            key: 'orgName',
            label: '销售组织',
            required: true,
            type: 'romoteSelect',
            api: api.baseOrgV6_findPaginationCompany,
            keys: { key: 'orgCode', value: 'orgName' },
          },
          { key: 'productName', label: '产品名称', type: 'slot' },
        ]"
        v-model="params"
        ref="searchForm"
        :formProps="{ labelWidth: 120 }"
      >
        <template #productName>
          <view class="flex">
            <uv-input
              v-model="params.productName"
              placeholder="请选择"
              clearable
              border="none"
            ></uv-input>
            <uv-button
              type="primary"
              size="small"
              @click="() => refresh()"
              class="ml-2"
              >搜索</uv-button
            >
          </view>
        </template>
      </base-form>
    </view>
    <view class="map mt-1">
      <view class="w100p h100p flex justify-center items-center" v-if="loading">
        <uv-loading-icon></uv-loading-icon>
      </view>
      <view v-else class="w100p h100p">
        <map
          :longitude="longitude"
          :latitude="latitude"
          show-compass
          enable-3D
          show-location
          :markers="markers"
          class="w100p h100p"
          id="map"
          scale="10"
          @markertap="markerTap"
        >
        </map>
      </view>
    </view>
    <view class="">
      <view class="text-base red font-bold p-2">订单信息</view>
      <view class="text-sm px-2 font-bold">商品信息</view>
      <view class="m-2 border border-solid border-gray-300">
        <view
          class="flex text-center leading-9 border-b border-solid border-gray-300"
        >
          <view class="w-10">序号</view>
          <view class="flex-1">产品名称</view>
          <view class="w-10">吨数</view>
          <view class="w-14">车辆数</view>
        </view>
        <view
          class="flex text-center leading-9 text-gray-600"
          v-for="(item, index) in productList"
          :key="index"
        >
          <view class="w-10">{{ index + 1 }}</view>
          <view class="flex-1">{{ item.productName }}</view>
          <view class="w-10">{{ item.productQty }}</view>
          <view class="w-14">{{ item.deliveryList?.length || 0 }}</view>
        </view>
        <view v-if="productList.length === 0" class="py-4">
          <uv-empty></uv-empty>
        </view>
      </view>
      <view class="text-sm px-2 font-bold">车辆信息</view>
      <view class="m-2 border border-solid border-gray-300">
        <view
          class="flex text-center leading-9 border-b border-solid border-gray-300"
        >
          <view class="w-10">序号</view>
          <view class="w-16">车牌号</view>
          <view class="flex-1">产品名称</view>
          <view class="w-10">吨数</view>
          <view class="w-14">驾驶员</view>
          <view class="w-14">操作</view>
        </view>
        <view
          class="flex text-center leading-9 text-gray-600"
          v-for="(item, index) in deliveryList"
          :key="index"
        >
          <view class="w-10 flex items-center justify-center"
            ><text>{{ index + 1 }}</text></view
          >
          <view class="w-16 flex items-center justify-center"
            ><text>{{ item.plateNumber }}</text></view
          >
          <view class="flex-1 flex items-center"
            ><text>{{ item.productList[0].productName }}</text></view
          >
          <view class="w-10 flex items-center justify-center"
            ><text>{{ item.productList[0].productQty }}</text></view
          >
          <view class="w-14 flex items-center justify-center"
            ><text>{{ item.driverName }}</text></view
          >
          <view class="w-14 flex items-center justify-center">
            <uv-button
              :color="skin.primaryColor"
              size="mini"
              plain
              @click="() => btnDelete(index)"
              >删除</uv-button
            >
          </view>
        </view>
        <view v-if="deliveryList.length === 0" class="py-4">
          <uv-empty></uv-empty>
        </view>
      </view>
      <view class="p-2">
        <uv-button :color="skin.primaryColor">提交</uv-button>
      </view>
    </view>
    <uv-modal
      ref="modal"
      title="车辆信息"
      :closeOnClickOverlay="false"
      width="280"
      :confirmColor="skin.primaryColor"
      showCancelButton
      cancelText="关闭"
      confirmText="确认订单"
      @confirm="btnConfirm"
      @cancel="btnCancel"
    >
      <view class="leading-7">
        <view class="flex"
          ><text class="w-20">车牌号：</text
          ><text>{{ modalData.plateNumber }}</text></view
        >
        <view class="flex"
          ><text class="w-20">配载货物：</text
          ><text>{{ modalData?.productList[0].productName }}</text></view
        >
        <view class="flex"
          ><text class="w-20">配载量：</text
          ><text>{{
            modalData?.productList[0].productQty +
            modalData?.productList[0].productUom
          }}</text></view
        >
        <view class="flex"
          ><text class="w-20">提货厂区：</text
          ><text>{{ modalData?.productList[0].productArea }}</text></view
        >
        <view class="flex"
          ><text class="w-20">预计目的地：</text
          ><text>{{ modalData?.expectedDestination }}</text></view
        >
      </view>
    </uv-modal>
  </view>
</template>
<script setup>
import api from "@/config/api";
import fetch from "@/config/fetch";
import { inject, onMounted, ref, toRaw } from "vue";
import { toast } from "../../common/message";
import { baseForm } from "../../components";
import location from "./img/location.png";
import car from "./img/car.png";
const skin = inject("skin");
const base = inject("base");

const longitude = ref(base.location?.longitude || 116.403963);

const latitude = ref(base.location?.latitude || 39.915119);

const options = ref([]);
const params = ref({
  orgName: "",
});

const searchForm = ref();

const markers = ref([
  {
    latitude: latitude.value,
    longitude: longitude.value,
    width: 30,
    height: 30,
    id: 0,
    markerId: 0,
    iconPath: location,
  },
]);

const loading = ref(true);

const refresh = async () => {
  // await searchForm.value.validate().catch(err => {
  //     toast(err[0].message)
  //     return Promise.reject(err)
  // })

  loading.value = true;

  markers.value = [];

  let { data } = await fetch.truck_mall_findPagination4Map().catch((err) => {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
    markers.value = [];
    return Promise.reject(err);
  });

  setTimeout(() => {
    loading.value = false;
  }, 1000);

  if (data.length === 0) {
    toast("暂无数据");
    return;
  }

  console.log(data);

  markers.value = data.map((item) => {
    item.iconPath = car;
    item.width = 30;
    item.height = 30;
    item.id = item.transportTruckId;

    item.label = {
      color: "#000",
      bgColor: "#ffffff",
      textAlign: "center",
      padding: 8,
      fontSize: 14,
      borderRadius: "8",
      anchorX: -60,
      content: item.plateNumber,
      customCallout: {
        display: "ALWAYS",
      },
    };
    return item;
  });

  console.log(markers.value);

  latitude.value = data[0].latitude;
  longitude.value = data[0].longitude;

  //loading.value = true
};

const carData = ref({});

const productList = ref([]);

const deliveryList = ref([]);

const btnDelete = (index) => {
  let car = deliveryList.value[index];
  deliveryList.value.splice(index, 1);
  let index2 = productList.value.findIndex(
    (item) => car.productList[0].productId === item.productId
  );
  let index3 = productList.value[index2].deliveryList.findIndex(
    (item) => item.transportTruckId === car.transportTruckId
  );
  productList.value[index2].deliveryList.splice(index3, 1);
  if (productList.value[index2].deliveryList.length === 0) {
    productList.value.splice(index3, 1);
  }
  toast("删除成功");
};

onMounted(() => {
  loading.value = false;
  // uni.chooseLocation({
  //     latitude: latitude.value,
  //     longitude: longitude.value,
  //     fail: (err) => {
  //         console.log(err)
  //     }
  // })
});

let times = 0;

const markerTap = ({ detail }) => {
  let item = markers.value.find(
    (item) => item.id === detail.markerId && item.id
  );

  // #ifdef APP
  // uni.$emit("to-modal", toRaw(item) );
  // let subNvue = uni.getSubNVueById("orderInTransitModal"); //获取
  // subNvue.show();
  // #endif

  // #ifdef APP
  loading.value = true;
  // #endif
  modalData.value = toRaw(item);
  modalData.value && modal.value.open();
};

const modalData = ref({});

const modal = ref();

onMounted(() => {});

const btnConfirm = () => {
  // #ifdef APP
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  // #endif
  if (
    deliveryList.value.some(
      (item) => item.transportTruckId === modalData.value.transportTruckId
    )
  ) {
    toast("该车辆已分配");
    return;
  }
  let products = modalData.value.productList;
  products.forEach((item) => {
    let index = productList.value.findIndex(
      (line) => line.productId === item.productId
    );
    if (index === -1) {
      productList.value.push({
        ...item,
        deliveryList: [modalData.value],
      });
    } else {
      productList.value[index].productQty += item.productQty;
      productList.value[index].deliveryList.push(modalData.value);
    }
  });
  deliveryList.value.push(toRaw(modalData.value));
};
onMounted(() => {
  // modal.value.show()
});
const btnCancel = () => {
  // #ifdef APP
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  // #endif
  // modal.value.close();
};
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 40vh;
}
</style>
