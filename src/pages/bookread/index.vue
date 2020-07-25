<template>
    <div id="read">
        <headerNav :title="book.book_name" :is_back="true" :is_home="false" :bg='readstyle.bgTop'></headerNav>
        <div :style="{'padding-top': navBarHeight + 'px'}"></div>
        <div v-if="loading" class="fixed-top" :class="readstyle.bg" 
        :style="{top: navBarHeight+'px', height: screen_height-navBarHeight + 'px', 'z-index': 100}">
        </div>
        <div id="content"
        :style="{'font-size': readstyle.fontSize, position: is_fixed?'fixed':'', top: is_fixed ? -(top_space-navBarHeight)+'px' : ''}" 
        class="px-5" :class="readstyle.bg">
            <div v-for="(item, idx) in current_chapters" :key="idx" :id="item.chapter_id" 
            @click="control_menu(item.chapter_id, $event)" @touchmove="close_menu">
                <div class="font-weight-bold mt-2" v-html="item.chapter_title">
                </div>
                <div v-for="(content, index) in item.chapter_content" :key="index" :data-content="content" v-html="content">
                </div>
            </div>
        </div>

        <div id="catalogue" v-if="is_catalogue" class="fixed-top" @click="close_catalogue"
        :style="{ top: navBarHeight+'px', height: screen_height-navBarHeight + 'px'}">
            <div id="catalogue-top" class="row px-4" :class="readstyle.bgTop" @click.stop="go_top"
            style="position: fixed; line-height: 50px; width: 280px; font-size: 16px; z-index:1050">
                <div class="col-6 text-left">目录</div>
                <div class="col-6 text-right">
                    <img @click.stop="go_bottom" class="icon-sm v-m" src="../../../static/img/bookread/dibu1.png" alt="底部">
                </div>
            </div>
            <scroll-view id="catalogue-main" scroll-y :scroll-top="catalogue_top"
            class="h-100 px-4" :class="readstyle.bg" style="width: 280px;">
                <div id="catalogue-list" style="padding-top: 50px;" :class="readstyle.bg">
                    <div class="one-line" v-for="(item, cata) in title_list" :key="cata"
                    style="width: 280px; font-size: 13px; line-height: 49px; border-bottom: 1px solid rgba(128, 128, 128, 0.5);"
                    :style="cata === current_chapter_index ? 'color: green' : ''"
                    @click.stop="go_chapter(cata)">
                    {{ item.chapter_name }}
                    </div>
                </div>
            </scroll-view>
        </div>

        <div id="bookmark" v-if="is_bookmark" class="fixed-top" @click="close_bookmark"
        :style="{ top: navBarHeight+'px', height: screen_height-navBarHeight + 'px'}">
            <div id="bookmark-top" class="px-4 text-left" :class="readstyle.bgTop"
            style="position: fixed; line-height: 50px; width: 280px; font-size: 16px; z-index:1050">
                书签
            </div>
            <scroll-view id="bookmark-main" scroll-y
            class="h-100 px-4" :class="readstyle.bg" style="width: 280px;">
                <div id="bookmark-list" style="padding-top: 50px;" :class="readstyle.bg">
                    <div id="nomark" class="f-2x py-2" v-if="bookmark.length === 0">暂无书签</div>
                    <div v-else>
                        <div @click.stop="go_bookmark(item)" class="f-2x row border-bottom py-4" v-for="(item, markidx) in bookmark" :key="markidx">
                            <div class="col-10 text-left one-line my-auto">{{ item.bookmark_data }}</div>
                            <div @click.stop="delete_bookmark(markidx)" class="col-2 my-auto text-center">
                                <div><img class="icon-sm" src="../../../static/img/bookread/delete.png" alt="delete"></div>
                                <div class="fz-20">删除</div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </div>

        <div id="menu" class="fixed-bottom f-2x" v-if="is_menu">
            <div class="addshelf" v-if="! is_shelf">
                <div @click.stop="add_book" class="bg-dark rounded-circle addshelf-container">
                    <img class="addshelf-img" src="../../../static/img/bookread/add_shelf1.png" alt="加入书架">
                </div>
            </div>
            <div id="menu-main" class="row bg-dark py-3">
                <div class="row mx-auto w-100" v-if="is_bg" @click.stop="select_bg">
                    <div class="col-2"><div class="bg-light rounded-circle w-75 mx-auto text-center py-2" data-bg="日间">日间</div></div>
                    <div class="col-2"><div class="bg-green rounded-circle w-75 mx-auto text-center py-2" data-bg="护眼">护眼</div></div>
                    <div class="col-2"><div class="bg-yellow rounded-circle w-75 mx-auto text-center py-2" data-bg="杏黄">杏黄</div></div>
                    <div class="col-2"><div class="bg-red rounded-circle w-75 mx-auto text-center py-2" data-bg="胭红">胭红</div></div>
                    <div class="col-2"><div class="bg-blue rounded-circle w-75 mx-auto text-center py-2" data-bg="海蓝">海蓝</div></div>
                    <div class="col-2"><div class="bg-night rounded-circle w-75 mx-auto text-center py-2" data-bg="夜间">夜间</div></div>
                </div>
                <div class="col-12 py-2" v-if="is_bg"></div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x text-white" @click.stop="change_bg">切换背景</button>
                </div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x text-white" @click.stop="add_bookmark">加入书签</button>
                </div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x text-white" @click.stop="down_fontsize">A-</button>
                </div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x text-white" @click.stop="up_fontsize">A+</button>
                </div>
                <div class="col-12 py-2"></div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x" @click.stop="go_prev">上一章</button>
                </div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x" @click.stop="open_catalogue">目录</button>
                </div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x" @click.stop="open_bookmark">书签</button>
                </div>
                <div class="col-3 text-center">
                    <button class="btn btn-dark f-2x" @click.stop="go_next">下一章</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import cheerio from 'cheerio';
