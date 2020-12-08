// 1 点击 ‘+’ 触发tap 点击事件
//   1 调用小程序内置的 选择图片的 api
//   2 获取到 图片的路径 数组
//   3 把图片路径 存到 data 的变量中
//   4 页面就可以根据 图片数组 进行循环遍历 自定义组件
// 2 点击 自定义图片 组件
//   1 获取被点击的元素的索引
//   2 获取 data 中的图片数组
//   3 根据索引  删除数组中对于的元素
//   4 把数组重新设置回data中

Page({

  data: {
    tabs: [{
        id: 0,
        value: "意见反馈",
        isActive: true
      },
      {
        id: 1,
        value: "品牌、商家投诉",
        isActive: false
      }
    ],
    // 图片数组
    chooseImgs: []

  },

  handleTabsItemChange(e) {
    //1、获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2、修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3、赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击上传图片
  handleChooseImg() {
    wx.chooseImage({
      // 上传图片的张数
      count: 9,
      // 图片的格式   原图   压缩图片
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册   照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          // 图片数组拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })

      }
    });

  },
  // 点击 删除图片
  handleRemoveImg(e) {
    // 获取索引
    const {
      index
    } = e.currentTarget.dataset;
    // 获取data 中的图片数组
    let {
      chooseImgs
    } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  }


})