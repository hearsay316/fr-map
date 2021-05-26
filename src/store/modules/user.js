import { listDic_values, login } from '../../api/login.js';

const state = {
    userCode: 'nanjinghuaita',
    userData: null,
    listDic_values: undefined
};

const mutations = {
    setUser(state, data) {
        state.userData = data;
    },
    set_listDic_values(state, data) {
        state.listDic_values = data;
    }
};

const actions = {
    // 假登陆
    login({ state }, { userCode, userPassword }) {
        console.log(state);
        return new Promise((resolve, reject) => {
            login({
                userCode,
                userPassword
            })
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    /**
     * 获取作战状态的配置表
     * @param state
     * @returns {*}
     */
    get_listDic_values({ state, commit }) {
        return listDic_values('combat-team-status')
            .then((res) => {
                console.log(res);
                commit('set_listDic_values', res?.[0]?.values);
                return res?.[0]?.values;
            })
            .catch((error) => {
                throw error;
            });
    }
};

const user = {
    namespaced: true,
    state,
    mutations,
    actions
};

export default user;
