<!--
 * @Date: 2024-08-19 16:16:50
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-19 16:29:15
 * @LastEditors: guojiecheng
-->
<template>
	<view class="container h100p">
		<!-- <view class="header box_shadow w100 white">
        <search-bar :data="searchBarConfig" @search="search"></search-bar>
      </view> -->
		<view class="px-3 bg-white">
			<base-form
				:legend="[
					{ key: 'businessType', label: '订单类型', type: 'lookup', lookupType: 'EC_ORDER_TYPE', systemCode: 'BASE' },
					{ key: 'customerName', label: '客户名称', type: 'slot' },
				]"
				v-model="params"
				ref="searchForm"
				:formProps="{ labelWidth: 120 }">
				<template #customerName>
					<view class="flex">
						<uv-input v-model="params.customerName" placeholder="请选择" clearable border="none"></uv-input>
						<uv-button type="primary" size="small" @click="() => list.refresherList()" class="ml-2">搜索</uv-button>
					</view>
				</template>
			</base-form>
		</view>

		<view style="height: calc(100% - 109px)" class="bg-gray-100">
			<base-list :url="api.ecOrderHeader_findPagination" :params="params" v-model="listData" ref="list" :pageRows="20">
				<view class="px-3">
					<view class="px-3 py-2 mt-3 rounded-lg bg-white" v-for="item in listData" :key="item.deliveryHeaderId" @click="toDetail(item.orderHeaderId)">
						<view class="flex justify-between items-center">
							<text class="text-base text-blue-400">{{ item.businessTypeText }}</text>
							<text
								:class="{
									't-approved': item.status === 'APPROVED',
									't-rejected': item.status === 'REJECTED',
									't-making': item.status === 'MAKING',
									't-closed': item.status === 'CLOSED',
									't-colsing': item.status === 'COLSING',
									't-deleted': item.status === 'DELETED',
									't-effect': item.status === 'EFFECT',
									't-pending_cancel': item.status === 'PENDING_CANCEL',
									't-submit': item.status === 'SUBMIT',
									't-cancelled': item.status === 'CANCELLED',
								}"
								>{{ item.statusText }}</text
							>
						</view>
						<view class="leading-6">合同编号：{{ item.orderCode || "-" }}</view>
						<view
							v-for="(line, subscript) in [
								{ key: 'companyIdText', label: '销售组织' },
								{ key: 'customerCodeText', label: '客户名称' },
								{ key: 'commitUserCodeText', label: '业务员' },
								{ key: 'commitDate', label: '提交日期' },
                                { key: 'invIdText', label: '提货单位' },
								{ key: 'orderDate', label: '提货截止时间' },
								{ key: 'createdByText', label: '制作人' },
							]"
							:key="subscript">
							<view class="leading-6">{{ line.label }} ：{{ item[line.key] }}</view>
						</view>
					</view>
				</view>
			</base-list>
		</view>
		<view class="iconfont add_position icon-tianjia" style="font-size: 3rem; color: #0209dd" @click="toDetail(0)"></view>
	</view>
</template>
<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import { onLoad, onNavigationBarButtonTap, onReachBottom } from "@dcloudio/uni-app";
import api from "../../config/api";
import fetch from "../../config/fetch";
import { baseForm, baseList, baseDialog, baseLookupCode } from "@/components";
</script>
<style lang="scss" scoped></style>
