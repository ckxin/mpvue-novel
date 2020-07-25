<template>
  <div id="bookshelf" class="h-100 text-white">
    <headerNav :title="'书架'" :is_back="false" :is_home="false"></headerNav>
    <div id="shelf-top" class="fixed-top bg-dark p-2 row mx-0 f-2x font-weight-bold"
    :style="{'top': navBarHeight + 'px'}" v-if="!is_select">
      <div class="col-9 pl-5">
        <input @click="go_search" disabled class="search-input" type="text" placeholder="请输入小说名称">
      </div>
      <div class="col-2 text-center my-auto">
        <img @click="more" src="../../../static/img/bookshelf/gengduo_light.png" alt="more" class="icon-img">
      </div>
    </div>
    <div v-if="is_select">
      <div id="select-top" class="fixed-top bg-night p-5 row mx-0 f-2x"
      :style="{'top': navBarHeight + 'px'}">
        <div class="col-6 text-left text-success"><span class="p-2" @click="select_finish">完成</span></div>
        <div class="col-6 text-right text-warning"><span class="p-2" @click="select_all">全选</span></div>
      </div>
      <div id="select-top" class="fixed-bottom bg-night p-5 row f-2x">
        <div class="col-12 text-center text-danger"><span class="p-2" @click="delete_book">删除</span></div>
      </div>
    </div>
    <div :style="{'padding-top': (top_height+navBarHeight)+'px'}"></div>
    <div id="shelf-content" class="pt-3">
      <div id="nobook" v-if="booklist.length === 0">
        <div class="row mx-0 py-3 pl-5 f-3x text-danger">{{ no_book }}</div>
        <div @click="go_bookdetail(item.book_name, item.book_link)" id="hot-content" class="row mx-0  py-2"
           v-for="(item, idx) in hot_contents" :key="idx">
          <div class="col-4 text-center">
            <img :src="item.img_src" :alt="item.book_name" 
            @error="default_fm"
            class="fengmian-img">
          </div>
          <div class="col-8 text-left my-auto">
            <div class="one-line f-2x">{{ item.book_name }}</div>
            <div class="one-line text-secondary">作者：{{ item.author }}</div>
          </div>
        </div>
      </div>
      <div id="booklist" v-else>
        <div class="row" v-if="bookview === 'shelf'">
          <div class="col-4 py-3 text-center" v-for="(item, idx) in booklist" :key="idx">
            <img @click="bookprocess(item)" :src="item.book_imgsrc" :alt="item.book_name" 
            @error="default_fm"
            style="width: 180rpx; height: 240rpx">
            <div style="width: 180rpx;" class="two-line mx-auto f-2x">{{ item.book_name }}</div>
            <div class="text-secondary">{{ item.read_schedule }}</div>
            <div v-if="is_select" class="select">
              <img :src="item.selected ? select_after : select_before" alt="select" class="select-img">
            </div>
          </div>
        </div>
        <div v-else>
          <div @click="bookprocess(item)" class="row py-3 mx-2 border-bottom" v-for="(item, idx) in booklist" :key="idx">
            <div class="col-4 text-center">
              <img :src="item.book_imgsrc" :alt="item.book_name" 
              @error="default_fm"
              class="fengmian-img">
            </div>
            <div class="col-8 text-left my-auto">
              <div class="one-line f-2x pb-2">{{ item.book_name }}</div>
              <div class="one-line text-secondary">{{ item.read_schedule }}</div>
              <div v-if="is_select" class="select">
                <img :src="item.selected ? select_after : select_before" alt="select" class="select-img">
              </div>
            </div>
          </div>
        </div>  
      </div>
      <div v-if="is_select" style="height: 95rpx"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import cheerio from 'cheerio';
import headerNav from '../../components/headerNav';
import get_html from '../../utils/get_html';
import deep_clone from '../../utils/deep_clone';
const basic_novel_url = "https://www.2952.cc";
const fengmian = require('../../../static/img/fengmian/fengmian1.jpg');
const select_before = require('../../../static/img/bookshelf/select_before.png');
const select_after = require('../../../static/img/bookshelf/select_after.png');

