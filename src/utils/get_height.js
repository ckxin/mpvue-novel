export default function(id) {
    return new Promise(resolve => {
        wx.createSelectorQuery().select('#'+id).boundingClientRect((rect) => {
            resolve(rect.height);
        }).exec();
    })
}