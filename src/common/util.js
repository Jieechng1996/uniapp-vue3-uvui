import api from "../config/api";
import { error, warning } from "./message";

// const QQMapuni = require('./qqmap-uni-jssdk.min.js');

// const qqmapsdk = new QQMapuni({
//   key: 'XWBBZ-LB4W2-ZA5U6-CBO6G-GV42O-WDFK7'
// });

export const updateMiniProgram = () => {
  if (uni.canIUse("getUpdateManager")) {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) { // 请求完新版本信息的回调
      console.log(res)
      console.log(uni.getAccountInfoSync())
    });
    updateManager.onUpdateReady(function () {
      message.prompt({
        msg: '新版本已经准备好，是否重启应用？',
        type: 'warning',
        title: '更新提示',
        callBack: () => {
          updateManager.applyUpdate()
        }
      })
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      message.prompt({
        msg: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        type: 'warning',
        title: '已经有新版本了哟~'
      })
    });
  } else {
    console.log('获取失败')
  }
}

export const getLocation = () => new Promise((resolve, reject) => {
  qqmapsdk.reverseGeocoder({
    success: ({ result }) => {
      resolve({
        latitude: result.location.lat,
        longitude: result.location.lng,
        address: result.formatted_addresses.standard_address,
        result
      })
    },
    fail: ({ message }) => {
      error(message),
        reject(message)
    }
  })

})

export const calculateDistance = (from, to, mode = 'straight') => new Promise((resolve, reject) => {
  qqmapsdk.calculateDistance({
    from, //若起点有数据则采用起点坐标，若为空默认当前地址
    to: [to], //终点坐标,
    mode,
    success: function (res) {//成功后的回调
      resolve(res.result.elements[0].distance)
    },
    fail: function (error) {
      warning(error.message)
      reject(error)
    },
    complete: function (res) {
      console.log(res);
    }
  });

})

export const simpleNavigateTo = (path, params) => {
  let requestParams = []
  let url = path
  for (let i in params) {
    params[i] && requestParams.push(i + '=' + params[i])
  }
  if (requestParams.length !== 0) {
    url = path + '?' + requestParams.join('&')
  }
  uni.navigateTo({ url: url })
}

export const uploadFile = (filePath) => new Promise((resolve, reject) => {
  uni.uploadFile({
    filePath,
    name: 'file',
    url: api.fileUploadService_pictureUpload,
    header: {
      certificate: getApp().globalData.userInfo?.certificate || 'nothing',
      pf: 'ECMOBuni_APPLET_DRIVER'
    },
    success: (res) => {
      let result = JSON.parse(res.data)
      if (res.statusCode === 200) {
        resolve(result)
      } else {
        warning(result?.msg || '未知错误')
        reject(result)
      }

    },
    fail: (res) => {
      warning(res.errMsg)
      reject(res)
    }
  })
})

export const downloadBuffer = (data, filePath) => {
  const fs = uni.getFileSystemManager()
  fs.writeFile({
    filePath,
    data: data,
    encoding: 'binary',
    success(res) {
      uni.openDocument({
        filePath,
        fileType: 'pdf',
        showMenu: true,
        fail: (err) => {
          warning(err.errMsg)
        }
      })
    },
    fail(err) {
      warning(err.errMsg)
    }
  })
}

export const setTemporaryData = (key, value) => {
  getApp().globalData.temporaryData[key] = value
}

export const getTemporaryData = (key) => getApp().globalData.temporaryData[key]

export const getSelecterContent = ( selector = '#id',component = null) => {
  let query = component ? uni.createSelectorQuery().in(component) : uni.createSelectorQuery()
  selector instanceof Array ? selector.map( item => query.select(item).boundingClientRect()) : query.select(selector).boundingClientRect()
  return new Promise((resolve, reject) => {
    try {
      query.exec(res => {
        resolve(res)
      })
    } catch (err) {
      reject(err)
    }
  })
}


export default {
  updateMiniProgram
}
