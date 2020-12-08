// 1 输入框绑定 值改变事件 input事件
//   1 获取到输入框的值
//   2 合法性判断
//   3 检验通过 把输入框的值 发送到后台
//   4 返回的数据打印到页面上
// 2 防抖 （防止抖动） 定时器 节流
//   1 防抖 一般 输入框中 防止重复输入 重复发送请求
//   2 节流 一般是用在页面下拉和上拉
//   3 定义全局的定时器id

import {
  request
} from "../../request/index.js"

Page({
  data: {
    goods: [],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:""

  },
  TimeId: -1,
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // 1 获取输入框的值
    const {
      value
    } = e.detail;
    console.log(value);
    // 2 检测合法性
    if (!value.trim()) {
      return;
    }
    this.setData({
      isFocus:true
    })
    // 3 发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qSearch(value);
    }, 1000);

  },
  async qSearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    })
    console.log(res);
    this.setData({
      goods: res
    })

  },
  // 点击 取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]

    })

  }


})