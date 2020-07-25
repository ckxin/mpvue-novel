export default function(url, method="GET", data={}) {
    wx.showLoading({
        title: "加载中...",
        mask: true,
    });
    return new Promise((resolove, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method,
            responseType: 'arraybuffer',
            success: (res)=>{
                wx.hideLoading();
                resolove(res);
            },
            fail: ()=>{
                wx.showModal({
                    title: '请求出错，请重试！',
                    content: '',
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                });
                reject("err");
            },
        });
    })
}