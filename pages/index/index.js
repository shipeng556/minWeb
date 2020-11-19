// 0 引入 用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cartsList: [],
    // 楼层数据
    floorList:[]

  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据 优化的手段可以通过es6
    // wx.request({
    //   url: '/home/swiperdata',
    //   success: (result)=>{
    //       console.log(result);
    //     this.setData({
    //       swiperList:result
    //     })

    //   }
    // });

    this.getSwiperList();
    this.getCartList();
    this.getFloorList();
    
  },

  // 获取轮播图数据
  getSwiperList(){
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
      // .then()
  },
  // 获取导航数据
  getCartList(){
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          cartsList: result
        })
      })
      // .then()
  },
  // 获取导航数据
  getFloorList(){
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
      // .then()
  }

});