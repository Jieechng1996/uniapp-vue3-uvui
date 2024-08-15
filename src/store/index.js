/*
 * @Date: 2023-07-17 11:37:43
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-23 11:55:48
 * @LastEditors: guojiecheng
 */
import { toRaw } from 'vue';
import { createStore } from 'vuex'
// Create a new store instance.
export default createStore({
    state() {
        return {
            userInfo: {},
            loginInfo: {},
            lookupCodeList: [],
            shoppingCartCount: 0,
            customerList: [],
            primaryCustomer: {}
        }

    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data
            uni.setStorageSync('userInfo', data);
        },
        REMOVE_USER_INFO(state) {
            state.userInfo = {}
            uni.removeStorageSync('userInfo')
        },
        SET_LOGIN_INFO(state, data) {
            state.loginInfo = data
            uni.setStorageSync('loginInfo', data);
        },
        REMOVE_LOGIN_INFO(state) {
            state.loginInfo = {}
            uni.removeStorageSync('loginInfo')
        },
        SET_LOOKUP_CODE_LIST(state, data) {
            state.lookupCodeList = data
            // uni.setStorageSync('lookupCodeList', data);
        },
        REMOVE_LOOKUP_CODE_LIST(state) {
            state.lookupCodeList = []
            // uni.removeStorageSync('lookupCodeList')
        },
        CONCAT_LOOKUP_CODE_LIST(state, data) {
            state.lookupCodeList = [...state.lookupCodeList, ...data]
            uni.setStorageSync('lookupCodeList', state.lookupCodeList)
        },
        
    },
    actions: {
        INIT_BASE_INFO({ commit }) {
            this.state.userInfo = toRaw(uni.getStorageSync('userInfo'))
            this.state.lookupCodeList = uni.getStorageSync('lookupCodeList') || []
            this.state.loginInfo = toRaw(uni.getStorageSync('loginInfo'))
            //commit('SET_USER_INFO', storage.getItem('userInfo') || {})
            // commit('SET_LOGIN_INFO', storage.getItem('lgoinInfo') || {})
            // commit('SET_LOOKUP_CODE_LIST', storage.getItem('lookupCodeList') || [])
            // commit('SET_CUSTOMER_LIST', storage.getItem('customerList') || [])
            // commit('SET_PRIMARY_CUSTOMER', storage.getItem('primaryCustomer') || {})
            // commit('SET_SHOPPING_CART_COUNT', storage.getItem('shoppingCartCount') || 0)
        },

        JUDGE_CRU_STATUS() {
            return new Promise((resolve, reject) => {
                switch (this.state.userInfo.curStatus) {
                    case 1:
                        ElMessageBox.alert('抱歉,个人用户没有购买权限', '操作异常', {
                            confirmButtonText: '立即注册企业用户', cancelButtonText: '关闭',
                            callback: (action) => {
                                router.push({ name: 'register' })
                            },
                        })
                        reject()
                        break;
                    case 2:
                        ElMessageBox.alert('等待企业用户审核通过后方可使用!', '抱歉,个人用户暂无权访问！')
                        reject()
                        break
                    case 3:
                        resolve()
                        break
                    case 4:
                        ElMessageBox.alert('您注册了企业账户，但尚未提交企业相关资料', '请补全您的企业资料', {
                            callback: (action) => {
                                router.push({ name: 'regEnterprise' })
                            },
                        })
                        reject()
                        break
                    case 5:
                        ElMessageBox.alert('您的证书已过期，请重新提交相关资料', '操作异常', {
                            callback: (action) => {
                                router.push({ name: 'regEnterprise' })
                            },
                        })
                        reject()
                        break
                    case 6:
                        ElMessageBox.alert('您提交的资料已被拒绝，请修改后重新提交', '操作异常', {
                            callback: (action) => {
                                router.push({ name: 'regEnterprise' })
                            },
                        })
                        reject()
                        break
                    case 7:
                        ElMessageBox.alert('您的资料已提交，请耐心等候审核', '提示')
                        reject()
                        break
                    default:
                        ElMessage({
                            message: '请登录',
                            type: 'warning',
                        })
                        reject()
                        break;
                }

            })
        },
        async GET_SHOPPING_CART_COUNT({ commit }) {
            let { count } = await fetch.ecpExShoppingCart_findPagination({
                userId: this.state.userInfo.userId
            })
            //this.state.shoppingCartCount = count

            storage.setItem('shoppingCartCount', count)
            
            commit('SET_SHOPPING_CART_COUNT', count)
        },

        async GET_CUSTOMER_LIST({ commit }) {
            
            let { data } = await fetch.ecexCustomer_findCustomerByUser({})

            storage.setItem('customerList', data)

            commit('SET_CUSTOMER_LIST', data)

        },

        async INIT_PRIMARY_CUSTOMER({ commit }){

            let { data } = await fetch.ecexUserCustomer_getMainCustomerFromSession({})

            storage.setItem('primaryCustomer', data)
            
            commit('SET_PRIMARY_CUSTOMER', data)

        },

        CLEAR_BASE_INFO({ commit }) {
            commit('REMOVE_USER_INFO')
            commit('REMOVE_LOOKUP_CODE_LIST')
        }
    },
    getters: {

    }
})