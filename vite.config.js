import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import styleImport from 'vite-plugin-style-import';
import resolveExternalsPlugin from 'vite-plugin-resolve-externals';
import { get_proxyList } from './src/scripts/build';
const projectRootDir = path.resolve(__dirname);
export default ({ command, mode }) => {
    process.env.NODE_ENV = mode;
    console.log(process.env.NODE_ENV, 'modemode');
    return defineConfig({
        plugins: [
            vue(),
            styleImport({
                libs: [
                    {
                        libraryName: 'element-plus',
                        esModule: true,
                        ensureStyleFile: true,
                        resolveStyle: (name) => {
                            name = name && name.slice(3);
                            return `element-plus/packages/theme-chalk/src/${name}.scss`;
                        },
                        resolveComponent: (name) => {
                            return `element-plus/lib/${name}`;
                        }
                    }
                ]
            }),
            resolveExternalsPlugin({
                echarts: 'echarts',
                axios: 'axios',
                md5: 'md5'
            })
        ],
        base: './',
        server: {
            proxy: get_proxyList(mode)
        },
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: path.resolve(projectRootDir, 'src')
                }
            ]
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "./src/assets/base.scss";'
                }
            }
        }
    });
};
