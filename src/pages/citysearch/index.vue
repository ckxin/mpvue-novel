<template>
    <scroll-view id="search" class="text-white h-100" :scroll-y="true">
        <headerNav :title="'搜索'" :is_back="true" :is_home="false"></headerNav>
        <div :style="{'padding-top': navBarHeight + 'px'}"></div>
        <div id="search-top" class="row mx-0" >
            <div class="col-3 my-auto">
                <button class="btn btn-info f-2x p-0" 
                style="width:72%;"
                @click="change_type">
                {{ searchtype }}
                <img src="../../../static/img/bookcity/xiajiantou.png" alt="选择" style="width:40rpx; height:40rpx; vertical-align: middle">
                </button>
            </div>
            <div class="col-7 text-center my-auto">
                <input confirm-type="search" @confirm="search_book" v-model="searchkey" 
                class="search-input f-2x" type="text" 
                placeholder="请输入作者或小说名称">
            </div>
            <div class="my-auto" style="width:20px; margin-left: -20px; z-index: 100" 
            v-if="searchkey.length !== 0">
                <img src="../../../static/img/citysearch/qingkong.png" 
                alt="qingkong"
                style="width: 15px; height:15px;"
                @click="clearkey">
            </div>
            <div class="col-2 my-auto text-center f-2x text-danger">
                <span @click="cancel_search">取消</span> 
            </div>
        </div>
        <div id="shelf-res" style="margin-top: 10px;" v-if="shelf_res.length !== 0">
            <div @click="bookprocess(item)" class="row py-3 mx-2 border-bottom" v-for="(item, idx) in shelf_res" :key="idx">
                <div class="col-3 text-center">
                    <img :src="item.book_imgsrc" :alt="item.book_name" 
                    @error="default_fm"
                    style="width: 80rpx; height: 120rpx;">
                </div>
                <div class="col-9 text-left my-auto">
                    <div class="one-line f-2x pb-2" v-html="item.book_name"></div>
                    <div class="one-line text-secondary">{{ item.read_schedule }}</div>
                    <div>已在书架</div>
                </div>
            </div>
        </div>
        <div id="search-res" style="margin-top: 10px;" v-if="search_res.length !== 0">
            <div v-for="(item, index) in search_res" :key="index" 
            class="row mx-2 px-2 py-3 border-bottom" 
            @click="go_bookdetail(item.book_name, item.book_link)">
                <div id="book-name" class="col-6 f-3x one-line">
                    {{ item.book_name }}
                </div>
                <div id="book-author" class="col-6 text-info my-auto f-30rpx one-line">
                    作者：{{ item.author }}
                </div>
                <div id="latest-chapter" class="col-12 py-2 f-30rpx one-line">
                    最新章节：{{ item.latest_chapter }}
                </div>
                <div id="latest-time" class="col-12 f-30rpx one-line">
                    最后更新时间：{{ item.latest_time }}
                </div>
            </div>
        </div>
        <div id="search-history" style="margin-top: 30px" 
        v-if="searchhistory.length !== 0 && search_res.length === 0 && shelf_res.length === 0">
            <div id="history-top" class="row mx-5">
                <div class="col-6 text-left f-30rpx">历史搜索</div>
                <div class="col-6 text-right">
                    <img @click="del_history" src="../../../static/img/citysearch/delete.png" alt="delete"
                    style="width:35rpx; height:35rpx; vertical-align: middle">
                </div>
                <div class="row mx-5 mt-3">
                    <div class="m-1" v-for="(item, idx) in searchhistory" :key="idx">
                        <button class="smbtn" @tap="his_search(item)">
                            {{ item.searchkey }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </scroll-view>
</template>

<script>
import iconv from 'iconv-lite';
import cheerio from 'cheerio';
import { mapState } from 'vuex';
import headerNav from '../../components/headerNav';
import get_search_html from '../../utils/get_search_html';
import get_searchres from '../../utils/get_searchres';
import str_len from '../../utils/str_len';
import deep_clone from '../../utils/deep_clone';

export default {
    data() {
        return {
            searchtype: "书名",
            searchkey: "",
            searchhistory: [],
            search_res: [],
            shelf_res: [],

            net_search: false,
        }
    },
    components: {
        headerNav
    },

    computed: {
        ...mapState(['navBarHeight', 'booklist'])
    },
    methods: {
        change_type() {
            if(this.searchtype === "书名") {
                this.searchtype = "作者";
            } else {
                this.searchtype = "书名";
            }
        },
        clearkey() {
            this.searchkey = "";
            this.shelf_res = [];
            this.search_res = [];
        },
        cancel_search() {
            wx.navigateBack();
        },
        async search_book() {
            this.shelf_res = [];
            this.net_search = true;
            if(str_len(this.searchkey) < 4) {
                wx.showToast({
                    title: '搜索字符不得少于4字节',
                    icon: 'none',
                    image: '',
                    duration: 1500,
                    mask: false,
                });
                return
            }
            let searchtype = "";
            if(this.searchtype === "作者") {
                searchtype = "author";
            } else {
                searchtype = "articlaname";
            }
            let data = "searchkey=" + this.searchkey + "&searchtype=" + searchtype;
            wx.showLoading({
                title: "搜索中...",
                mask: true,
            });
            let html = await get_search_html(data);
            let res = get_searchres(html);
            if(res.status) {
                this.search_res = res.search_res;
            } else {
                wx.showModal({
                    title: '暂无搜索结果~',
                    content: '',
                    showCancel: false,
                    cancelText: '',
                    cancelColor: '',
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                });
            }
            wx.hideLoading();
            let history = {
                searchtype:this.searchtype,
                searchkey: this.searchkey
            };
            let index = this.searchhistory.findIndex(item => {
                return item.searchkey === history.searchkey
            });
            if(index !== -1) {
                this.searchhistory.splice(index, 1);
            }
            if(this.searchhistory.length === 10) {
                this.searchhistory.splice(9, 1);
            }
            this.searchhistory.unshift(history);
        },
        del_history() {
            this.searchhistory = [];
        },
        his_search(history) {
            this.searchtype = history.searchtype;
            this.searchkey = history.searchkey;
            this.search_book();
        },
        go_bookdetail(book_name, book_link) {
            let info = {book_name, book_link};
            let url = "../bookdetail/main?info=" + JSON.stringify(info);
            wx.navigateTo({ url});
        },
    },

    async mounted() {
        try {
            var searchhistory = wx.getStorageSync('searchhistory')
            if (searchhistory) {
                this.searchhistory = searchhistory
            }
        } catch (e) {
            console.log("get searchhistory error:");
            console.log(e);
        }
    },

    watch: {
        searchkey() {
            this.search_res = [];
            if(this.searchkey === "" || this.net_search) {
                if(this.net_search) {
                    this.net_search = false;
                } else {
                    this.shelf_res = [];
                }
                return;
            }
            let book = {};
            for(let i=0; i<this.booklist.length; i++) {
                if(this.booklist[i].book_name.includes(this.searchkey)) {
                    book = deep_clone(this.booklist[i]);
                    this.shelf_res.push(book);
                }
            }
            for(let i=0; i<this.shelf_res.length; i++) {
                this.shelf_res[i].book_name = this.shelf_res[i].book_name
                .split(this.searchkey)
                .join(`<span style="color: green">${this.searchkey}</span>`);
            }
        }
    },

    onUnload() {
        try {
            wx.setStorageSync("searchhistory", this.searchhistory);
        } catch(e) {
            console.log("set searchhistory err:");
            console.log(e);
        }
        Object.assign(this, this.$options.data());
    },
}
</script>

<style lang="wxss">
  page {
    background: #343a40;
  }
</style>

<style scoped>
.search-input {
  border: 1rpx solid #f8f9fa;
  border-radius: 10rpx;
  padding: 10rpx;
  text-align: left;
}
.f-30rpx {
  font-size: 30rpx
}
.smbtn {
    background: white;
    border-radius: 5px;
    font-size: 30rpx;
    padding: 10rpx;
    line-height: 30rpx;
}
</style>