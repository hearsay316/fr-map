import AjaxRequest from './AjaxRequest'
import get_baseURL from "@/utils/ipconfig.js"
const  process = import.meta.env.VITE_NODE_ENV
const baseURL = get_baseURL(process)
const $http = Object.keys(baseURL).reduce((cur, item) => {
    console.log(item,'itemitem')
    cur[item] = new AjaxRequest({timeout: 4000})
    return cur
}, {})
export default $http
export const api = $http.api

