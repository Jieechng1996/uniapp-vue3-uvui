<!--
 * @Date: 2024-07-29 18:16:02
 * @Author: guojiecheng
 * @LastEditTime: 2024-08-07 14:23:56
 * @LastEditors: guojiecheng
-->
<template>
    <view class="warp h100p p-3 overflow-auto">
        <view class="rounded-xl bg-white text-black p-4 leading-6">
            <view>
                距离结束：
                <text class="red">{{ time.date }}</text>
                <text>天</text>
                <text class="red">{{ time.hour }}</text>
                <text>时</text>
                <text class="red">{{ time.minute }}</text>
                <text>分</text>
                <text class="red">{{ time.second }}</text>
                <text>秒</text>
            </view>
            <view>
                <uv-image :src="activityData.shortPicUrl" width="100%" height="200" mode="aspectFit"></uv-image>
            </view>
            <view class="gold text-base leading-7">
                {{ activityData.activityName }}
            </view>
            <view>
                公示数量： {{ activityData.publishedQuantity }} {{ activityData.unit }}
            </view>
            <view>
                申报吨数限制：{{ activityData.activityDataNumFrom }}~{{ activityData.activityDataNumTo }}
            </view>
            <view>
                起拍价格：{{ activityData.unitPrice }}￥
            </view>
            <view>
                最高价格：{{ activityData.countNum ? activityData.unitPrice + '￥' : priceData.maxPrice + '￥' }}
            </view>
            <view>
                最低价格：{{ !activityData.countNum ? activityData.unitPrice + '￥' : priceData.minPrice + '￥' }}
            </view>
            <view class="red">
                申报总量：{{ priceData.allQuantity }} {{ activityData.unit }}
            </view>
            <view>
                最低提货量：{{ activityData.minPickNum }} {{ activityData.unit }}
            </view>
            <view class="red">
                最低提货量说明：当有效申报量不足最低提货量时，本次申报结果无效，请随时关注竞价情况
            </view>
            <view>
                加价幅度：<text class="red font-bold"> {{ priceData.allquantity > activityData.publishedQuantity ?
                    activityData.auctionMargin : 0 }} </text>
            </view>
            <view class="red">
                说明：当申报总量等于公示量后，且倒计时小于等于10分钟，提交竞价，倒计时会再次重置为10分钟
            </view>
            <!-- <view class="text-base font-bold my-2">
                活动规则说明
            </view>
            <view class="rounded p-2 bg-gray-100">
                <uv-empty class="py-5" v-if="activityData.remark"></uv-empty>
                <view v-else>{{ activityData.remark }}</view>
            </view>
            <view class="mt-3">
                <uv-button :color="skin.primaryColor">参与活动</uv-button>
            </view> -->
        </view>

        <view class="rounded-xl bg-white text-black p-4 leading-6 mt-3">
            <view class="text-base font-bold">我的申报</view>
            <view class="px-2">
                <base-form :legend="[
                    { label: '申 报 量', key: 'approveQuentity', props: { type: 'digit' } },
                ]" v-model="formData" ref="form" :form-props="{ labelWidth: 80 }" :rules="rules"></base-form>
            </view>
            <view class="mt-3">
                <uv-button :color="skin.primaryColor" @click="btnSubmit">参与竞价</uv-button>
            </view>
        </view>
        <view class="rounded-xl bg-white text-black p-4 leading-6 mt-3">
            <view class="text-base font-bold">竞价流程</view>
            <view class="pt-2">
                <uv-steps current="-1" direction="column" :inactiveColor="skin.primaryColor">
                    <uv-steps-item
                        v-for="(title, index ) in ['竞价权限申请', '立即参与', '提交电话号码', '参与竞价', '完成竞价', '生成活动协议/订单(10分钟内)']"
                        :key="index" :title="title"></uv-steps-item>
                </uv-steps>
            </view>
        </view>
        <view class="rounded-xl bg-white text-black p-4 leading-6 mt-3">
            <uv-tabs :list="[{
                    name: '有效出价记录',
                }, {
                    name: '竞价规则介绍',
                }]" :current="current" @change="({ index }) => current = index" :lineColor="skin.primaryColor"
                :activeStyle="skin.primaryColorText"></uv-tabs>
            <view class="mt-2">
                <base-list :url="api.ecpFightAlone_getFightAloneInfo" ref="list" v-if="current == 0">
                    <template #default="{ list }">
                        <view class="px-1 py-2 border border-solid border-gray-200" v-for="(item, index) in list"
                            :key="index">
                            <view class="flex items-center leading-7" v-for="(line, subscript) in [
                    { name: '编号', key: 'fightAloneNumber' },
                    { name: '参与竞拍单位', key: 'customerName' },
                    { name: '竞拍数量', key: 'quantity' },
                    { name: '有效数量', key: 'actualQuantity' },
                    { name: '价格', key: 'price' },
                    { name: '状态', key: 'statusText' },
                    { name: '参与竞拍时间', key: 'creationDate' }
                ]" :key="subscript">
                                <text class="w-28 text-right">{{ line.name }}：</text>
                                <text>{{ item[line.key] }}</text>
                            </view>
                        </view>
                    </template>
                </base-list>
                <view v-if="current == 1" class="p-2 border border-solid border-gray-200">
                    <view class="text-center text-sm font-bold">竞价交易规则</view>
                    <view>竞价商品：每次活动商品视情况而定</view>
                    <view>竞买人条件：满足参与活动设定权限并且未曾违反竞价规则。</view>
                    <view class="font-bold">竞价术语说明</view>
                    <view>1.起拍价格：卖方根据不同商品而设置的交易起始价格，在交易开始前公开明示，买方竞价不得低于该价格。</view>
                    <view>2.公示量：卖方给出此次竞价活动用于竞价的商品数量。</view>
                    <view>3.最高价格：目前所有可获得商品的买家的竞价价格中最高价。</view>
                    <view>4.最低价格：目前所有可获得商品的买家的竞价价格中最低价。</view>
                    <view>5.申报总量：目前所有可获得商品的买家申报量之和，申报总量小于等于公示量。</view>
                    <view>6.申报量：买家参与本次竞价所申请的商品数量，申报量小于等于公示量。</view>
                    <view>7.竞价幅度：买家通过竞价幅度，形成一次竞价价格。</view>
                    <view>8.竞价吨数限制：由卖家对所填写申报量设定的一个范围，范围最小值大于0，最大值小于等于公示量。竞价过程中，买家第一次申报成功后，可再次进行申报，申报量需大于已申报量小于等于公示量。
                    </view>
                    <view class="font-bold">倒计时规则</view>
                    <view>
                        本次拍卖活动设置出价倒计时功能，当申报总量等于公示量（所有参与者对某个竞价活动商品的竞价总量不低于该竞价活动商品所发布的公示量时），倒计时小于等于10分钟且未结束时，有买家提交竞价，倒计时时间变成10分钟，即相应的活动结束时间推迟。
                    </view>
                    <view class="font-bold">竞价协议</view>
                    <view>1.竞价活动结束后，系统自动给竞价成功的买方生成竞价协议，每位成功竞价的买家在一个竞价活动中只能生成一份协议。如在本次竞价活动中申报过两种以上有效价格，最终成交价按照加权平均价执行。
                    </view>
                    <view>2.若买家账户上有足够的余额，系统自动设定竞价协议状态为已审批，协议展示在外部商城可执行协议中；若余额不足，系统自动设定竞价协议状态为已提交，协议展示在外部商城的外部特殊协议中。
                    </view>
                    <view>3.由于已提交状态的竞价协议于竞价结束后最近的早上七点失效，请余额不足的买家及时充值，否则将影响后期参与竞价活动的信用度，无权限参与新的竞价活动。</view>
                </view>
            </view>
        </view>
    </view>

