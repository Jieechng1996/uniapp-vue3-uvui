import { error } from "./message";

/*
 * @Date: 2024-07-12 15:27:30
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-12 15:31:55
 * @LastEditors: guojiecheng
 */
export const getCurrentLocationByBmap = () => new Promise((resolve , reject) => {
    uni.showLoading({ title: '加载中',   mask: true  })
    //#ifdef H5
    let geolocation = new BMapGL.Geolocation();
    geolocation.enableSDKLocation(); // 启用SDK定位
    geolocation.getCurrentPosition(position => {
        uni.hideLoading()
        if (geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
            let geocoder = new BMapGL.Geocoder();
            geocoder.getLocation(new BMapGL.Point(position.longitude, position.latitude), (result) => {
                if (result) {
                    resolve(result)
                }
            });
        } else {
            error('获取定位失败:', this.geolocation.getStatus())
        }
    }, { enableHighAccuracy: true }); // 配置参数
})