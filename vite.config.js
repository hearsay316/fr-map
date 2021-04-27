import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import urlData from "./src/utils/ipconfig";
import path from 'path'
import resolveExternalsPlugin from 'vite-plugin-resolve-externals'
const projectRootDir = path.resolve(__dirname);
export default ({command, mode}) => {
    const proxyList = {};
// const name = 'ME管理平台'
    Object.keys(urlData[mode]).forEach(index => {
        proxyList[`/${index}`] = {
            target: urlData[mode][index],
            changeOrigin: true, // 是否跨域
            pathRewrite: {
                [`^/${index}`]: "" // 重写接口
            }
        };
    });
    return defineConfig({
        plugins: [vue(), resolveExternalsPlugin({
            echarts: 'echarts',
            axios: 'axios'
        })],
        base: "./",
        server: {
            proxy: proxyList
        },
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: path.resolve(projectRootDir, 'src'),
                },
            ],
        },


    })
}
