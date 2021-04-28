import {api} from '@/utils/request'
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

import md5 from 'js-md5'
/**
 * @description 登录
 * @author 张立群
 * @date 2020-05-07
 * @export
 * @param {*} userCode
 * @param {*} userPassword
 * @returns
 */
export function login(userCode, userPassword) {
    return api({
        url: '/user/login',
        method: 'post',
        data: {
            userCode,
            userKey: md5(userPassword)
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


