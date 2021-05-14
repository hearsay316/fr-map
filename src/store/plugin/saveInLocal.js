export const saveInLocal = (store) => {
    const userData = localStorage.userData && JSON.parse(localStorage.userData);
    // // 清除loadNaN这个状态可能被falas,导致页面不能正确显示
    !store.state.user.userData && store.commit('user/setUser', userData, { root: true });
};
