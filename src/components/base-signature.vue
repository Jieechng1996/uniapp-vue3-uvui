<!--
 * @Date: 2023-09-14 10:35:26
 * @Author: guojiecheng
 * @LastEditTime: 2024-07-23 15:26:50
 * @LastEditors: guojiecheng
-->
<template>
    <view>
        <root-portal>
            <uv-popup ref="popup" background-color="#fff" mode="right" safeAreaInsetTop>
                <view class="popup-content">
                    <view class="signature-warp">
                        <canvas canvas-id="canvas" type="2d" class="modal-canvas" disable-scroll="{{ true }}" id="canvas"
                            @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"></canvas>
                        <view class="modal-title">签名板</view>
                        <view class="modal-point">
                            <view class="circle" :class="{ select: currentColor === item }"
                                :style="{ 'background-color': item }"
                                v-for="( item, index ) in ['black', 'red', 'blue', 'green']" :key="index"
                                @click="() => changeColor(item)">
                            </view>
                        </view>
                        <view class="modal-button">
                            <button size="mini" plain round style="margin-right: 1rem;" @click="hideModal">返回</button>
                            <button size="mini" plain round style="margin-right: 1rem;" @click="btnClear">清除</button>
                            <button size="mini" plain round style="margin-right: 1rem;" @click="btnSave">保存进相册</button>
                            <button size="mini" plain round type="primary" @click="btnConfirm">确认</button>
                        </view>
                    </view>
                    <canvas canvas-id="exportCanvas" type="2d" disable-scroll id="exportCanvas"
                        style="position: fixed;top: -1000px;right: -1000px;"></canvas>
                </view>
            </uv-popup>
        </root-portal>
    </view>
</template>
<script setup>
import { ref } from 'vue';
import { success, toast, warning } from '../config/message';
import { getCurrentInstance } from 'vue';
import { toRaw } from 'vue';

const canvas = ref(null)
const context = ref(null)
const exportCanvas = ref(null)
const exportContext = ref(null)
const contentWidth = ref(null)
const contentHeight = ref(null)
const signFlag = ref(false)



const popup = ref()

const currentColor = ref('black')

const instance = getCurrentInstance()

const getContext = (canvas) => new Promise((resolve, reject) => {

    uni.createSelectorQuery().in(instance).select(canvas).fields({ node: true, size: true }).exec((res) => {
        let canvas = res[0].node;
        let context = canvas.getContext("2d");
        let dpr = wx.getSystemInfoSync().pixelRatio;
        contentWidth.value = res[0].width
        contentHeight.value = res[0].height
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        context.fillStyle = "#EDEDED";
        context.fillRect(0, 0, canvas.width, canvas.height)
        // 利用阴影，消除锯齿
        context.shadowBlur = 1;
        context.shadowColor = '#000';
        context.strokeStyle = currentColor.value
        context.lineWidth = 3
        context.lineCap = 'round'
        context.scale(dpr, dpr)
        resolve({ canvas, context })
    })
})

const getExportContext = () => new Promise((resolve, reject) => {
    uni.createSelectorQuery().in(instance).select('#exportCanvas').fields({ node: true, size: true }).exec((res) => {
        let canvas = res[0].node;
        let context = canvas.getContext("2d");
        context.save()
        resolve({ canvas, context })

    })
})

const handleTouchStart = (e) => {
    context.value.beginPath()
    context.value.moveTo(e.touches[0].x, e.touches[0].y)
    signFlag.value = true
}
/* 触摸移动 */
const handleTouchMove = (e) => {
    /* 记录当前位置 */
    context.value.lineTo(e.touches[0].x, e.touches[0].y)
    context.value.stroke()//将上下文绘制到canvas中
    // this.exportContext.lineTo(e.touches[0].x, e.touches[0].y)
    // this.exportContext.stroke()//将上下文绘制到canvas中
}
/* 触摸结束 */
const handleTouchEnd = (e) => {
    context.value.closePath()
    //this.exportContext.closePath()
}
const changeColor = (color) => {

    context.value.strokeStyle = color
    currentColor.value = color
}

const btnClear = () => {
    context.value.clearRect(0, 0, toRaw(canvas.value).width,toRaw(canvas.value).height)
    exportContext.value.clearRect(0, 0, toRaw(exportCanvas.value).width, toRaw(exportCanvas.value).height)
    signFlag.value = false
    console.log(signFlag.value)
    console.log(222)
}

