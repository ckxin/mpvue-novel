<template>
    <div id="book-detail" class="text-white">
        <headerNav :title="'书籍详情'" :is_back="true" :is_home="true"></headerNav>
        <div id="detail" :style="{'padding-top': navBarHeight + 'px'}"
        v-if="book_intro !== ''">
            <div class="row mx-0 bg-dark text-white py-3">
                <div class="col-4 text-center">
                    <img class="fengmian" :src="book_imgsrc" :alt="book_name" @error="default_fm">
                </div>
                <div class="col-8 text-left my-auto">
                    <div class="f-2x font-weight-bold one-line text-warning">{{ book_name }}</div>
                    <div class="text-success one-line py-1">{{ book_author }}</div>
                    <div class="one-line py-1 text-danger">最新章节：{{ latest_chapter }}</div>
                    <div class="one-line text-info">{{ latest_time }}</div>
                </div>
            </div>
            <div class="row mx-0 py-3 text-center">
                <div class="col-4"><button class="btn btn-danger f-2x w-75" @click="go_read">开始阅读</button></div>
                <div class="col-4"><button class="btn f-2x w-75" @click="add_book">加入书架</button></div>
                <div class="col-4"><button class="btn f-2x w-75" @click="go_shelf">返回书架</button></div>
            </div>
            <div class="row mx-0 p-2 f-2x">
                简介：{{ book_intro }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import headerNav from '../../components/headerNav';
import get_bookdetail from '../../utils/get_bookdetial';
import deep_clone from '../../utils/deep_clone';

const fengmian = require('../../../static/img/fengmian/fengmian1.jpg');
export default {
    data() {
        return {
            book_name: "",
            book_link: "",
            book_author: "",
            book_imgsrc: fengmian,
            latest_chapter: "",
            latest_time: "",
            book_intro: "",
        }
    },
    components: {
        headerNav
    },

    computed: {
        ...mapState(['navBarHeight', 'booklist'])
    },
    methods: {
        ...mapMutations(['set_booklist']),
        default_fm() {
            this.book_imgsrc = fengmian;
        },
        go_read() {
            let book = {book_name: this.book_name, book_link: this.book_link, book_imgsrc: this.book_imgsrc};
            let url = '../bookread/main?book=' + JSON.stringify(book);
            wx.navigateTo({ url });
        },
        add_book() {
            let book_name = this.book_name;
            let index = this.booklist.findIndex(item => {
                return item.book_name === book_name;
            });
            if(index === -1) {
                let book_imgsrc = this.book_imgsrc;
                let book_link = this.book_link;
                let bookmark = [];
                let history = "";
                let read_schedule = "未阅读";
                let selected = false;
                let book = {book_name, book_imgsrc, book_link, bookmark, history, read_schedule, selected};
                let booklist = deep_clone(this.booklist);
                booklist.unshift(book);
                this.set_booklist(booklist);
                wx.showToast({
                    title: '加入书架成功',
                });
            } else {
                wx.showToast({
                    title: '该书已在书架',
                    icon: 'none'
                })
            }
        },
        go_shelf() {
            let url = '/pages/bookshelf/main';
            wx.switchTab({url});
        },
    },

    async mounted() {
        wx.showLoading({
            title: "加载中...",
            mask: true,
        });
        let info = this.$root.$mp.query.info;
        info = JSON.parse(info);
        this.book_name = info.book_name;
        this.book_link = info.book_link;
        let res = await get_bookdetail(this.book_link);
        this.book_author = res.book_author;
        let book_imgsrc = res.book_imgsrc;
        this.book_imgsrc = book_imgsrc;
        this.latest_chapter = res.latest_chapter;
        this.latest_time = res.latest_time;
        this.book_intro = res.book_intro.split('　').join('');
        wx.hideLoading();
    },
    onUnload() {
        Object.assign(this, this.$options.data());
    },
}
</script>

<style lang="wxss">
page {
    background: #6c757d;
}
</style>

<style scoped>
    .fengmian {
        width: 90px;
        height: 120px;
    }
</style>