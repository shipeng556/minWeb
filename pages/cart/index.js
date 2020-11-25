// 1 获取用户的收货地址
//   1、绑定事件
//   2、调用小程序内置 api 获取用户的收货地址 wx.chooseAddress

// 2 获取用户 对小程序所授予 获取地址的 权限状态 scope
//   1、假设 用户 点击获取收获地址的提示框 确定  authSetting scope.adresss
//      scope 值 true  直接调用 获取收货地址
//   2、假设 用户 从来没有调用过 收获地址的api
//      scope 值 underfined  直接调用 获取收货地址
//   3、假设 用户 点击获取收获地址的提示框 取消
//      scope 值 false
//   4 把获取到的地址存入缓存中
// 3 页面加载完毕
//   0 onLoad  onShow
//   1 获取本地存储中的电子数据
//   2 把数据 设置给data中的一个变量
// 4 onShow
//   0 回到商品详情页面 第一次添加商品的时候 手动添加了属性
//     1 num=1;  2 checked=true;
//   1 获取缓存中的购物车数组
//   2 把购物车数据 填充到data中
// 5 全选的实现 数据的展示
//   1 onShow 获取缓存中的购物车数组
//   2 根据购物车中的商品数据 所以的商品都被选中 checked=true 全选就选中
// 6 总价格和总数量
//   1 都需要商品被选中 我们才拿来计算
//   2 获取购物车数组
//   3 遍历
//   4 判断商品是否被选中
//   5 总价格 += 商品的单价 * 商品的数量
//   6 总数量 += 商品的数量
//   7 把计算后的价格和数量 设置回data中即可
// 7 全选和反选
//   1 全选复选框绑定事件
//   2 获取 data 中的全选变量 allChecked
//   3 直接取反 allChecked=！allChecked
//   4 遍历购物车数组 让里面商品选中状态跟随 allChecked 改变而改变
//   5 把购物车数组 和 allChecked 重新设置回 data 把购物车重新设置回 缓存中
// 8 商品数量的编辑
//   1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
//      1 "+" "+1"
//      2 "-"  "-1"
//   2 传递被点击的商品id goods_id
//   3 获取data中的购物车数组 来获取需要被修改的商品对象
//   4 直接修改商品对象的数量 num
//   5 把cart 数组 重新设置回缓存中 和data中   然后 this.setCart();


import {
  getSetting,
  chooseAddress,
  openSetting
} from "../../utils/asyncWx"
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 1 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么 every方法的值返回true
    // 只有 有一个回调函数返回了false 那么不再循环执行，直接返回false
    // 空数组 调用 every， 返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    this.setData({
      address
    })
    this.setCart(cart);

  },

  // 点击 收获地址
  async handleChooseAddresss() {
    // 1 获取 权限状态  只要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
    // wx.getSetting({
    //   success: (result) => {
    //     // 2 获取权限状态
    //     const scopeAddress = result.authSetting["scope.adress"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         }
    //       });
    //     } else {
    //       // 3、用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 4 可以调用 收获地址代码
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });


    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.adress"];
      // 2 判断 权限状态
      if (scopeAddress === false) {
        // 3 诱导用户打开授权页面
        await openSetting();
      }
      // 4 调用获取收获地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
      console.log(address);
    } catch (err) {
      console.log(err);

    }


  },
  // 商品的选中
  handleItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);

  },
  // 购物车商品全选 反选
  handleItemAllChecked() {
    // 1 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值 填充回data和缓存中
    this.setCart(cart);

  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;

    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);

  },
  // 商品数量的编辑功能
  handleItemNumEidt(e) {
    // 1 
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到需要修改的商品的索引 index
    let index = cart.findIndex(v => v.goods_id === id);
    // 4 进行修改数量
    cart[index].num += operation;
    // 5 设置回缓存和data中
    this.setCart(cart);

  }


})