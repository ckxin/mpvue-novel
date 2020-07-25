<template>
  <div id="bookcity" class="bg-dark text-white">
    <headerNav :title="'书城'" :is_back="false" :is_home="false"></headerNav>
    <div id="search" class="row mx-0" :style="{'padding-top': navBarHeight + 'px'}">
      <div class="col-9 ml-5 pl-2 text-center my-auto">
        <input @click="go_search" disabled class="search-input f-2x" type="text" placeholder="请输入作者或小说名称">
      </div>
      <div class="col-2 my-auto text-center">
        <img @click="go_type(0)" class="icon-img" src="../../../static/img/bookcity/fenlei.png" alt="type" >
      </div>
    </div>
    <div id="nav" class="row mx-0 p-2 mt-5 bg-secondary">
      <div class="col-6 text-center">
        <div class="f-3x" @click="go_rank">
           <img class="icon-img v-m" src="../../../static/img/bookcity/paihang.png" alt="rank">
            　排行
        </div>
      </div>
      <div class="col-6 text-center">
          <div class="f-3x" @click="go_end">
            <img class="icon-img v-m" src="../../../static/img/bookcity/wanben.png" alt="endbook">
            　完本
        </div>
      </div>
    </div>

    <div id="content" class="mt-5" v-if="hot_contents.length !== 0">
      <!-- 热门书籍 -->
      <div id="hot">
        <div id="hotcontent" class="row mx-0 pl-3 f-3x font-weight-bold mb-3 text-warning">
            热门书籍
        </div>
        <div class="row p-2 mx-auto" v-for="(item, idx) in hot_contents" :key="idx" @click="go_bookdetail(item.book_name, item.book_link)">
            <div class="col-4 text-center pl-0">
                <img class="fengmian-img v-m" :src="item.img_src" :alt="item.book_name" @error="default_fm">
            </div>
            <div class="col-8 text-left pl-0 my-auto">
                <div id="hot-bookname" class="f-2x font-weight-bold one-line">
                    {{item.book_name}}
                </div>
                <div id="hot-author" class="text-success py-1">
                    {{item.author}}
                </div>
                <div id="hot-intro" class="text-secondary">
                    简介：{{item.intro}}
                </div>
            </div>
        </div>
      </div>
      <!-- 分类书籍 -->
      <div id="type">
        <div class="mt-5" id="type-book" v-for="(item, idx) in type_contents" :key="idx">
            <div id="type-title" class="row mb-3">
                <div id="type-name" class="col-5 f-3x pl-3 font-weight-bold mb-3 text-warning"> {{ item.type_name }} </div>
                <div id="type-more" class="col-6 f-2x text-right pr-4 text-secondary">
                    <span @click="go_type(idx)">更多 ></span>
                </div>
            </div>
            <div id="type-list" class="p-2">
                <div id="first-book" class="row w-100 mx-auto" @click="go_bookdetail(item.first_book_info.first_book_name, item.first_book_info.first_book_link)">
                    <div id="first-book-img" class="col-4 text-center">
                        <img class="fengmian-img v-m" :src="item.first_book_info.first_book_imgsrc" :alt="item.first_book_info.first_book_name" @error="default_fm">
                    </div>
                    <div id="first-book-info" class="col-8 my-auto text-left pl-0">
                        <div class="f-2x font-weight-bold py-2">{{item.first_book_info.first_book_name}}</div>
                        <div>简介：{{item.first_book_info.first_book_intro}}</div>
                    </div>
                </div>
                <div id="other-books" class="row mx-4 px-2 py-4 border-b" v-for="(ele, index) in item.other_books_info" :key="index" @click="go_bookdetail(ele.other_book_name, ele.other_book_link)">
                    <div class="col-6 f-2x one-line">{{ ele.other_book_name }}</div>
                    <div class="col-6 f-2x one-line">作者: {{ ele.other_book_author }}</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import headerNav from '../../components/headerNav';
import get_bookcity from '../../utils/get_bookcity';

const fengmian = require('../../../static/img/fengmian/fengmian1.jpg');
export default {
  data () {
    return {
      hot_contents: [],
      type_contents: [],
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
    go_search() {
      let url = '../citysearch/main';
      wx.navigateTo({url});
    },
    go_bookdetail(book_name, book_link) {
      let info = {book_name, book_link};
      let url = "../bookdetail/main?info=" + JSON.stringify(info);
      wx.navigateTo({ url});
    },
    go_type(idx) {
      let url = '../booktype/main?idx=' + idx;
      wx.navigateTo({url});
    },
    go_rank() {
      let url = '../bookrank/main';
      wx.navigateTo({url});
    },
    go_end() {
      let url = '../bookend/main';
      wx.navigateTo({url});
    }
  },

  async mounted () {
    let res = await get_bookcity();
    this.hot_contents = res.hot_contents;
    this.type_contents = res.type_contents;
  }
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
  width: 90px;
  height: 120px;
}
.intro {
  height: 115px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.border-b {
  border-bottom: 1px solid grey;
}
</style>
