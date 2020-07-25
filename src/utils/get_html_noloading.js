import iconv from 'iconv-lite';

function request(url, method="GET", data={}) {
    return new Promise((resolove, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method,
            responseType: 'arraybuffer',
            success: (res)=>{
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
export default async function (url) { 
    try{
        let res = await request(url);
        let num = 0;
        while(res === undefined) {
            if(num >= 20) {
                throw(new Error("get_html error!"));
            }
            console.log("undefined")
            res = await request(url);
            num ++;
        }
        let buf = Buffer.from(res.data, 'binary');
        const str = iconv.decode(buf, 'gbk');
        return str;
    } catch(err) {
        console.log("get_info error:");
        console.log(err);
    }
}