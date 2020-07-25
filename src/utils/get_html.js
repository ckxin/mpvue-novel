import request from './request';
import iconv from 'iconv-lite';
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