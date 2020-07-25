<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

  //   let logs
  //   if (mpvuePlatform === 'my') {
  //     logs = mpvue.getStorageSync({key: 'logs'}).data || []
  //     logs.unshift(Date.now())
  //     mpvue.setStorageSync({
  //       key: 'logs',
  //       data: logs
  //     })
  //   } else {
  //     logs = mpvue.getStorageSync('logs') || []
  //     logs.unshift(Date.now())
  //     mpvue.setStorageSync('logs', logs)
  //   }
  // },
  // log () {
  //   console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
html, body {
  height: 100%;
}
#app {
  height: 100%;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

.icon-img {
  width: 30px;
  height: 30px;
}
.one-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.two-line {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.v-m {
  vertical-align: middle;
}

.border-bottom {
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
}


.bg-top-light {
  background: white;
  color: #1a1a1a;
}
.bg-top-green {
    background: #b8d8b8;
    color: rgba(0, 0, 0, 0.8);
}
.bg-top-yellow {
    background: #eae9ce;
    color: #555;
}
.bg-top-red {
    background: #edd6d0;
    color: rgba(0, 0, 0, 0.8);
}
.bg-top-blue {
    background: #ccd2e1;
    color: #555;
}
.bg-top-night {
  background: #343a40;
  color: rgba(255, 255, 255, 0.8);
}
.bg-light {
    background: #f8f9fa;
    color: #555;
}
.bg-green {
    background: #c8e8c8;
    color: rgba(0, 0, 0, 0.8);
}
.bg-yellow {
    background: #faf9de;
    color: #555;
}
.bg-red {
    background: #fde6e0;
    color: rgba(0, 0, 0, 0.8);
}
.bg-blue {
    background: #dce2f1;
    color: #555;
}
.bg-night {
    background: #1a1a1a;
    color: rgba(255, 255, 255, 0.8);
}
</style>
