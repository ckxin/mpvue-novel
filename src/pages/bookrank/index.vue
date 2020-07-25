<template>
    <scroll-view id="book-detail" class="text-white h-100" scroll-y>
        <headerNav :title="'排行榜单'" :is_back="true" :is_home="false"></headerNav>
        <div :style="{'padding-top': navBarHeight + 'px'}"></div>
        <div class="row p-5 text-center f-2x">
            <div class="col-4" v-for="(item, index) in rank_type" :key="index"
            :class="type_idx===index ? 'text-success' : ''"
            @click="change_ranktype(index)">
                {{ item.type_name }}
            </div>
        </div>

        <div id="rank-list" v-if="rank_list.length !== 0">
            <div class="row mx-3 px-3 py-5 border-bottom" 
            v-for="(item, idx) in rank_list" :key="idx" 
            @click="go_bookdetail(item.book_name, item.book_link)">
                <span class="f-2x font-italic font-weight-bold text-warning">{{idx+1}}、</span>
                <span class="f-2x text-danger font-weight-bold one-line">{{ item.book_name }}</span>
            </div>
        </div>
    </scroll-view>
</template>

<script>
import { mapState } from 'vuex';
import headerNav from '../../components/headerNav';
import get_bookrank from '../../utils/get_bookrank';

export default {
    data() {
        return {
            rank_list: [],
            rank_type: [
                {type_name: "推荐排行", type_link: "https://www.2952.cc/paihangbang/allvote.html"},
                {type_name: "收藏排行", type_link: "https://www.2952.cc/paihangbang/goodnum.html"},
                {type_name: "新书排行", type_link: "https://www.2952.cc/paihangbang/newbook.html"},
            ],
            type_idx: 0,
        }
    },
    components: {
        headerNav
    },

    computed: {
        ...mapState(['navBarHeight'])
    },
    methods: {
        go_bookdetail(book_name, book_link) {
            let info = {book_name, book_link};
            let url = "../bookdetail/main?info=" + JSON.stringify(info);
            wx.navigateTo({ url});
        },
        async change_ranktype(index) {
            this.rank_list = [];
            this.type_idx = index;
            this.rank_list = await get_bookrank(this.rank_type[index].type_link);
        },
    },

    async mounted() {
        this.rank_list = await get_bookrank(this.rank_type[0].type_link);
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

</style>