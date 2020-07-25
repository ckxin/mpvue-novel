<template>
  <div id="bookend" class="h-100 text-white">
    <headerNav :title="'完本小说'" :is_back="true" :is_home="false"></headerNav>
    <div :style="{'padding-top': navBarHeight + 'px'}"></div>
    <div id="end-main" v-if="endbook_list.length !== 0">
      <div class="pl-5 font-weight-bold bg-secondary row py-2 f-3x">
        <span class="bg-danger" style="padding: 1px 2px"></span>
        <span class="px-1"></span>
        热门完本
      </div>
      <div id="hot-content" class="px-2 py-5 slider">
        <div class="text-center slider-item" 
        v-for="(item, idx) in hot_contents" :key="idx"
        @click="go_bookdetail(item.book_name, item.book_link)">
          <div id="book-img">
              <img class="fm-img" :src="item.book_imgsrc" :alt="item.book_name" @error="default_fm">
          </div>
          <div id="book-name" class="f-2x one-line">
              {{ item.book_name }}
          </div>
          <div id="book-author" class="text-secondary">
              {{ item.book_author }}
          </div>
        </div>
      </div>

      <div class="row mx-0 pl-5 py-2 bg-secondary font-weight-bold f-3x">
        <span class="bg-danger" style="padding: 1px 2px"></span>
        <span class="px-1"></span>
        完本列表
      </div>
      <div class="mx-3 px-3 py-5 border-bottom" v-for="(item, idx) in endbook_list" :key="idx" @click="go_bookdetail(item.book_name, item.book_link)">
        <div id="book-name" class="w-100 one-line f-2x font-weight-bold">{{ item.book_name }}</div>
        <div id="book-author" class="w-100 one-line text-success py-2">{{ item.book_author }}</div>
        <div id="latest-chapter" class="w-100 one-line text-secondary">最新：{{ item.latest_chapter }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import headerNav from '../../components/headerNav';
import get_endbook from '../../utils/get_endbook';

const first_url = "https://www.2952.cc/wanben/1.html";
const fengmian = require('../../../static/img/fengmian/fengmian1.jpg');
export default {
  data () {
    return {
      hot_contents: [],
      endbook_list: [],
      list_page_num: 0, 
      basic_endurl: "",
      current_list_page: 1,
    }
  },

  components: {
    headerNav
  },

  computed: {
    ...mapState(['navBarHeight'])
  },
  methods: {
    default_fm() {
      this.book_imgsrc = fengmian;
    },
    go_bookdetail(book_name, book_link) {
      let info = {book_name, book_link};
      let url = "../bookdetail/main?info=" + JSON.stringify(info);
      wx.navigateTo({ url});
    },
  },

  async onReachBottom() {
    this.current_list_page++;
    if(this.current_list_page > this.list_page_num) {
      wx.showToast({
        title: '已到达最后一页！',
        duration: 1500,
        mask: false,
      });
      return;
    } else {
      let url = this.basic_endurl + this.current_list_page + ".html";
      let res = await get_endbook(url);
      let endbook_list = res.endbook_list;
      this.endbook_list = this.endbook_list.concat(endbook_list);
    }
  },

  async mounted() {
    let res = await get_endbook(first_url);
    this.hot_contents = res.hot_contents;
    this.endbook_list = res.endbook_list;
    this.list_page_num = res.list_page_num;
    this.basic_endurl = res.basic_endurl;
  },

  onUnload() {
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
.btn-hover {
  background: greenyellow;
}

.fm-img {
  width: 160rpx;
  height: 200rpx;
}

.slider {
  white-space: nowrap;
  overflow-x: auto;
}
.slider::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
.slider-item {
  display: inline-block;
  width: 160rpx;
  margin: 0 16rpx;
}
</style>
