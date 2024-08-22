<!--
 * @Date: 2
  components: { uvButton },
  components: { uvButton },
  components: { uvButton },024-08-16 16:16:36
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-20 18:09:40
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<scroll-view scroll-y class="h-full" style="height: calc(100% - 48px);">
			<view class="p-2 overflow-auto h100p bg-gray-100">
				<view class="p-3 rounded-xl bg-white text-black">
					<view class="text-base font-bold mb-1">区域报价信息</view>
					<view class="px-1">
						<base-form
							:disabled="disabled"
							:legend="[
								{ label: '报价区域', key: 'salesmanArea', required: true },
								{ label: '备注', key: 'remark' },
								{
									label: '业务人员',
									key: 'salesId',
									type: 'lov',
									api: api.ecCustomerProductGroup_findPagination,
									params: { salesIdFlag: 'Y', customerId: formData.customerId },
									searchKey: { key: 'salesIdText', placeholder: '请输入业务员名称' },
									keys: { key: 'salesId', value: 'salesIdText' },
									required: true,
								},
								{ label: '报价状态', key: 'statusText', type: 'text' },
								{ label: '提交时间', key: 'commitDate', type: 'text' },
							]"
							v-model="formData"
							ref="orderForm"
							:form-props="{ labelWidth: 110 }">
						</base-form>
					</view>
				</view>
				<view class="p-3 rounded-xl bg-white text-black mt-2">
					<view class="flex justify-between items-center">
						<view class="text-base font-bold mb-1">产品信息</view>
						<uv-button :disabled="disabled" :color="skin.primaryColor" plain size="small" @click="lineData.push({ yesterdayPrice: '' })">新增</uv-button>
					</view>

					<view v-for="(item, index) in lineData" :key="index" class="px-2">
						<base-form
							:disabled="disabled"
							:legend="[
								{ label: '产品编码', key: 'productCode', type: 'slot', required: true },
								{ label: '产品名称', key: 'productName', type: 'text' },
								{ label: '昨日挂牌价', key: 'yesterdayPrice', type: 'slot' },
								{ label: '主营挂牌价', key: 'mainPrice', type: 'slot', required: true },
								{ label: '主营成交价', key: 'bargainPrice', type: 'slot', required: true },
								{ label: '建议挂牌价', key: 'sugestPrice', type: 'slot', required: true },
								{ label: '主营零售价', key: 'retailPrice', type: 'slot', required: true },
								{ label: '民营零售价', key: 'privatePrice', type: 'slot', required: true },
							]"
							v-model="lineData[index]"
							ref="lineDataRef"
							:form-props="{ labelWidth: 110 }">
							<template #productCode>
								<view class="w100p">
									<uv-input
										v-model="lineData[index].productCode"
										placeholder="请选择"
										clearable
										readonly
										border="surround"
										suffixIcon="search"
										:disabled="disabled"
										@click="
											() => {
												productCodeIndex = index;
												productCode.showModal();
											}
										"></uv-input>
								</view>
							</template>
							<template #yesterdayPrice>
								<view class="red">{{ "￥" + item.yesterdayPrice }}</view>
							</template>
							<template #mainPrice>
								<uv-input v-model="lineData[index].mainPrice" placeholder="请输入" clearable border="surround" :disabled="disabled" type="digit">
									<template #suffix>
										<view class="red">元/吨</view>
									</template>
								</uv-input>
							</template>
							<template #bargainPrice>
								<uv-input v-model="lineData[index].bargainPrice" placeholder="请输入" clearable border="surround" :disabled="disabled" type="digit">
									<template #suffix>
										<view class="red">元/吨</view>
									</template>
								</uv-input>
							</template>
							<template #sugestPrice>
								<uv-input v-model="lineData[index].sugestPrice" placeholder="请输入" clearable border="surround" :disabled="disabled" type="digit">
									<template #suffix>
										<view class="red">元/吨</view>
									</template>
								</uv-input>
							</template>
							<template #retailPrice>
								<uv-input v-model="lineData[index].retailPrice" placeholder="请输入" clearable border="surround" :disabled="disabled" type="digit">
									<template #suffix>
										<view class="red">元/升</view>
									</template>
								</uv-input>
							</template>
							<template #privatePrice>
								<uv-input v-model="lineData[index].retailPrice" placeholder="请输入" clearable border="surround" :disabled="disabled" type="digit">
									<template #suffix>
										<view class="red">元/升</view>
									</template>
								</uv-input>
							</template>
						</base-form>
						<view class="flex justify-end mt-2">
							<!-- <uv-button plain type="primary" :disabled="disabled" size="small" class="mr-2" @click="btnSaveLine(index)">保存</uv-button> -->
							<uv-button plain type="primary" :disabled="disabled" size="small" @click="btnDelLine(index)">删除</uv-button>
						</view>
					</view>
					<base-dialog
						:search-key="{ key: 'productName', placeholder: '请输入产品名称' }"
						ref="productCode"
						:api="api.ecContractLine_ecinFindProByContract"
						:keys="{ key: 'productCode', value: 'productName' }"
						:params="{
							ruleId: formData.ruleId,
							enableFlag: 'Y',
							contractHeaderId: formData.contractHeaderId,
							customerId: formData.customerId,
						}"
						@callback="
							value => {
								lineData[productCodeIndex].unitPrice = value.unitPrice;
								if (formData.contractHeaderId) {
									lineData[productCodeIndex].executionPrice = value.executionPrice;
								} else {
									lineData[productCodeIndex].executionPrice = value.unitPrice;
								}
								lineData[productCodeIndex].productId = value.productId;
								lineData[productCodeIndex].contractLineId = value.contractLineId;
								lineData[productCodeIndex].contractHeaderId = value.contractHeaderId;
								lineData[productCodeIndex].productCode = value.productCode;
								lineData[productCodeIndex].productName = value.productName;
								lineData[productCodeIndex].uomCode = value.uomCode;
								lineData[productCodeIndex].invIdText = value.invIdText;
								lineData[productCodeIndex].categoryName = value.categoryName;
								lineData[productCodeIndex].taxRate = value.taxRate;
								lineData[productCodeIndex].stepName = value.stepName;
							}
						"
						use-content>
						<template #content="{ item }">
							<view>
								<view class="font-bold"> {{ item.productCode }} </view>
								<view> {{ item.productName }} </view>
							</view>
						</template>
					</base-dialog>
				</view>
			</view>
		</scroll-view>
		<view class="flex justify-between items-center py-2 px-3" v-if="!disabled">
			<uv-button :color="skin.primaryColor" size="small" plain @click="btnSave">保存</uv-button>
			<uv-button :color="skin.primaryColor" size="small" plain @click="btnSubmit">提交</uv-button>
		</view>
		<view v-else>
			<base-approval-btns :businessKey="formData.value.orderHeaderId" :procDefKey="'HT-TEST.261'" @onLoad="item => (showApprovel = item)" @finish="() => getDetail()"></base-approval-btns>
		</view>
	</view>
