import urlData from "../utils/ipconfig";
 // new RegExp(`//^\\/${name}`)
export function get_proxyList(mode){
    const proxyList = {};
    let url =  urlData(mode)
    console.log(url,'url')
    // for in 比 Object.keys 在foreach快
    for (let name in url ){
        console.log(name)
        proxyList[`/${name}`] = {
            target: url[name],
            changeOrigin: true, // 是否跨域
            ///^\/api/  ^\/api
            rewrite: (path) => path.replace(`/${name}`, '')
        };
    }
    console.log(proxyList,'ddd')
    return proxyList
}
