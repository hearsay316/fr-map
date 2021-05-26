import qs from 'qs';
import { ElLoading, ElMessageBox } from 'element-plus';
import { cookie } from './common';

class AjaxRequest {
    constructor({ baseUrl, timeout }) {
        this.baseURL = baseUrl;
        this.timeout = timeout || 3000;
        this.queue = {};
    }

    merge(options) {
        return { ...options, url: this.baseURL + options.url, timeout: this.timeout };
    }

    deleteQueue(url) {
        delete this.queue[url];
        if (Object.keys(this.queue).length === 0) {
            this.loading ? this.loading.close() : void 0;
        }
    }

    setInterceptor(instance, url) {
        instance.interceptors.request.use((config) => {
            if (Object.keys(this.queue).length === 0) {
                // const hide = message.loading('Action in progress..', 0);
                this.loading = ElLoading.service({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            }
            if (
                !/^application\/json/gi.test(config.headers['Content-Type']) &&
                config.data &&
                Object.prototype.toString.call(config.data).toLowerCase() !== '[object formdata]'
            ) {
                config.data = qs.stringify(config.data);
            }
            this.queue[url] = url;
            if (cookie('get', 'token')) {
                config.headers['Authorization'] = cookie('get', 'token');
            }
            return config;
        });
        // 响应拦截
        // noinspection JSCheckFunctionSignatures
        instance.interceptors.response.use(
            (response) => {
                this.deleteQueue(url);
                const status = response.status;
                const res = response.data;
                if (status == 200 || status == 201 || status == 204) {
                    if (res.resCode == 80001) {
                        // 登录到期
                        ElMessageBox.confirm(res.resMsg, '提示', {
                            confirmButtonText: '重新登录',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(() => {
                                cookie('remove', 'token');
                                localStorage.clear();
                                location.reload();
                            })
                            .catch(() => {
                                cookie('remove', 'token');
                                localStorage.clear();
                                location.reload();
                            });
                        return Promise.reject(res);
                    }

                    return response.data.data;
                }

                return Promise.reject(res);
            },
            (error) => {
                this.deleteQueue(url);
                throw error;
            }
        );
    }

    request(options) {
        let instance = window.axios.create();
        this.setInterceptor(instance, options.url);
        let config = this.merge(options);
        return instance(config);
    }
}

export default AjaxRequest;
