<template>
    <div id="header" class="fixed-top" :class="bg ? bg : 'bg-dark'" :style="{hieght: navBarHeight+'px'}">
        <div id="status-bar" :style="{height: statusBarHeight + 'px'}"></div>
        <div id="title-bar" class="row mx-0" :style="{height: titleBarHeight + 'px'}">
            <div class="col-2 text-center my-auto">
                <img @click="go_back" class="icon-img" v-if="is_back" src="../../static/img/header/back.png" alt="back">
            </div>
            <div class="col-2 text-center my-auto">
                <img @click="go_home" class="icon-img"  v-if="is_home" src="../../static/img/header/zhuye.png" alt="home">
            </div>
            <div class="col-4 text-center my-auto f-3x font-weight-bold one-line">
                {{ title }}
            </div>
            <div class="col-2"></div>
            <div class="col-2"></div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    name: "headerNav",
    props: {
        title: String,
        is_back: Boolean,
        is_home: Boolean,
        bg: String
    },
    data() {
        return {
            statusBarHeight: 0,
            titleBarHeight: 0,
            platform: "",
        }
    },
    computed: {
        ...mapState(['navBarHeight'])
    },
    methods: {
        ...mapMutations(['set_navBarHeight']),
        go_back() {
            wx.navigateBack();
        },
        go_home() {
            let url = '/pages/bookcity/main';
            wx.switchTab({url});
        }
    },
    beforeMount() {
        const _this = this;
        wx.getSystemInfo({
            success(system) {
                _this.statusBarHeight = system.statusBarHeight;
                _this.platform = system.platform;

                let platformReg = /ios/i;
                if (platformReg.test(system.platform)) {
                    _this.titleBarHeight = 44;
                } else {
                    _this.titleBarHeight = 48;
                }

                let navBarHeight = _this.statusBarHeight + _this.titleBarHeight;
                _this.set_navBarHeight(navBarHeight);
            }
        });
    }

}
</script>

<style scoped>

</style>