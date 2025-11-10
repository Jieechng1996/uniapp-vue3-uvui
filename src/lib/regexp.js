/*
 * @Date: 2023-08-02 15:14:41
 * @Author: guojiecheng
 * @LastEditTime: 2025-10-20 15:54:08
 * @LastEditors: guojiecheng
 */
export const phoneNumber = /^(1)\d{10}$/

export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

//export const idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数，最后一位是校验位，可能为数字或字符X

// export const plateNumber = /(^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$)|(^[\u4e00-\u9fa5]{1}16[^a-z_A-Z_0-9_?_*][A-Z_0-9]{5}$)/;//验证车牌号

// export const plateNumber = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9学警港澳]{1}$/

export const cash = /^(0|[1-9]\d*)(\.\d{1,2})?$/

export const chinese = /^[\u4e00-\u9fa5]{0,}$/

export const tel = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/

export const image = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico)(\?.*)?$/i;

export const validateIdCardNum = (value) => {
    // 非法字符串
    if (typeof value !== 'string') return false
    // 所有身份证前两位代表的是地区
    const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
    const birthday = value.substr(6, 4) + '/' + Number(value.substr(10, 2)) + '/' + Number(value.substr(12, 2))
    const d = new Date(birthday)
    const newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate())
    const currentTime = new Date().getTime()
    const time = d.getTime()
    // 身份证系数列表
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    // 设定身份证通过相加运算得到值对应的身份证最后一位的列表
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let sum = 0
    // 非法身份证
    if (!/^\d{17}(\d|x)$/i.test(value)) return false
    // 非法地区 非法地区
    if (city[value.substr(0, 2)] === undefined) return false
    // 非法生日
    // if (time >= currentTime || birthday !== newBirthday) return false
    // 计算当前身份证最后一位的值
    for (let i = 0; i < 17; i++) {
        sum += value.substr(i, 1) * arrInt[i]
    }
    const residue = arrCh[sum % 11]
    // 非法身份证哦
    if (residue !== value.substr(17, 1)) return false

    return true
}

export const idCard = {
    test: ( value ) => validateIdCardNum(value)
}

export const password = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{6,16}$/

export const handleLicenseNo = (value) => {
    let c_reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9港澳]{1}$/,
        x_reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{6}$/, // (([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))
        l_reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[1-3]{1}[0-9]{2}[0-9A-Z]{2}领$/u,
        g_reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[挂]$/u,
        sg_reg = /^[1-3]{1}[0-9]{2}[0-9A-Z]{3}使$/u
    
    if (!value) return false
    if (value.length == 7) {
        if (!c_reg.test(value) && !sg_reg.test(value) && !l_reg.test(value) && !g_reg.test(value)) {
            return false
        }
    } else if (value.length == 8) {
        if (!x_reg.test(value)) {
            return false
        }
    } else {
        value = ''
        return false
    }
    return true
}

export const plateNumber = {
    test: (value) => handleLicenseNo(value)
}

export default {
    phoneNumber,
    email,
    idCard,
    plateNumber,
    cash,
    password
}