import headerNav from '../../components/headerNav';
import deep_clone from '../../utils/deep_clone';
import { bookread, getchapter } from '../../utils/get_bookread';
import get_height from '../../utils/get_height';
import get_scrolltop from '../../utils/get_scrolltop';

export default {
    data() {
        return {
            book: {},
            bookmark: [],
            bookmark_item: {},
            title_list: [],
            current_chapters: [],
            readstyle: {
                fontSize: '36rpx',
                bg: 'bg-light',
                bgTop: 'bg-top-light'
            },
            screen_height: 0,
            current_chapter_index: 0,
            top_space: 0,
            catalogue_top: 0,
            scroll_top: 0,

            is_shelf: false,
            is_menu: false,
            is_bg: false,
            is_catalogue: false,
            is_bookmark: false,
            is_fixed: false,
            is_top: false,
            is_bottom: false,
            is_finished: false,
            loading: false,
        }
    },
    components: {
        headerNav
    },

    computed: {
        ...mapState(['booklist', 'navBarHeight', 'is_show_addshelf_warn'])
    },
    methods: {
        ...mapMutations(['set_booklist', 'set_is_show_addshelf_warn']),
        async scroll_fixed(state) {
            if(state) {
                this.top_space = await get_scrolltop('content');
                this.is_fixed = true;
            } else {
                this.is_fixed = false;
                this.$nextTick(() => {
                    wx.pageScrollTo({scrollTop: this.top_space, duration: 0});
                })
            }
        },
        async control_menu(chapter_id, e) {
            let y = e.clientY;
            if(y > this.screen_height*0.4 && y<this.screen_height*0.75) {
                this.is_menu = !this.is_menu;
                if(this.is_menu) {
                    this.current_chapter_index = parseInt(chapter_id.split('_')[1]);
                    let bookmark_data = e.target.dataset.content;
                    if(bookmark_data.length > 20)
                        bookmark_data = bookmark_data.substring(0, 20);
                    let top_space = await get_scrolltop('content');
                    let current_index = parseInt(this.current_chapters[1].chapter_id.split('_')[1]);
                    let bookmark_id = `bookmark_${current_index}_${top_space}`;
                    this.bookmark_item = {bookmark_data, bookmark_id};
                } else {
                    this.is_bg = false;
                }
            }
        },
        close_menu() {
            this.is_menu = false;
            this.is_bg = false;
        },
        add_book() {
            this.is_shelf = true;
            let book_name = this.book.book_name;
            let book_imgsrc = this.book.book_imgsrc;
            let book_link = this.book.book_link;
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
        },
        change_bg() {
            this.is_bg = !this.is_bg;
        },
        select_bg(e) {
            let bg = e.target.dataset.bg;
            switch(bg) {
                case "日间": this.readstyle.bg='bg-light'; this.readstyle.bgTop='bg-top-light'; break;
                case "护眼": this.readstyle.bg="bg-green"; this.readstyle.bgTop='bg-top-green'; break;
                case "杏黄": this.readstyle.bg="bg-yellow"; this.readstyle.bgTop='bg-top-yellow'; break;
                case "胭红": this.readstyle.bg="bg-red"; this.readstyle.bgTop='bg-top-red'; break;
                case "海蓝": this.readstyle.bg="bg-blue"; this.readstyle.bgTop='bg-top-blue'; break;
                case "夜间": this.readstyle.bg="bg-night"; this.readstyle.bgTop='bg-top-night'; break;
            }
        },
        add_bookmark() {
            let index = this.bookmark.findIndex(item => {
                return item.bookmark_id === this.bookmark_item.bookmark_id;
            });
            if(index === -1) {
                this.bookmark.unshift(this.bookmark_item);
                wx.showToast({ title: '成功加入书签' });
            } else {
                wx.showToast({
                    title: '该书签已存在',
                    icon: 'none',
                });
            }
        },
        open_bookmark() {
            this.is_menu = false;
            this.scroll_fixed(true);
            this.is_bookmark = true;
        },
        async go_bookmark(bookmark) {
            let bookmark_id = bookmark.bookmark_id;
            let index = parseInt(bookmark_id.split('_')[1]);
            let scroll_top = parseInt(bookmark_id.split('_')[2]);
            this.is_bookmark = false;
            this.scroll_fixed(false);
            this.current_chapters = [];
            let current_chapters = [];
            this.loading = true;
            wx.showLoading({ title: '加载中', mask: true, });
            for(let i=index-1; i<index+1; i++) {
                let get_url = this.title_list[i].chapter_link;
                let get_index = i;
                let get_chapter = await getchapter(get_index, get_url);
                current_chapters.push(get_chapter);
            }
            this.current_chapters = current_chapters;
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: scroll_top,
                    duration: 0,
                    success: () => {
                        wx.hideLoading();
                        this.loading = false;
                    }
                });
            })
        },
        delete_bookmark(index) {
            this.bookmark.splice(index, 1);
        },
        close_bookmark(e) {
            let id = e.target.id;
            if(id !== 'bookmark-top' && id !== 'bookmark-main' && id !== 'nomark') {
                this.is_bookmark = false;
                this.scroll_fixed(false);
            }
        },
        down_fontsize() {
            let fontsize = parseInt(this.readstyle.fontSize);
            if(fontsize < 28) {
                return;
            } else {
                fontsize -= 2;
                this.readstyle.fontSize = fontsize + "rpx";
            }
        },
        up_fontsize() {
            let fontsize = parseInt(this.readstyle.fontSize);
            if(fontsize > 60) {
                return;
            } else {
                fontsize += 2;
                this.readstyle.fontSize = fontsize + "rpx";
            }
        },
        open_catalogue() {
            this.is_menu = false;
            this.is_bg = false;
            this.scroll_fixed(true);
            this.is_catalogue = true;
            this.catalogue_top = this.current_chapter_index*50;
        },
        go_top() {
            this.catalogue_top = 10;
            this.catalogue_top = 0;
        },
        go_bottom() {
            this.catalogue_top = this.title_list.length*50;
        },
        async go_chapter(index) {
            this.is_catalogue = false;
            this.scroll_fixed(false);
            this.current_chapters = [];
            let current_chapters = [];
            this.loading = true;
            wx.showLoading({ title: '加载中', mask: true, });
            if(index === 0) {
                for(let i=0; i<2; i++) {
                    let get_url = this.title_list[i].chapter_link;
                    let get_index = i;
                    let get_chapter = await getchapter(get_index, get_url);
                    current_chapters.push(get_chapter);
                }
            } else {
                for(let i=index-1; i<index+1; i++) {
                    let get_url = this.title_list[i].chapter_link;
                    let get_index = i;
                    let get_chapter = await getchapter(get_index, get_url);
                    current_chapters.push(get_chapter);
                }
            }
            this.current_chapters = current_chapters;
            this.$nextTick(async() => {
                let content_height = await get_height('content');
                let chapter_id = 'chapter_' + index;
                let chapter_height = await get_height(chapter_id);
                let scroll_top = content_height - this.screen_height;
                if(index === 0) {
                    scroll_top = 0;
                } else {
                    if(chapter_height > this.screen_height) {
                        scroll_top = content_height - chapter_height;
                    }
                }
                wx.pageScrollTo({
                    scrollTop: scroll_top,
                    duration: 0,
                    success: () => {
                        wx.hideLoading();
                        this.loading = false;
                    }
                });
            })
        },
        close_catalogue(e) {
            let id = e.target.id;
            if(id !== 'catalogue-top' && id !== 'catalogue-main') {
                this.is_catalogue = false;
                this.scroll_fixed(false);
            }
        },
        async go_prev() {
            this.is_menu = false;
            let current_index = parseInt(this.current_chapters[1].chapter_id.split('_')[1]);
            if(current_index === 1) {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                });
            } else {
                this.current_chapters = [];
                let current_chapters = [];
                this.loading = true;
                wx.showLoading({ title: '加载中', mask: true, });
                for(let i=this.current_chapter_index-2; i<this.current_chapter_index; i++) {
                    let get_url = this.title_list[i].chapter_link;
                    let get_index = i;
                    let get_chapter = await getchapter(get_index, get_url);
                    current_chapters.push(get_chapter);
                }
                this.current_chapters = current_chapters;
                this.$nextTick(async () => {
                    let content_height = await get_height('content');
                    let chapter_id = 'chapter_' + (this.current_chapter_index-1);
                    let chapter_height = await get_height(chapter_id);
                    let scroll_top = content_height - this.screen_height;
                    if(chapter_height > this.screen_height) {
                        scroll_top = content_height - chapter_height;
                    }
                    wx.pageScrollTo({
                        scrollTop: scroll_top,
                        duration: 0,
                        success: () => {
                            wx.hideLoading();
                            this.loading = false;
                        }
                    });
                })
            }
        },
        async go_next() {
            this.is_menu = false;
            if(this.current_chapter_index === this.title_list.length-1) {
                wx.showToast({ title: '已是最后一章', icon: 'none' });
            } else {
                let current_index = parseInt(this.current_chapters[1].chapter_id.split('_')[1]);
                if(current_index === this.current_chapter_index) {
                    let current_chapters = deep_clone(this.current_chapters);
                    this.current_chapters = [];
                    this.loading = true;
                    wx.showLoading({ title: '加载中', mask: true });
                    let get_url = this.title_list[current_index+1].chapter_link;
                    let get_index = current_index + 1;
                    let get_chapter = await getchapter(get_index, get_url);
                    current_chapters.push(get_chapter);
                    current_chapters.shift();
                    this.current_chapters = current_chapters;
                }
                this.$nextTick(async () => {
                    let content_height = await get_height('content');
                    let chapter_id = 'chapter_' + (this.current_chapter_index+1);
                    let chapter_height = await get_height(chapter_id);
                    let scroll_top = content_height - this.screen_height;
                    if(chapter_height > this.screen_height) {
                        scroll_top = content_height - chapter_height;
                    }
                    wx.pageScrollTo({
                        scrollTop: scroll_top,
                        duration: 0,
                        success: () => {
                            wx.hideLoading();
                            this.loading = false;
                        }
                    });
                })
            }
        },

        set_history() {
            let index = parseInt(this.current_chapters[1].chapter_id.split('_')[1]);
            let scroll_top = this.scroll_top;
            let history = `history_${index}_${scroll_top}`;
            let read_schedule = "";
            if(this.is_finished) {
                read_schedule = "已读完";
            } else {
                let percentage = index / this.title_list.length * 100;
                percentage = percentage.toFixed(2);
                read_schedule = "已读" + percentage + "%";
            }
            let booklist = deep_clone(this.booklist);
            let book_idx = booklist.findIndex(item => {
                return item.book_name === this.book.book_name
            });
            booklist[book_idx].bookmark = this.bookmark;
            booklist[book_idx].history = history;
            booklist[book_idx].read_schedule = read_schedule;
            this.set_booklist(booklist);
        }
    },
    async mounted() {
        let book = this.$root.$mp.query.book;
        book = JSON.parse(book);
        this.book = book;
        this.screen_height = wx.getSystemInfoSync().windowHeight;
        let readstyle = wx.getStorageSync('readstyle');
        if(readstyle) {
            this.readstyle = readstyle;
        }
        let is_read = false;
        if(this.booklist !== []) {
            let index = this.booklist.findIndex(item => {
                return item.book_name === book.book_name;
            });
            if(index !== -1) {
                this.is_shelf = true;
                this.bookmark = book.bookmark;
                if(book.history) {
                    is_read = true;
                }
            }
        }       
        if(is_read) {
            this.loading = true;
            wx.showLoading({ title: '加载中', mask: true, });
            let index = parseInt(book.history.split('_')[1]);
            let scroll_top = parseInt(book.history.split('_')[2]);
            let res = await bookread(book.book_link, index);
            let { title_list, current_chapters } = res;
            this.title_list = title_list;
            this.current_chapters = current_chapters;
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: scroll_top,
                    duration: 0,
                    success: () => {
                        wx.hideLoading();
                        this.loading = false;
                    }
                });
            })
        } else {
            this.loading = true;
            wx.showLoading({ title: '加载中', mask: true, });
            let res = await bookread(book.book_link, 1);
            let { title_list, current_chapters } = res;
            this.title_list = title_list;
            this.current_chapters = current_chapters;
            wx.hideLoading();
            this.loading = false;
        }
        
        if(! this.is_shelf) {
            if(this.is_show_addshelf_warn) {
                 wx.showModal({
                    content: '喜欢本书别忘记添加书架，只有书架中的书籍才会保存书签及阅读记录哦~',
                    showCancel: true,
                    cancelText: '不再提醒',
                    cancelColor: '#dc3545',
                    confirmText: '朕知道啦',
                    confirmColor: '#28a745',
                    success: (res) => {
                        if (res.cancel) {
                            this.set_is_show_addshelf_warn(false);
                        }
                    }
                });
            }
        }
    },
    async onPageScroll(e) {
        this.is_finished = false;
        this.scroll_top = e.scrollTop;
        if(e.scrollTop === 0) {
            if(this.is_catalogue || this.is_bookmark) {
                return;
            }
            if(this.is_top) {
                return;
            }
            this.is_top = true;
            let current_index = parseInt(this.current_chapters[1].chapter_id.split('_')[1]);
            if(current_index === 1) {
                wx.showToast({
                    title: '已到达小说顶部',
                    icon: 'none',
                    success: () => {
                        this.is_top = false;
                    }
                });
            } else {
                wx.showLoading({ title: '加载中', mask: true, });
                let get_url = this.title_list[current_index-2].chapter_link;
                let get_index = current_index - 2;
                let get_chapter = await getchapter(get_index, get_url);
                this.current_chapters.unshift(get_chapter);
                this.current_chapters.pop();
                this.$nextTick(async () => {
                    let content_height = await get_height('content');
                    let chapter_id = 'chapter_' + (current_index-1);
                    let chapter_height = await get_height(chapter_id);
                    let scroll_top = content_height - this.screen_height;
                    if(chapter_height > this.screen_height) {
                        scroll_top = content_height - chapter_height - 40;
                    }
                    wx.pageScrollTo({
                        scrollTop: scroll_top,
                        duration: 0,
                        success: () => {
                            setTimeout(() => {
                                this.is_top = false;
                            }, 1000);
                            wx.hideLoading();
                        }
                    });
                })
            }
        }
    },
    async onReachBottom() {
        if(this.is_bottom) {
            return;
        }
        this.is_bottom = true;
        let current_index = parseInt(this.current_chapters[1].chapter_id.split('_')[1]);
        if(current_index === this.title_list.length-1) {
            this.is_finished = true;
            wx.showToast({
                title: '已到达小说底部',
                icon: 'none',
                success: () => {
                    this.is_bottom = false;
                }
            });
        } else {
            wx.showLoading({ title: '加载中', mask: true, });
            let get_url = this.title_list[current_index+1].chapter_link;
            let get_index = current_index + 1;
            let get_chapter = await getchapter(get_index, get_url);
            this.current_chapters.push(get_chapter);
            this.current_chapters.shift();
            this.$nextTick(async () => {
                let chapter_id = 'chapter_' + current_index;
                let chapter_height = await get_height(chapter_id);
                let scroll_top = 0;
                if(chapter_height > this.screen_height) {
                    scroll_top = chapter_height - this.screen_height + 100;
                    // scroll_top = chapter_height - this.screen_height;
                }
                wx.pageScrollTo({
                    scrollTop: scroll_top,
                    duration: 0,
                    success: () => {
                        setTimeout(() => {
                            this.is_bottom = false;
                        }, 1000);
                        wx.hideLoading();
                    }
                });
            })
        }
    },
    onHide() {
        wx.setStorageSync('readstyle', this.readstyle);
        if(this.is_shelf) {
            this.set_history();
            wx.setStorageSync('booklist', this.booklist);
        }
    },
    onUnload() {
        wx.setStorageSync('readstyle', this.readstyle);
        if(this.is_shelf) {
            this.set_history();
        }
        Object.assign(this, this.$options.data());
    },
}
</script>

<style lang="wxss">
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
</style>

<style scoped>
#content {
    overflow-x: hidden;
    text-overflow: clip;
    line-height: 88rpx;
}
#catalogue {
    background: rgba(128, 128, 128, 0.5);
}
#bookmark {
    background: rgba(128, 128, 128, 0.5);
}
.icon-sm {
    width: 42rpx;
    height: 42rpx;
}
.fz-20 {
    font-size: 20rpx;
}
.markitem {
    padding-bottom: 1px;
}
.addshelf {
    height: 120rpx;
}
.addshelf-container {
    width: 60rpx;
    height: 60rpx;
    padding: 20rpx;
    position: absolute;
    top: 0;
    right: 20rpx;
}
.addshelf-img {
    width: 60rpx;
    height: 60rpx;
}
</style>