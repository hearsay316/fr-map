import axios from '@/utils/axios'
import get_baseURL from "@/utils/ipconfig.js"
const  process = import.meta.env.VITE_NODE_ENV
const baseURL = get_baseURL(process)
const $http = Object.keys(baseURL).reduce((cur, item) => {
    cur[item] = new axios({baseUrl: process === 'development' ? `/${item}` : baseURL[item], timeout: 4000})
    return cur
}, {})
export default $http
export const sso = $http.sso
export const api = $http.api

