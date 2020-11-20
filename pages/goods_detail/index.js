// 1、 发送请求获取数据
// 2、点击轮播图 预览大图
//    1 给轮播图绑定点击事件
//    2 调用小程序的api previewImage

import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},

  },
  // 商品对象
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);

  },
  // 获取商品详情的数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } })
    this.goodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp =》 1.jpg
        goods_introduce: goodsObj.goods_introduce,
        pics: goodsObj.pics
      }
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // console.log(预览图片);
    // 1 先构造要预览的数组图片
    const urls = this.goodsInfo.pics.map(v => v.pics_mid);
    // 2 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  }


})