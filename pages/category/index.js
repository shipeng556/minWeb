import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,

  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0  web中的本地储存和 小程序中的本地储存大的区别
    // 1 写代码的方式不一样了
    // web：localStorage.setItem("key","value")  localStorage.getItem("key")
    // 小程序：wx.setStorageSync("key","value"); wx.getStorageSync("key");
    // 2 存的时候 有没有做类型转换
    // web：不管存入的是什么类型的数据，最终都会先调用一下 toString(),把数据变成字符串 在存入进去
    // 小程序：不存在类型转换的操作，存什么类型的数据进去，获取的时候就是什么类型

    // 1、判断本地储存中有没有旧的数据
    // {time: Date.now(),data:[...]}
    // 2、没有旧的数据 直接发送新的请求
    // 3、有旧的数据，同时旧的数据也没有过期 就使用本地储存中的旧的数据即可

    // 1 获取本地储存中的数据  (小程序中也是存在本地储存 技术)
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间， 10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories",
    // }).then(res => {
    //   this.Cates = res.data.message;
    //   // 把接口的数据存入到本地储存中
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1、使用es7的async await来发送请求
    const res = await request({ url: "/categories" })
    // this.Cates = res.data.message;
    this.Cates = res;
    // 把接口的数据存入到本地储存中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    // 1、获取被点击的菜单身上的索引
    // 2、给data中的currentIdex赋值就可以了
    // 3、根据不同的索引渲染不同的商品内容
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent
    })


  }

})