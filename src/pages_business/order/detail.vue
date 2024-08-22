<!--
 * @Date: 2
  components: { uvButton },
  components: { uvButton },
  components: { uvButton },024-08-16 16:16:36
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-19 16:10:37
 * @LastEditors: guojiecheng
-->
<template>
	<view class="h100p">
		<scroll-view scroll-y style="height: calc(100% - 48px)">
			<view class="p-2 overflow-auto h100p bg-gray-100">
				<view class="p-3 rounded-xl bg-white text-black">
					<view class="text-base font-bold mb-1">订单信息</view>
					<view class="px-1">
						<base-form
							:disabled="disabled"
							:legend="[
								{ label: '业务类型', key: 'businessTypeText', disabled: true },
								{
									label: '客户名称',
									key: 'customerId',
									type: 'lov',
									api: api.ecpExCustomer_findNewListByPagination,
									params: { status: 'APPROVED' },
									searchKey: { key: 'customerName', placeholder: '请输入客户名称' },
									keys: { key: 'customerId', value: 'customerName' },
									required: true,
									callbackFunc: value => {
										orderData.customerCode = value.commerceRegNo;
										orderData.customerId = value.customerId;
										orderData.customerName = value.customerName;
										orderData.customerCodeText = value.customerName;
										orderData.salesmanId = value.salesmanId;
										orderData.salesmanCodeText = value.personName;
										orderData.shipTo = value.shipTo;
										orderData.commitUserCode = value.userName;
										orderData.commitUserId = value.salesmanId;
										orderData.commitUserName = value.personName;
										orderData.commitUserCodeText = value.personName;
									},
								},
								{ label: '协议编号', key: 'salesContractNo', type: 'slot' },
								{
									label: '业务人员',
									key: 'salesId',
									type: 'lov',
									api: api.ecCustomerProductGroup_findPagination,
									params: { salesIdFlag: 'Y', customerId: orderData.customerId },
									searchKey: { key: 'salesIdText', placeholder: '请输入业务员名称' },
									keys: { key: 'salesId', value: 'salesIdText' },
									required: true,
								},
								{ label: '提货规则', key: 'ruleId', type: 'slot', required: true },
								{ label: '销售组织', key: 'companyIdText', type: 'text' },
								{ label: '工厂', key: 'factoryIdText', type: 'text' },
								{ label: '仓库', key: 'invIdText', type: 'text' },
								{ label: '提货方式', key: 'deliveryMode', type: 'lookup', systemCode: 'BASE', lookupType: 'DELIVERY_MODE', required: true },
								{ label: '运输方式', key: 'transportMode', type: 'lookup', systemCode: 'BASE', lookupType: 'EC_TRANSPORT_MODE', required: true },
								{ label: '结算依据', key: 'settlementMethod', type: 'lookup', systemCode: 'BASE', lookupType: 'SETTLEMENT_METHOD', required: true },
								{ label: '备注', key: 'description', type: 'textarea' },
							]"
							v-model="orderData"
							ref="orderForm"
							:form-props="{ labelWidth: 110 }">
							<template #salesContractNo>
								<view class="w100p">
									<uv-input v-model="orderData.salesContractNo" placeholder="请选择" clearable readonly border="surround" suffixIcon="search" @click="() => salesContractNo.showModal()"></uv-input>
									<base-dialog
										:search-key="{ key: 'salesContractNo', placeholder: '请输入合同号' }"
										ref="salesContractNo"
										:api="api.ecContractHeader_findPagination"
										:keys="{ key: 'contractCode', value: 'salesContractNo' }"
										:params="{
											customerId: orderData.customerId,
											status: 'APPROVED',
										}"
										@callback="contractChange"
										use-content>
										<template #content="{ item }">
											<view>
												<view class="font-bold"> {{ item.contractCode }} </view>
												<view> {{ item.salesContractNo || "-" }} | {{ item.contractTypeText }} </view>
											</view>
										</template>
									</base-dialog>
								</view>
							</template>
							<template #ruleId>
								<view class="w100p">
									<uv-input v-model="orderData.ruleIdText" placeholder="请选择" clearable readonly border="surround" suffixIcon="search" @click="() => confirm('修改提货规则将会清空合同行', () => ruleId.showModal())"></uv-input>
									<base-dialog
										title="请选择人员"
										:search-key="{ key: 'ruleName', placeholder: '请选择提货规则' }"
										ref="ruleId"
										:api="api.baseDeliveryRule_findPagination"
										:keys="{ key: 'ruleId', value: 'ruleName' }"
										:params="{ enabledFlag: 'Y' }"
										@callback="
											value => {
												orderData.ruleId = value.ruleId;
												orderData.ruleIdText = value.ruleName;
												orderData.companyId = value.companyId;
												orderData.companyIdText = value.companyIdText;
												orderData.factoryId = value.factoryId;
												orderData.factoryIdText = value.factoryIdText;
												orderData.invId = value.invId;
												orderData.invIdText = value.invIdText;
												orderData.address = value.address;
											}
										">
									</base-dialog>
								</view>
							</template>
						</base-form>
					</view>
				</view>
				<view class="p-3 rounded-xl bg-white text-black mt-2">
					<view class="flex justify-between items-center">
						<view class="text-base font-bold mb-1">订单产品</view>
						<uv-button :disabled="!orderData.orderHeaderId" :color="skin.primaryColor" plain size="small" @click="lineData.push({ orderQuantity: '', productCode: '' })">新增</uv-button>
					</view>

					<view v-for="(item, index) in lineData" :key="index" class="px-2">
						<base-form
							:disabled="disabled"
							:legend="[
								{ label: '产品编码', key: 'productCode', type: 'slot', required: true },
								{ label: '产品名称', key: 'productName', type: 'text' },
								{ label: '当日挂牌价', key: 'unitPrice', type: 'text' },
								{ label: '单位', key: 'uomCode', type: 'text' },
								{ label: '执行价', key: 'executionPrice', type: 'text' },
								{ label: '优惠政策', key: 'stepName', type: 'text' },
								{ label: '仓库', key: 'invIdText', type: 'text' },
								{ label: '数量', key: 'orderQuantity', props: { type: 'digit' }, required: true },
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
										@click="
											() => {
												productCodeIndex = index;
												productCode.showModal();
											}
										"></uv-input>
								</view>
							</template>
						</base-form>
						<view class="flex justify-end mt-2">
							<uv-button plain type="primary" size="small" class="mr-2" @click="btnSaveLine(index)">保存</uv-button>
							<uv-button plain type="primary" size="small" @click="btnDelLine(index)">删除</uv-button>
						</view>
					</view>
					<base-dialog
						:search-key="{ key: 'productName', placeholder: '请输入产品名称' }"
						ref="productCode"
						:api="api.ecContractLine_ecinFindProByContract"
						:keys="{ key: 'productCode', value: 'productName' }"
						:params="{
							ruleId: orderData.ruleId,
							enableFlag: 'Y',
							contractHeaderId: orderData.contractHeaderId,
							customerId: orderData.customerId,
						}"
						@callback="
							value => {
								lineData[productCodeIndex].unitPrice = value.unitPrice;
								if (orderData.contractHeaderId) {
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
		<view class="flex justify-between items-center py-2 px-3">
			<uv-button :color="skin.primaryColor" size="small" plain @click="btnSave">保存</uv-button>
			<uv-button :color="skin.primaryColor" size="small" plain @click="btnSubmit">提交</uv-button>
		</view>
	</view>
</template>
<script setup>
import { baseForm, baseDialog } from "@/components";
import { onLoad } from "@dcloudio/uni-app";
import { computed, inject, ref, toRaw } from "vue";
import api from "@/config/api";
import fetch from "@/config/fetch";
import { confirm } from "@/common/message";
import { toast, alert } from "../../common/message";
const skin = inject("skin");
const orderForm = ref();
const orderData = ref({});
const salesContractNo = ref();
const ruleId = ref();
const lineData = ref([]);
const productCode = ref();
const productCodeIndex = ref(-1);
const disabled = computed(() => orderData.value.status === "APPROVAL")
onLoad(async options => {
	uni.setNavigationBarTitle({ title: !options.id ? "订单创建" : "订单详情" });
	if (!options.id) {
		orderData.value = {
			status: "MAKING",
			statusText: "制作中",
			businessType: "ORDINARY_ORDER",
			businessTypeText: "零散订单",
			voucherSource: "ECMOBOFFICE",
			voucherSourceText: "移动办公",
			...options,
		};
	} else {
		await getDetail(orderHeaderId);
		await getLineData();
	}
});
const contractChange = value => {
	orderData.value.contractHeaderId = value.contractHeaderId;
	orderData.value.salesContractNo = value.salesContractNo;
	//关闭弹窗
	//给销售组织  提货组织赋值
	orderData.value.ruleId = value.ruleId;
	orderData.value.companyId = value.companyId;
	orderData.value.factoryId = value.factoryId;
	orderData.value.invId = value.invId;
	orderData.value.ruleIdText = value.ruleIdText;
	orderData.value.companyIdText = value.companyIdText;
	orderData.value.factoryIdText = value.factoryIdText;
	orderData.value.invIdText = value.invIdText;

	//给业务员赋值 空值则不重新赋值
	if (!!value.salesId) {
		orderData.value.salesId = value.salesId;
		orderData.value.salesIdText = value.salesIdText;
	}

	//给客户赋值
	orderData.value.customerId = value.customerId;
	orderData.value.customerCode = value.customerCode;
	orderData.value.customerName = value.customerCodeText;
	orderData.value.customerCodeText = value.customerCodeText;

	orderData.value.deliveryMode = value.deliveryMethod;
};

const lineDataRef = ref([]);

const btnSaveLine = async index => {
	await lineDataRef.value[index].validate().catch(err => {
		console.log(err);
		toast(err[0].message);
		return Promise.reject(err);
	});

	let { msg } = await fetch.ecOrderLine_saveOrUpdateOrderLineList({
		lan: "CN",
		lineList: [toRaw(lineData.value[index])],
	});

	toast(msg);

	setTimeout(() => {
		getLineData();
	}, 1500);
};

const btnDelLine = item => {
	confirm("确定删除该行数据？", async () => {
		if (item.contractLineId) {
			let { msg } = await fetch.ecOrderLine_delOrderLineList({
				lineList: [item],
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
	let { data, msg } = await fetch.ecOrderHeader_saveOrUpdateOrderHeader({
		...orderData.value,
	});

	alert(msg);

	setTimeout(async () => {
		await getDetail(data?.orderHeaderId);
		await getLineData();
	}, 1500);
};

const btnSubmit = async () => {
	let flowKey = "DD-TEST";
	let orgId = 261; //可根据实际的组织进行动态获取

	let flow = {
		saveonly: false,
		auditStatus: "APPROVAL",
		processDefinitionKey: flowKey + "." + orgId,
		businessKey: options.id || options.orderId || null,
		orgId: orgId, // OU组织
		menuId: "101440919", // 菜单id
		taskId: null, // 代办传入流程Id
	};

	let { msg } = await fetch.ecOrderHeader_submitOrderHeader({
		...formData.data,
		...flow,
	});
	alert(msg);

	setTimeout(async () => {
		await getDetail(data?.orderHeaderId);
		await getLineData();
	}, 1500);
};

const getLineData = async () => {
	let { data } = await fetch.ecOrderLine_findPagination({
		orderHeaderId: orderData.value.orderHeaderId,
		pageRows: 1000,
		pageIndex: 1,
	});
	lineData.value = data;
};
const getDetail = async orderHeaderId => {
	let { data } = await fetch.ecOrderHeader_findVoById({
		orderHeaderId,
	});
	orderData.value = data;
};
</script>
<style lang="scss" scoped></style>