</template>
<script setup>
import { baseForm, baseDialog, baseApprovalBtns } from "@/components";
import { onLoad } from "@dcloudio/uni-app";
import { computed, inject, ref, toRaw } from "vue";
import api from "@/config/api";
import fetch from "@/config/fetch";
import { confirm } from "@/common/message";
import { toast, alert } from "../../common/message";
const skin = inject("skin");
const orderForm = ref();
const formData = ref({});
const salesContractNo = ref();
const ruleId = ref();
const lineData = ref([]);
const productCode = ref();
const productCodeIndex = ref(-1);
const disabled = computed(() => formData.value.status === "APPROVAL");

const showApprovel = ref(false);
onLoad(async options => {
	uni.setNavigationBarTitle({ title: !options.contractHeaderId ? "区域报价创建" : "区域报价编辑" });
	if (!options.contractHeaderId) {
		formData.value = {
			status: "MAKING",
			statusText: "制作中",
			voucherSource: "ECMOBOFFICE",
			voucherSourceText: "移动办公",
			allowExternalMakeOrder: "N",
			sellOnCreditFlag: "N",
		};
	} else {
		await getDetail(options.contractHeaderId);
		await getLineData();
	}
});
const contractChange = value => {
	formData.value.contractHeaderId = value.contractHeaderId;
	formData.value.salesContractNo = value.salesContractNo;
	//关闭弹窗
	//给销售组织  提货组织赋值
	formData.value.ruleId = value.ruleId;
	formData.value.companyId = value.companyId;
	formData.value.factoryId = value.factoryId;
	formData.value.invId = value.invId;
	formData.value.ruleIdText = value.ruleIdText;
	formData.value.companyIdText = value.companyIdText;
	formData.value.factoryIdText = value.factoryIdText;
	formData.value.invIdText = value.invIdText;

	//给业务员赋值 空值则不重新赋值
	if (!!value.salesId) {
		formData.value.salesId = value.salesId;
		formData.value.salesIdText = value.salesIdText;
	}

	//给客户赋值
	formData.value.customerId = value.customerId;
	formData.value.customerCode = value.customerCode;
	formData.value.customerName = value.customerCodeText;
	formData.value.customerCodeText = value.customerCodeText;

	formData.value.deliveryMode = value.deliveryMethod;
};

