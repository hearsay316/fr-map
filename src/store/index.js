import { createStore } from 'vuex';
import user from './modules/user';
import { saveInLocal } from './plugin/saveInLocal';
export default createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: { user },
    plugins: [saveInLocal]
});
