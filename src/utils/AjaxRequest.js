import qs from 'qs'
import { ElLoading } from 'element-plus';
class AjaxRequest {
    constructor({baseUrl, timeout}) {
        this.baseURL = baseUrl;
        this.timeout = timeout || 3000;
        this.queue = {};
    }
    merge(options) {
        return {...options, baseURL: this.baseURL, timeout: this.timeout};
    }
    deleteQueue(url) {
        delete this.queue[url];
        if (Object.keys(this.queue).length === 0) {
            this.loading ? this.loading.close() : void 0;
        }
    }
    setInterceptor(instance, url) {
        instance.interceptors.request.use(config => {
            if (Object.keys(this.queue).length === 0) {
                // const hide = message.loading('Action in progress..', 0);
                let loadingInstance = ElLoading.service({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.loading =loadingInstance
            }
            if (!/^application\/json/gi.test(config.headers['Content-Type']) && config.data && Object.prototype.toString.call(config.data).toLowerCase() !== '[object formdata]') {
                config.data = qs.stringify({
                    ...config.data
                })
            }
            this.queue[url] = url;
            return config;
        });
        // 响应拦截
        // noinspection JSCheckFunctionSignatures
        instance.interceptors.response.use(
            response => {
                this.deleteQueue(url);
                const status = response.status
                const res = response.data
                if (status == 200 || status == 201 || status == 204) {
                    return response.data.data
                } else {
                    return Promise.reject(res)
                }
            },
            error => {
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
export default AjaxRequest
