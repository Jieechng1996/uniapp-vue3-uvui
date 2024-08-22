<template>
	<view class="container minH h100p">
        <uv-navbar title="协议汇总" :fixed="false" @leftClick="leftClick" :bgColor="skin.primaryColor"
            leftIconColor="#fff" rightIcon="plus-circle" @rightClick="() =>  simpleNavigateTo('/pages_business/contract/detail')">
            <template v-slot:right>
                <uv-icon size="20" name="plus-circle" color="#fff"></uv-icon>
            </template>
        </uv-navbar>
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
		<view class="bg-gray-100" style="height: calc(100% - 51px - 44px)">
			<base-list :url="api.ecMobileContractService_findPageForMobile" :params="params" ref="list" :pageRows="20">
				<template #default="{ list: listData }">
					<view class="px-3">
						<view class="px-3 py-2 mt-3 rounded-xl bg-white" v-for="item in listData" :key="item.customerId">
							<view @click="toDetail(item.contractHeaderId)">
								<view class="flex justify-between items-center">
									<text class="text-base text-blue-400">{{ item.contractCode }}</text>
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
								<view
									v-for="(line, subscript) in [
										{ key: 'salesContractNo', label: '协议号：' },
										{ key: 'contractTypeText', label: '协议类型：' },
										{ key: 'customerCodeText', label: '客户名称：' },
										{ key: 'createdDate', label: '创建时间' },
										{ key: 'createdByText', label: '创建人：' },
										{ key: 'startDateActive', label: '生效时间：' },
										{ key: 'endDateActive', label: '失效时间：' },
										{ key: 'closeFlagText', label: '关闭标识：' },
										{ key: 'dayQty', label: '单日控量：' },
										{ key: 'monthQty', label: '月度控量：' },
									]"
									:key="subscript">
									<view class="leading-6">{{ line.label }} {{ item[line.key] }}</view>
								</view>
								<!-- <view class="flex flex-wrap">
									<view
										v-for="(line, subscript) in [
											{ key: 'totalPackQuantity', label: '合同总量：' },
											{ key: 'actualOrderQty', label: '已实发量：' },
											{ key: 'notHaveActualQty', label: '未实发量：' },
											{ key: 'packQuantityLeft', label: '可下单量：' },
											{ key: 'totalOrderQty', label: '已下单量：' },
											{ key: 'orderedActualQty', label: '已下单实发量：' },
											{ key: 'orderButNotActualQty', label: '已下单未实发量：' },
											{ key: 'totalAmount', label: '已实发金额：' },
											{ key: 'actualAmount', label: '业务员：' },
											{ key: 'leftAmount', label: '未实发金额：' },
											{ key: 'availableAmount', label: '下单可用金额：' },
										]"
										:key="subscript"
										style="min-width: 50%">
										<view class="leading-6">{{ line.label }} {{ item.ecContractCalculateAmountVo[line.key] }}</view>
									</view>
								</view> -->
							</view>

							<view class="flex justify-end mt-2">
								<uv-button plain type="primary" size="small" class="ml-2" v-if="item.status == 'MAKING'" @click="btnSubmit(toRaw(item))">提交</uv-button>
								<uv-button plain type="primary" size="small" class="ml-2" v-if="item.status == 'APPROVED'" @click="btnConstractToOrder(toRaw(item))">合同下单</uv-button>
								<uv-button plain type="error" size="small" class="ml-2" v-if="item.status == 'APPROVED'" @click="btnClose(toRaw(item))">关闭</uv-button>
								<uv-button plain type="primary" size="small" class="ml-2" v-if="item.status == 'APPROVED'" @click="btnDelay(toRaw(item))">延期</uv-button>
							</view>
						</view>
					</view>
				</template>
			</base-list>
		</view>

		<view class="iconfont add_position icon-tianjia" style="font-size: 3rem; color: #0209dd" @click="toDetail(0)"></view>

		<uv-popup ref="popup" mode="bottom">
			<view class="px-4">
				<view class="p-4 text-center font-bold">请填写延期原因</view>
				<view>
					<base-form
						:legend="[
							{ key: 'delayReason', label: '延期原因', type: 'input', required: true, formItemProps: { required: false } },
							{ key: 'endDateActive', label: '失效时间', type: 'date', required: true, formItemProps: { required: false } },
						]"
						v-model="delayFormData"
						ref="delayForm"
                        :formProps="{ labelWidth: 100 }"
                        >
					</base-form>
				</view>
				<view class="flex my-2 justify-between">
					<uv-button class="mr-2" @click="popup.close()">取消</uv-button>
					<uv-button type="primary" @click="btnPopupDelay()">确定</uv-button>
				</view>
			</view>
		</uv-popup>
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

const popup = ref();

const currentItem = ref()

const delayFormData = ref({})

const leftClick = () => {
    uni.navigateBack()
}

const btnSubmit = async item => {
	let flowKey = "HT-TEST";
	let orgId = 261; //可根据实际的组织进行动态获取
	let menuId = 101440985;
	let flow = {
		saveonly: false,
		auditStatus: item.auditStatus || "DRAFT",
		processDefinitionKey: flowKey + "." + orgId,
		businessKey: item.id,
		orgId: orgId, // OU组织
		menuId, // 菜单id
		taskId: item.taskId || null, // 代办传入流程Id
	};
	let { msg } = await fetch.ecContractHeader_submitContractHeader({
		...flow,
		...item,
	});

	toast(msg);

	setTimeout(() => {
		list.value.refreshList();
	}, 1500);
};

const btnConstractToOrder = item => {
	simpleNavigateTo("/pages_business/order/detail", item);
};

const btnClose = item => {
	confirm("确定关闭该协议吗？", async () => {
		let { msg } = await fetch.ecContractHeader_closeContractHeader(item);
		toast(msg);
		setTimeout(() => {
			list.value.refreshList();
		}, 1500);
	});
};

const btnDelay = async (item) => {
    delayFormData.value = {
        delayReason: ''
    }
    currentItem.value = item
    popup.value.open() 
}

const delayForm = ref()

const btnPopupDelay = async () => {
    await delayForm.value.validate().catch(err => { toast(err[0].message) ; return Promise.reject(err) })
    let { msg } = await fetch.ecContractHeader_delayContractHeader({
        ...delayFormData.value,
        ...currentItem.value
    })
    toast(msg)
    popup.value.close()
    setTimeout(() => { list.value.refreshList() }, 1500);
}
</script>
<style lang="scss" scoped>
:deep(.uv-navbar__content__title){
    color: #fff;
}
:deep(.uv-icon__icon){
    color: #fff;
}

</style>
