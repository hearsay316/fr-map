import { api } from '../utils/request';
import da from 'element-plus/packages/locale/lang/da';

console.info(api, '请求的基本配置');
// const api = {
//     login:{
//         method: 'post',
//         url:'/sso/login.htm'
//     },
//     logout:{
//         url: '/sso/logout',
//         method: 'post',
//     },
//     getTreeList:{
//         url: '/api-ds/addressBook/listAll.htm',
//         method: 'post'
//     }
// }
// export default Object.keys(api).reduce((pre,serviceName)=>{
//     pre[serviceName]=(options)=>sso.request({
//         ...api[serviceName],
//         ...options
//     })
//     return pre;
// },{})

/**
 * @description 登录
 * @author 张立群
 * @date 2021-05-07
 * @export
 * @param {*} userCode
 * @param {*} userPassword
 * @returns
 */
export function login(userCode, userPassword) {
    return api.request({
        url: '/user/login',
        method: 'post',
        data: {
            userCode,
            userKey: window.md5(userPassword)
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// 天气查询
export function queryWeather(params) {
    return api.request({
        url: '/api-ds/tool/queryWeather',
        method: 'GET',
        params: params
    });
}

export function listDic_values(params) {
    let url = '/api-ds/dic/listDicValues';
    Array.isArray(params)
        ? params.forEach((item, index, arr) => {
              if (index === 0) {
                  return (url += '?' + 'codes=' + item);
              }
              url += '&' + 'codes=' + item;
          })
        : (url += '?' + 'codes=' + params);
    return api.request({
        url: url,
        method: 'GET'
    });
}

///ds/dept/userAndEquipment

// 天气查询
export function userAndEquipment(params) {
    return api.request({
        url: '/api-ds/dept/userAndEquipment',
        method: 'GET'
    });
}
///combatTeam/save 保存作战组
// 天气查询
/**
 * 作战组保存
 * @param data
 * @returns {*}
 */
export function combatTeam_save(data) {
    return api.request({
        url: '/api-ds/combatTeam/save',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
///combatTeam/del/{id}
/**
 * 删除作战组
 * @param data
 * @returns {*}
 */
export function combatTeam_del(data) {
    return api.request({
        url: '/api-ds/combatTeam/del/' + data,
        method: 'DELETE'
    });
}