</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app"
import fetch from "@/config/fetch"
import api from "../../config/api"
import { inject, onUnmounted, ref ,toRaw} from "vue"
import dayjs from "dayjs"
import { baseForm, baseList } from "@/components"
import { toast, confirm, prompt } from "../../common/message"

const skin = inject("skin")

const activityData = ref({})

const priceData = ref({})

const formData = ref({
    approveQuentity: ''
})

const current = ref(0)

const form = ref()

const list = ref()

const time = ref({
    date: '00',
    hour: '00',
    minute: '00',
    second: '00'
})

let timer = null

const getDetail = async () => {

    let { data } = await fetch.ecexActivity_getActivityDetail({})

    activityData.value = data[0]

    timer = setInterval(() => {
        let times = dayjs().valueOf() - dayjs(activityData.value.endDateActive).valueOf()
        time.value.date = dayjs(times).format('DD')
        time.value.hour = dayjs(times).format('HH')
        time.value.minute = dayjs(times).format('mm')
        time.value.second = dayjs(times).format('ss')
    }, 1000);
}

const getPrice = async () => {
    let { data } = await fetch.ecexActivity_getAuctionMaxPrice({})
    priceData.value = data
}

const rules = ref({
    approveQuentity: [
        {
            required: true,
            message: '申报量为必填字段',
            trigger: ['blur', 'change']
        },
        {
            validator: (rule, value, callback) => !(value && !/^[0-9]+(.[0-9]{1,2})?$/.test(value)), message: '申报量格式错误', trigger: ['change']
        }
    ],
})

const btnSubmit = async () => {
    const { quantitys, acPrice, currentPrice, activityPrice, productId, orgId, activityId } = toRaw(activityData)
    await form.value.validate().catch(e => {
        toast(e[0].message)
            ; return Promise.reject(e)
    })
    await fetch.ecexActivity_getAuctionPurchaseContentActivity({ activityId })

    await fetch.ecexActivity_getSatisfyStatusAuctionActivity({ activityId }).catch(err => {
        if (err.status !== 'F') {
            err.data.map(item => {
                if (item.dimOperator == 'not in' || item.dimOperator == '<>') {
                    item.ruleDimValue = '(' + item.ruleDimOperators + ')'
                }
            })
            toast(err.msg)
        }
        return Promise.reject(err)
    })

    prompt({
        title: '确定竞价',
        msg: '您当前量的竞价价格预计为：￥' + currentPrice + acPrice + ',价格随时可能上升,请您分秒必争!',
        type: 'confirm',
        confirmText: '我要竞价',
        callBack: async () => {
            let res = await fetch.ecexActivity_createRecordByAuctionActivity({
                activityId,
                productId: productId,
                varPrice: currentPrice + acPrice,
                price: currentPrice + acPrice,
                qty: quantitys,
                activityPrice
            }).catch(err => {
                getAuctionPrice()
                Promise.reject(err)
            })

            toast(res.msg),

            getDetail()

            getPrice()

            list.value?.refreshList()

        },
        cancelCallBack: () => {

        }
        
    })
}

onUnmounted(() => {
    clearInterval(timer)
})

onLoad(() => {
    getDetail()
    getPrice()
})

</script>
<style lang="scss" scoped>
.warp {
    background: #efefef;
}
</style>