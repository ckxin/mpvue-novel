// const axios = require('axios');
const qs = require('querystring');
const iconv = require('iconv-lite');

function request(data) {
    return new Promise((resolove, reject) => {
        wx.request({
            url: "https://www.2952.cc/modules/article/search.php",
            data,
            method: "POST",
            responseType: 'arraybuffer',
            header: {
                'content-type':'application/x-www-form-urlencoded;charset=GBK',
            },
            success: (res)=>{
                resolove(res);
            },
            fail: ()=>{
                reject("err");
            },
        });
    })
} 

// const search_req = axios.create({
//     url: "https://www.2952.cc/modules/article/search.php",
//     method: "POST",
//     responseType: 'arraybuffer',
//     data: {},
//     headers: {
//         'Content-Type':'application/x-www-form-urlencoded;charset=gbk',
//     },
//     transformRequest: [function (data) {
//         data = qs.stringify(data, null, null, { encodeURIComponent: function (str){
//             var chinese = new RegExp(/[^\x00-\xff]/g);
//             var gbkBuffer = null;
//             var i = 0;
//             var tempStr = '';
//             if (chinese.test(str)){//
//                 gbkBuffer = iconv.encode(str,'gbk');
//                 for (i; i<gbkBuffer.length; i++) {
//                     tempStr += '%' + gbkBuffer[i].toString(16);
//                 };
//                 tempStr = tempStr.toUpperCase();
//                 return tempStr;
//             }else{
//                 return qs.escape(str);
//             }
//         }});
//         return data;
//         }],
// });

export default async function(data) {
    let gbkstr = "";
    for(let j=0; j<data.length; j++) {
        var chinese = new RegExp(/[^\x00-\xff]/g);
        var gbkBuffer = null;
        var i = 0;
        var tempStr = '';
        if (chinese.test(data[j])){//
            gbkBuffer = iconv.encode(data[j],'gbk');
            for (i; i<gbkBuffer.length; i++) {
                tempStr += '%' + gbkBuffer[i].toString(16);
            };
            tempStr = tempStr.toUpperCase();
            gbkstr += tempStr;
        } else {
            gbkstr += data[j];
        }
    }
    data = gbkstr;
    try {
        let res = await request(data);
        let buf = Buffer.from(res.data, 'binary');
        const str = iconv.decode(buf, 'gbk');
        return str;
    }
    catch(err) {
        console.log("get_searchres error:");
        console.log(err);
    }
}
