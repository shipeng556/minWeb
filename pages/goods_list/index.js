// 1 用户上滑页面 滚动条触底 开始加载下一页数据
//   1、找到滚动条触底事件 （微信小程序的官方开发文档中寻找）
//   2、判断还有没有下一页数据
//     1、获取到总页数 只有总条数
//        总页数 = Math.ceil(总条数 / 页容量 pagesize)
//        总页数 = Math.ceil(23/10) = 3
//     2、获取到当前的页码 pagenum
//     3、判断一下 当前的页面是否大于等于 总页数
//        表示 没有下一页数据
//   3、假如没有下一页数据 弹出提示
//   4、假如还有下一页数据 来加载下一页数据
//      1、当前页面++
//      2、重新发送请求
//      1、数据请求回来 要对data中的数组拼接 而不是全部替换！！！
// 2  下拉刷新页面
//    1、触发下拉刷新事件 需要再页面的josn文件中开启一个配置项
//       1、 找到下拉刷新的事件，添加逻辑
//    2、重置 数据 数组
//    3、重置页面  设置为1
//    4、重新发送请求
//    5、数据请求回来 需要手动的关闭 等待效果
import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      }, {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goods_list: [],
    nopicture: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599564517889&di=7daa5d8167a3d4d5a7f6c399f4238750&imgtype=0&src=http%3A%2F%2Fimages.669pic.com%2Felement_pic%2F3%2F88%2F77%2F52%2F63160fa6edcfde1b73bafadf9be77e8d.jpg",
  },
  // 接口需要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    // 获取 总条数
    const total = res.total;
    // 计算 总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接的数组 
      goods_list: [...this.data.goods_list, ...res.goods]
    })

    // 关闭下拉效果 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 标题的点击事件 从子组件传递过来的
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
  // 页面上划 滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据了
      wx.showToast({
        title: '没有下一页数据了！',
      });
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goods_list: []
    })
    // 2 重置页面
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();

  }

})