const getTempFilePath = () => new Promise((resolve, reject) => {
    uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: toRaw(canvas.value).width,
        height: toRaw(canvas.value).height,
        destWidth: contentWidth.value,
        destHeight: contentHeight.value,
        fileType: 'png',
        quality: 1,
        canvas: toRaw(canvas.value),
        success: (res) => {
            resolve(res)
        },
        fail(err) {
            reject(err)
            warning(err.errMsg)
        }
    })
})

const getImageInfo = (tempFilePath) => new Promise((resolve, reject) => {
    uni.getImageInfo({
        src: tempFilePath,
        success: ({ width, height }) => {
            
            let image = toRaw(exportCanvas.value).createImage()
            image.src = tempFilePath
            
            image.onload = () => {
                resolve({ width, height, image })
            }
            image.onerror = () => {

                warning('图片加载异常')
                reject({
                    errMsg: '图片加载异常'
                })
            }
        },
        fail: (err) => {
            warning(err.errMsg)
            reject(err)
        }
    })
})
const exportSignature = (width, height, image) => new Promise((resolve, reject) => {
    let currentCanvas= toRaw(exportCanvas.value)
    let currentContext = toRaw(exportContext.value)
    currentCanvas.width = height;
    currentCanvas.height = width;
    currentContext.translate(0, width)
    currentContext.rotate(-90 * Math.PI / 180)
    currentContext.drawImage(image, 0, 0, width, height)
    currentContext.restore()
    uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: height,
        height: width,
        destWidth: contentHeight.value,
        destHeight: contentWidth.value,
        canvas: currentCanvas,
        success: (res) => {
            resolve(res)
        }, fail: (err) => {
            reject(err)
            warning(err.errMsg)
        }
    })
})


const btnSave = async () => {
    try {
        uni.showLoading()
        let { tempFilePath } = await getTempFilePath()
        let { width, height, image } = await getImageInfo(tempFilePath)
        let { tempFilePath: filePath } = await exportSignature(width, height, image)
        
        uni.saveImageToPhotosAlbum({
            filePath,
            success: () => {
                success('保存成功')
            },
            fail:(err) => {
                warning(err.errMsg)
            }
        })
    } finally {
        wx.hideLoading()
    }

}

const btnConfirm = async () => {
    console.log(1111111)
    console.log(signFlag.value)
    if(!signFlag.value) {
        toast('请签字后再确认')
        return
    }
    try {
        uni.showLoading()
        let { tempFilePath } = await getTempFilePath()
        let { width, height, image } = await getImageInfo(tempFilePath)
        let { tempFilePath: filePath } = await exportSignature(width, height, image)
        emit('btnConfirm', { filePath  })
        hideModal()
    } finally {
        signFlag.value = false
        uni.hideLoading()
    }
}

const emit = defineEmits(['btnConfirm'])

const showModal = () => {
    setTimeout(async () => {
        //this.context ? this.btnClear() :
        if (context.value) {
            btnClear()
            return
        }
        toast('请横屏使用')
        let res = await getContext('#canvas')
        context.value = res.context
        canvas.value = res.canvas
        let exportRes = await getExportContext('#exportCanvas')
        exportContext.value =exportRes.context
        exportCanvas.value = exportRes.canvas
        btnClear()
    }, 200);
    popup.value.open()
}

// watch(() => props.params, (value) => {
//     if (value) {
//         debugger
//         params.value = value
//         params.value[props.searchKey.key] = searchValue.value

//     }
// })

const hideModal = () => popup.value.close()

defineExpose({
    showModal,
    hideModal
})

</script>
<style lang="scss" scoped>
.popup-content {
    width: 100vw;
    height: 100vh;
    position: relative;
}

.signature-warp {
    background: #4E4E4E;
    width: 100%;
    height: 100%;
    padding: 60rpx 70rpx 60rpx 100rpx;
    box-sizing: border-box;
    position: relative;
}

.modal-canvas {
    width: 100%;
    height: 100%;
    background-color: #EDEDED;
    border-radius: 20rpx;
}

.modal-title {
    position: absolute;
    right: -14rpx;
    color: #fff;
    top: calc(50% - 11px);
    transform: rotate(90deg);
}

.modal-button {
    position: absolute;
    z-index: 1;
    left: -150px;
    color: #fff;
    bottom: 180px;
    transform: rotate(90deg);
    button{
        background: #fff;
    }
}

.modal-point {
    position: absolute;
    z-index: 1000;
    left: 0px;
    color: #fff;
    left: 20rpx;
    top: 70rpx;
}

.circle {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    border: 6rpx solid #fff;
    margin-bottom: 20rpx;
    opacity: 0.6;
}

.select {
    opacity: 1;
}</style>