<template>
  <div id="booktype" class="h-100 text-white">
    <headerNav :title="'分类'" :is_back="true" :is_home="false"></headerNav>
    <view-scroll :scroll-x='true' id="type-top" class="fixed-top bg-dark p-4 slider"
    :style="{'top': navBarHeight + 'px'}">
           <div class="f-2x slider-item" 
           v-for="(item, idx) in booktypes" :key="idx"
           :style="type_idx===idx ? {background: 'green'} : ''"
           @click="change_typeidx(idx)">
            {{ item.type_name }}
           </div>
    </view-scroll>
    <div :style="{'padding-top': (top_height+navBarHeight) + 'px'}"></div>
    <view-scroll id="type-content" :scroll-y='true' class="h-100" enable-back-to-top>
      <div class="row border-bottom mx-2 px-2 py-5" v-for="(item, index) in type_list" :key="index" @click="go_bookdetail(item.book_name, item.book_link)">
        <div class="col-6 one-line f-2x font-weight-bold">{{ item.book_name }}</div>
        <div class="col-6 one-line f-2x">作者：{{ item.book_author }}</div>
        <div class="col-12 one-line f-2x text-secondary pt-3">最新章节：{{ item.latest_chapter }}</div>
      </div>
    </view-scroll>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import headerNav from '../../components/headerNav';
import booktypes from '../../utils/booktypes';
import get_typelist from '../../utils/get_typelist';
// const basic_novel_url = "https://www.2952.cc";
export default {
  data () {
    return {
      top_height: 0,
      booktypes: booktypes,
      type_idx: 0,
      type_list: [],
      list_page_num: 0,
      basic_typeurl: "",
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
    async change_typeidx(idx) {
      this.type_list = [];
      this.current_list_page = 1;
      this.type_idx = idx;
      let res = await get_typelist(booktypes[idx].type_link);
      this.type_list = res.type_list;
      this.list_page_num = res.list_page_num;
      this.basic_typeurl = res.basic_typeurl;
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
      let url = this.basic_typeurl + this.current_list_page + ".html";
      let res = await get_typelist(url);
      let type_list = res.type_list;
      this.type_list = this.type_list.concat(type_list);
    }
  },

  async mounted() {
    let idx = this.$root.$mp.query.idx;
    idx = parseInt(idx);
    wx.createSelectorQuery().select('#type-top').boundingClientRect((rect) => {
      this.top_height = rect.height;
    }).exec();
    this.type_idx = idx;
    let res = await get_typelist(booktypes[idx].type_link);
    this.type_list = res.type_list;
    this.list_page_num = res.list_page_num;
    this.basic_typeurl = res.basic_typeurl;
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
  background: #343a40;
  border-radius: 5px;
  padding: 10px 15px;
}
</style>
