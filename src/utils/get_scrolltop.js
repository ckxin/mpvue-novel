export default function(id) {
    return new Promise(resolove => {
        const query = wx.createSelectorQuery()
        query.select('#' + id).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res){
            resolove(res[1].scrollTop) // 显示区域的竖直滚动位置
        })
    })
}