import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    booklist: [],
    navBarHeight: 0,
    is_show_addshelf_warn: true,
}

const mutations = {
    set_booklist(state, booklist) {
        state.booklist = booklist;
    },
    set_navBarHeight(state, navBarHeight) {
        state.navBarHeight = navBarHeight;
    },
    set_is_show_addshelf_warn(state, is_show_addshelf_warn) {
        state.is_show_addshelf_warn = is_show_addshelf_warn;
    }
}

export default new Vuex.Store({
    state, mutations
})