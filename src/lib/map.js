import { get } from "../utils/httpServer";
import { warning } from "../utils/message";

/*
 * @Date: 2024-06-28 17:36:59
 * @Author: guojiecheng
 * @LastEditTime: 2024-06-29 15:59:14
 * @LastEditors: guojiecheng
 */
export const ak = '43V8gFATWTuw2w5tshjp0nwAWaP0OsAM'

export const initMap = () => new Promise((resolve, reject) => {
    if (window.BMap) {
        return
    }
    let script = document.createElement("script");
    script.src = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=baiduMapLoaded`;
    document.body.appendChild(script);
    window.baiduMapLoaded = () => {
        resolve()
    }
}) 

export const getCurrentLocation =  () => new Promise((resolve, reject) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position)
            resolve(position)
          },
          (error) => {
            warning(`Error occurred while retrieving location: ${error}` )
            reject(`Error occurred while retrieving location: ${error}` )
          },
          { enableHighAcuracy: true, timeout:5000,maximumAge: 0 }
        )
      } else {
        warning('Geolocation is not supported by this browser.')
        reject('Geolocation is not supported by this browser.')
        
      }
})

export const searchByKeyword = async (keyword) => {

    let res = await get('http://api.map.baidu.com/place/v2/search' , {
        query: keyword,
        output: 'json',
        region: '广州市',
        ak: ak,
      })
    warning(res.message)
    console.log(res)
}