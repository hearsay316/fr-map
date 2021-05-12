
import { login } from "../../api/login.js";

const state = {
  userCode: "nanjinghuaita",
  user: null
};

const mutations = {
  setUser(state, data) {
    state.user = data;
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
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
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
