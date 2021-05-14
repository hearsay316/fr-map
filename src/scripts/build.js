import urlData from '../utils/ipconfig';
export function get_proxyList(mode) {
    const proxyList = {};
    let url = urlData(mode);
    // for in 比 Object.keys 在foreach快
    for (let name in url) {
        proxyList[`/${name}`] = {
            target: url[name],
            changeOrigin: true, // 是否跨域
            rewrite: (path) => path.replace(`/${name}`, '')
        };
    }
    console.info(url, '反代理成功');
    return proxyList;
}
