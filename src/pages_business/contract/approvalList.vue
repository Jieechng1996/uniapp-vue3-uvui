<!--
 * @Date: 2024-08-19 16:42:51
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-19 17:07:54
 * @LastEditors: guojiecheng
-->
<template>
	<view class="container h100p">
		<view class="px-3 bg-white">
			<base-form :legend="[{ key: 'customerName', label: '客户名称', type: 'slot' }]" v-model="params" ref="searchForm" :formProps="{ labelWidth: 120 }">
				<template #customerName>
					<view class="flex">
						<uv-input v-model="params.customerName" placeholder="请选择" clearable border="none"></uv-input>
						<uv-button type="primary" size="small" @click="() => list.refresherList()" class="ml-2">搜索</uv-button>
					</view>
				</template>
			</base-form>
		</view>
		<view class="bg-gray-100" style="height: calc(100% - 51px )">
			<base-list :url="api.ecMobileContractService_findPageForMobile" :params="{...params , status : 'SUBMIT'}" ref="list" :pageRows="20">
				<template #default="{ list: listData }">
					<view class="px-3">
						<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in listData" :key="item.customerId">
							<view @click="toDetail(item.contractHeaderId)">
								<view class="flex justify-between items-center">
									<text class="text-base text-blue-400">{{ item.contractCode }}</text>
									<text class="t-submit">{{ item.statusText }}</text
									>
								</view>
								<view
									v-for="(line, subscript) in [
										{ key: 'salesContractNo', label: '协议号：' },
										{ key: 'contractTypeText', label: '协议类型：' },
										{ key: 'customerCodeText', label: '客户名称：' },
										{ key: 'createdDate', label: '创建时间' },
										{ key: 'createdByText', label: '创建人：' },
										{ key: 'startDateActive', label: '生效时间：' },
										{ key: 'endDateActive', label: '失效时间：' },
									]"
									:key="subscript">
									<view class="leading-6">{{ line.label }} {{ item[line.key] }}</view>
								</view>
							</view>

						</view>
					</view>
				</template>
			</base-list>
		</view>
	</view>
</template>
<script setup>
import { computed, getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import { onLoad, onNavigationBarButtonTap, onReachBottom } from "@dcloudio/uni-app";
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
import { toast, alert, confirm } from "@/common/message";
import api from "../../config/api";
import fetch from "@/config/fetch";
import store from "../../store";
import { simpleNavigateTo } from "@/common/util";
const skin = inject('skin')

const list = ref();

const params = ref({});

const toDetail = (contractHeaderId) => {
	simpleNavigateTo('/pages_business/contract/detail', { contractHeaderId , action: 'examine'})
}


</script>
<style lang="scss" scoped>
</style>