const lineDataRef = ref([]);

const btnSaveLine = async index => {
	await lineDataRef.value[index].validate().catch(err => {
		console.log(err);
		toast(err[0].message);
		return Promise.reject(err);
	});

	let { msg } = await fetch.ecContractLine_saveOrUpdateLine({
		lan: "CN",
		...formData.value,
		contractLineBoList: lineData.value,
	});

	toast(msg);

	setTimeout(async () => {
		await getDetail(formData.value.orderHeaderId);
		await getLineData();
	}, 1500);
};

const btnDelLine = item => {
	confirm("确定删除该行数据？", async () => {
		if (item.contractLineId) {
			let { msg } = await fetch.ecContractHeader_deleteLine({
				...formData.value,
				contractLineBoList: [item],
			});
			toast(msg);
			setTimeout(() => {
				getLineData();
			}, 1500);
		} else {
			lineData.value.splice(index, 1);
		}
	});
};

const btnSave = async () => {
	let { data, msg } = await fetch.ecContractHeader_findVoById({
		...formData.value,
	});

	alert(msg);

	setTimeout(() => {
		getDetail(data.orderHeaderId);
		getLineData();
	}, 1500);
};

const getLineData = async () => {
	let { data } = await fetch.ecContractLine_findPagination({
		orderHeaderId: formData.value.orderHeaderId,
		pageRows: 1000,
		pageIndex: 1,
	});
	lineData.value = data;
};
const getDetail = async orderHeaderId => {
	let { data } = await fetch.ecContractHeader_findVoById({
		orderHeaderId,
	});
	formData.value = data;
};

const btnSubmit = async () => {
	let flowKey = "HT-TEST";
	let orgId = 261; //可根据实际的组织进行动态获取
	let { msg } = await fetch.ecContractHeader_submitContractHeader({
		...{
			saveonly: false,
			auditStatus: "APPROVAL",
			processDefinitionKey: flowKey + "." + orgId,
			businessKey: formData.value.orderHeaderId,
			orgId: orgId, // OU组织
			menuId: "101440985", // 菜单id
			taskId: null, // 代办传入流程Id
		},
		...formData.value,
	});
	toast(msg);
	setTimeout(() => {
		uni.navigateBack();
	}, 1500);
};
</script>
<style lang="scss" scoped>
.list {
	height: calc(100% - 48px);
}
</style>
