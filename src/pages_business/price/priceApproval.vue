<!--
 * @Date: 2024-08-20 10:30:44
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-20 15:38:38
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h-full overflow-auto">
		<view class="bg-gray-100" style="height: calc(100% - 48px)">
			<base-list :url="api.ecpInProductPriceH_findPagination" ref="list" @onLoad="dataOnload">
				<template #default>
					<view class="px-3">
						<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in dataList" :key="item.transNumber">
							<view>
								<view class="flex justify-between items-center">
									<text class="text-base text-blue-400">{{ item.priceNumber }}</text>
									<text class="text-red-800">{{ item.activityStatusText }}</text>
								</view>
								<view
									v-for="(line, subscript) in [
										{ key: 'priceName', label: '产品名称' },
										{ key: 'orgIdText', label: '销售组织：' },
										{ key: 'priceTypeText', label: '价目表类型：' },
										{ key: 'createdByText', label: '业务员：' },
										{ key: 'currencyCode', label: '币种：' },
										{ key: 'startDateActive', label: '生效日期起：' },
										{ key: 'endDateActive', label: '失效日期至：' },
									]"
									:key="subscript">
									<view class="leading-6">{{ line.label }} {{ item[line.key] }}</view>
								</view>
								<view class="flex border mt-2 py-1 px-2" :class="{ 'border-red-300': line.checked }" v-for="(line, subscript) in item.list.filter(item => item.status === 'APPROVING')" :key="subscript" @click="line.checked = !line.checked">
									<view class="mt-1 mr-1"><checkbox :checked="line.checked" disabled /></view>
									<view class="flex-1">
										<view class="leading-6 flex flex-wrap">
											<view style="min-width: 50%">产品名称：{{ line.productIdText }}</view>
											<view style="min-width: 50%">产品简称：{{ line.productShortName }}</view>
											<view style="min-width: 50%">产品区域：{{ line.productArea }}</view>
										</view>
										<view class="flex">
											<view class="flex-1">业务标识：{{ line.businessFlag }}</view>
											<view class="flex-1"
												><text :class="line.diffPrice >= 0 ? 'ion-arrow-up-a' : 'ion-arrow-down-a'"></text><text>{{ line.diffPrice }}</text></view
											>
										</view>
										<view class="flex">
											<view class="flex-1" style="color: #e42112">今日价格：{{ line.unitPrice }}</view>
											<view class="flex-1">昨日价格：{{ line.hisPrice }}</view>
										</view>
										<view class="flex">
											<view class="flex-1" style="color: #e42112">今日价格：{{ line.unitPrice }}</view>
											<view class="flex-1">昨日价格：{{ line.hisPrice }}</view>
										</view>
										<view class="flex">
											<view class="flex-1">优质价格：{{ line.highPrice }}</view>
											<view class="flex-1">备注价格：{{ line.remarkPrice }}</view>
										</view>
										<view class="flex">
											<view class="flex-1">最高挂牌价格：{{ line.highPrice }}</view>
											<view class="flex-1">发改委价格：{{ line.fgwPrice }}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
			</base-list>
		</view>
		<view class="flex justify-between items-center py-2 px-3">
			<view>
				<checkbox :checked="checkedAll"  @click="btnCheckdedAll"/>全选
			</view>
			<view class="flex">
				<uv-button type="error" size="small" plain @click="btnSave" class="mr-4">驳回</uv-button>
				<uv-button type="primary" size="small" plain @click="btnSubmit">审批</uv-button>
			</view>
		</view>
	</view>
</template>
<script setup>
import api from "@/config/api";

import { baseList, baseForm } from "@/components";

import { computed, getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import { onLoad, onNavigationBarButtonTap, onReachBottom } from "@dcloudio/uni-app";
import fetch from "@/config/fetch";
import { toast, warning } from "../../common/message";
const skin = inject("skin");
const dataList = ref([]);

const dataOnload = list => {
	dataList.value = list;
};

const checkedAll = ref(false);

const btnCheckdedAll = () => {
    checkedAll.value = !checkedAll.value;
    dataList.value.forEach(item => {
        item.list.forEach(line => {
            line.checked = checkedAll.value;
        });
    });
}
</script>
<style lang="scss" scoped>
:deep(.uni-checkbox-input-disabled) {
	background: #fff !important;

	svg path {
		color: #007aff;
		fill: #007aff;
	}
}
</style>
