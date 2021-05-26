import { api } from '../utils/request';

/**
 * http://47.103.1.161/ds/doc.html#/default/%E4%BD%9C%E6%88%98%E7%BB%84/pageListUsingGET
 * @param params
 * @returns {*}
 */
export function combatTeam_pageList(params) {
    return api.request({
        url: '/api-ds/combatTeam/pageList',
        method: 'GET',
        params: params
    });
}
