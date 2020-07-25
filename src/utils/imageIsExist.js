export default function(src) {
    return new Promise((resolve) => {
        wx.getImageInfo({
            src,
            success: ()=>{
                resolve(true);
            },
            fail: ()=>{
                resolve(false);
            }
        });
    })
}