<!--
 * @Date: 2024-07-22 14:05:34
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-26 14:25:54
 * @LastEditors: guojiecheng
-->
<template>
    <scroll-view scroll-y style="height: calc(100% - 48px);">
        <view class="warp p-2 overflow-auto h100p">
            <view class="p-3 box bg-white text-black">
                <view class="text-base font-bold mb-1">订单详情</view>
                <view v-for="({ name, key }, index) in [
                    { name: '订单编号', key: 'orderCode' },
                    { name: '协议编号', key: 'contractHeaderCode' },
                    { name: '提货单位', key: 'companyIdText' },
                    { name: '开票单位', key: 'companyIdText' },
                    { name: '提货方式', key: 'deliveryMethodText' },
                    { name: '可下单数', key: '' },
                    { name: '订单状态', key: 'statusText' },
                    { name: '创建时间', key: 'creationDate' },
                    { name: '订单描述', key: 'creationDate' },
                ]" :key="index" class="text-sm leading-7">
                    <view>
                        {{ name }}：{{ orderData[key] }}
                    </view>
                </view>
            </view>

            <view class="p-3 box bg-white text-black  mt-3">
                <view class="text-base font-bold">提货信息</view>
                <base-form :legend="[
                    {
                        label: '确认提货方式', key: 'deliveryModeText', required: true, type: 'select', options: [
                            { value: 'SELF_DELIVERY', label: '自行提货', },
                            { value: 'DISTRIBUTION', label: '配送发货', }
                        ], confirmFunc: ({ value, label }) => {
                            formData.deliveryMode = value
                            formData.deliveryModeText = label
                        }, clearFunc: () => {
                            formData.deliveryMode = ''
                            formData.deliveryModeText = ''
                        }
                    },
                    {
                        label: '是否不等价',
                        type: 'slot',
                        key: 'noPriceFlag'
                    }
                ]" v-model="formData" ref="form" :form-props="{ labelWidth: 110 }"
                    :form-item-props="{ required: false, borderBottom: false }">
                    <template #noPriceFlag>
                        <uv-switch v-model="formData.noPriceFlag"></uv-switch>
                    </template>
                </base-form>
            </view>
            <view class="p-3 box bg-white text-black  mt-3">
                <view class="text-base font-bold mb-2">产品信息</view>
                <view v-for="(item, index) in orderData.ecOrderLineListVo" :key="index" class="mb-4">
                    <view class="flex items-center leading-9" v-for="(line, subscript) in [
                    { name: '产品', key: 'productName' },
                    { name: '挂牌价', key: 'plateNumber' },
                    { name: '运费参考价', key: 'packQuantity' },
                    { name: '执行价', key: 'executionPrice' },
                    { name: '优惠方案', key: 'policyName', },
                    { name: '剩余量', key: 'phoneNumber' },
                    { name: '数量', key: 'orderQuantity' },
                    { name: '单位', key: 'uomCodeText' },
                    { name: '经营组织', key: 'description' },
                    { name: '提货地', key: 'description' },
                ]" :key="subscript">
                        <text class="w-20 text-right">{{ line.name }}：</text>
                        <uv-input :placeholder="`请输入${line.name}`" v-model="item[line.key]"
                            v-if="line.key === 'orderQuantity'" type="digit"></uv-input>
                        <text v-else>{{ item[line.key] }}</text>
                    </view>
                </view>
            </view>
        </view>
    </scroll-view>
    <uv-modal ref="modal" title="关于电商销售协议的确认协议条款" @confirm="() => btnSubmit()">
        <view class="slot-content">
            <scroll-view scroll-y style="height: 300px;">
                <view class="mb-2">
                    销售协议是公司面向价值客户的油品代储政策，客户基于市场预判锁定一定数量油品，承诺在有效执行期限内完成提货。公司针对该部分油品的实际储存、销售计划量预留存在一定的成本和经营费用，客户的执行失约，容易导致公司产品库存的滞压，错失高价值、高点销售时机。因此，针对销售协议执行不足的行为，采用以下措施加以正向引导。
                </view>
                <view class="mb-2">销售协议执行期内，协议油品无任何代储费用。针对执行不足的销售协议或销售协议拒不履行，将按照协议条款扣减协议全款的10%作为违约金。</view>
                <view class="mb-2 font-bold">违约金=（协议总量*协议价格）*10%。</view>
                <view class="mb-2">
                    1、协议一经生效，协议全款金额占用，除执行协议量外，不可申请退款，直至协议执行完毕；协议执行违约扣减的违约金自协议余款中自动扣除，协议终止，违约金扣款不做返还；</view>
                <view class="mb-2 ">
                    2、我方原因造成（如装置停工、库存不足、公司经营规划调整等）及不可控原因造成（自然灾害，地震、火山喷发等）的销售协议执行异常情况，可以特殊申请处理。</view>
                <view>请详细阅读上述锁价条款，谨慎锁价。</view>
            </scroll-view>

        </view>
    </uv-modal>
    <view class="flex justify-end p-2 bg-white">
        <uv-button type="primaty" plain size="small" :color="skin.primaryColor" @click="modal.open()">提交订单</uv-button>
    </view>
</template>
<script setup>
import { inject, onMounted, ref } from "vue";
import { simpleNavigateTo } from "@/common/util";
const skin = inject("skin")

import fetch from "@/config/fetch"
import { onLoad } from "@dcloudio/uni-app";
import { toast, warning } from "../../common/message";
import { baseForm } from "../../components";

const orderData = ref({})

const formData = ref({
    deliveryModeText: ''
})

const params = ref({})

const modal = ref()

const form = ref()

const getOrderInfo = async ({ orderHeaderId }) => {
    let { data } = await fetch.ecexOrderFlowController_getDetailForBuildOrder({
        orderHeaderId
    })

    data.ecOrderLineListVo.forEach(item => {
        item.policyName = item.policyName || "无"
    })
    for (let i in data) {
        orderData.value[i] = data[i]
    }
}

const btnSubmit = async () => {

    await form.value.validate().catch( err => {
            toast(err[0].message)
            return Promise.reject(err)
    })

    const { productId, contractCode } = params.value

    const { businessType, contractHeaderId, orderQuantity, ecOrderLineListVo, salesId, remoteWarehouse } = orderData.value

    for (let i = 0; i < ecOrderLineListVo.length; i++) {
        let item = ecOrderLineListVo[i]
        if (!item.orderQuantity) {
            warning('订单数量不能为空')
            return
        }
        if (isNaN(item.orderQuantity)) {
            warning('订单数量格式有误')
            return
        }
    }

    let res = await fetch.ecexOrderFlowController_saveDetailForBuildOrder({
        businessType, contractHeaderId, contractHeaderCode: contractCode, orderQuantity, productId, ecOrderLineListVo, salesId, remoteWarehouse
    })
    toast(res.msg)

    simpleNavigateTo('/pages_business/order/pay', { orderHeaderId: res.data?.orderHeaderId })
}


onLoad((options) => {
    params.value = options
    getOrderInfo(options)
})
</script>
<style lang="scss" scoped>
.warp {
    background: #efefef;

    .box {
        border-radius: 10px;
    }

    .car-box {
        border: 1px solid #efefef;
    }
}
</style>