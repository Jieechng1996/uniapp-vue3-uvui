<!--
 * @Date: 2024-08-21 14:03:02
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-21 15:18:19
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<uv-tabs :list="[{ name: '待认领车辆' }, { name: '已认领车辆' }]" @click="click"></uv-tabs>
		<view class="px-3 bg-white">
			<base-form
				:legend="[
					{ key: 'searchTime', label: '结算日期', type: 'date' },
					{ key: 'searchPlateNumber', label: '车牌号' },
					{ key: 'searchQuanlity', label: '实发量', props: { type: 'number' } },
					{ key: 'searchPoundNo', label: '榜单编号', type: 'slot' },
				]"
				v-model="params"
				ref="searchForm"
				:formProps="{ labelWidth: 120 }">
				<template #searchPoundNo>
					<view class="flex">
						<uv-input v-model="params.customerName" placeholder="请输入" clearable border="none"></uv-input>
						<uv-button type="primary" size="small" @click="() => list.refreshList()" class="ml-2">搜索</uv-button>
					</view>
				</template>
			</base-form>
		</view>
		<view style="height: calc(100% - 268px)" class="bg-gray-100">
			<base-list :url="api.driverInformation_findPagination" :params="params" v-model="listData" ref="list" :pageRows="20">
				<view class="px-3">
					<view class="px-3 py-2 mt-3 rounded-lg bg-white" v-for="item in listData" :key="item.deliveryHeaderId" @click="toDetail(item.orderHeaderId)">
						<view
							v-for="(line, subscript) in [
								{ key: 'licensePlateNumber', label: '车牌号：' },
								{ key: 'attribute12', label: '实发数量：' },
								{ key: 'deliveryNumber', label: '订单号：' },
								{ key: 'outTime', label: '结算时间：' },
							]"
							:key="subscript" class="leading-6">{{ line.label }} ：{{ item[line['key']] }}</view>
						<view class="leading-6">认领客户：{{ item.downCustomerSysName || item.downCustomerName }}</view>
					</view>
				</view>
			</base-list>
		</view>
	</view>
</template>
<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import { onLoad, onNavigationBarButtonTap, onReachBottom } from "@dcloudio/uni-app";
import api from "../../config/api";
import fetch from "../../config/fetch";
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
import { simpleNavigateTo } from '@/common/util'
const params = ref({});

const toDetail = () => {
    simpleNavigateTo('/pages_business/car/carClaimDetail')
}

</script>
<style lang="scss" scoped></style>