export default {
  data () {
    return {
      no_book: "加载中...",
      top_height: 0,
      hot_contents:[],
      bookview: 'shelf',
      select_before,
      select_after, 

      is_select: false,
      is_select_all: false,
    }
  },

  components: {
    headerNav
  },

  computed: {
    ...mapState(['booklist', 'navBarHeight'])
  },
  methods: {
    ...mapMutations(['set_booklist']),
    default_fm() {
      this.book_imgsrc = fengmian;
    },
    go_bookdetail(book_name, book_link) {
      let info = {book_name, book_link};
      let url = "../bookdetail/main?info=" + JSON.stringify(info);
      wx.navigateTo({ url});
    },
    bookprocess(book) {
      if(this.is_select) {
        let booklist = deep_clone(this.booklist);
        let index = booklist.findIndex(item => {
          return item.book_name === book.book_name;
        });
        booklist[index].selected = !booklist[index].selected;
        this.set_booklist(booklist);
      } else {
        let url = '../bookread/main?book=' + JSON.stringify(book);
        wx.navigateTo({url});
      }
    },
    go_search() {
      let url = '../citysearch/main';
      wx.navigateTo({url});
    },
    more() {
      wx.showActionSheet({
        itemList: ['选择', '切换书架视图'],
        itemColor: '#000000',
        success: (res)=>{
          if(res.tapIndex === 0) {
            this.is_select = true;
          }
          if(res.tapIndex === 1) {
            if(this.bookview === 'shelf') {
              this.bookview = 'list';
            } else {
              this.bookview = 'shelf';
            }
          }
        },
      });
    },

    select_finish() {
      this.is_select = false;
      let booklist = deep_clone(this.booklist);
      for(let i=0; i<booklist.length ; i++) {
        booklist[i].selected = false;
      }
      this.set_booklist(booklist);
    },
    select_all() {
      let booklist = deep_clone(this.booklist);
      for(let i=0; i<booklist.length ; i++) {
        if(this.is_select_all) {
          booklist[i].selected = false;
        } else {
          booklist[i].selected = true;
        }
      }
      this.set_booklist(booklist);
      this.is_select_all = !this.is_select_all;
    },
    delete_book() {
      wx.showModal({
        title: '是否删除选中书籍？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#28a745',
        confirmText: '确定',
        confirmColor: '#dc3545',
        success: (result) => {
          if(result.confirm){
            let booklist = deep_clone(this.booklist);
            for(let i=0; i<booklist.length; i++) {
              if(booklist[i].selected === true) {
                delete booklist[i];
              }
            }
            booklist = booklist.filter(item => {
              return item !== undefined;
            });
            this.set_booklist(booklist);  
            this.is_select = false; 
          }
        },
      });
    }
  },

  async mounted () {
    let _this = this;
    wx.createSelectorQuery().select('#shelf-top').boundingClientRect(function(rect){
      _this.top_height = rect.height;
    }).exec()
    try {
      let booklist = wx.getStorageSync('booklist');
      let bookview = wx.getStorageSync('bookview');
      if(booklist && booklist.length>0) {
        this.set_booklist(booklist);
        if(bookview) {
          this.bookview = bookview;
        }
      } else {
        this.no_book = "书架暂无书籍，推荐："
        try {
          let html = await get_html(basic_novel_url);
          let $ = cheerio.load(html);
          let hot_contents = [];
          let hot_content_boxs = $('.item', '#hotcontent');
          for(let i=0; i<hot_content_boxs.length; i++) {
              let img_src = $(hot_content_boxs[i]).find('.image').find('img').attr('src');
              let book_link = $(hot_content_boxs[i]).find('.image').find('a').attr('href');
              let author = $(hot_content_boxs[i]).find('dl').find('dt').find('span').text();
              let book_name = $(hot_content_boxs[i]).find('dl').find('dt').find('a').text();
              let intro = $(hot_content_boxs[i]).find('dl').find('dd').text().split('\n')[0];
              hot_contents.push({img_src, book_link, author, book_name, intro});
          }
          this.hot_contents = hot_contents;

        } catch(e) {
          console.log("home get html error:");
          console.log(e);
        }
      }
    } catch(e) {
      console.log('get booklist error:');
      console.log(e);
    }
  },

  onHide() {
    wx.setStorageSync('booklist', this.booklist);
    wx.setStorageSync('bookview', this.bookview);
  },
  onUnload() {
    console.log("unload");
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
.fengmian-img {
  width: 140rpx;
  height: 180rpx;
}
.select {
  position: absolute;
  top: 0rpx;
  right: 20rpx;
}
.select-img {
  width: 40rpx;
  height: 40rpx;
}
</style>
