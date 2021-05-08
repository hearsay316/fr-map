const urlData = {
    production: {
        api: "http://47.103.1.161/huaita"
    },
    staging: {
        api: "http://47.103.1.161/huaita"
    },
    development: {
        api: "http://47.103.1.161/huaita"
    }
};
export default (type) => urlData[type];
const mqttData = {
    production: {
        clientId: "stage",
        username: "test",
        password: "passwd",
        url: "ws://58.213.48.218:12080/ws-stage/"
    },
    staging: {
        clientId: "stage",
        username: "test",
        password: "passwd",
        url: "ws://58.213.48.218:12080/ws-stage/"
    },
    development: {
        clientId: "stage",
        username: "test",
        password: "passwd",
        url: "ws://58.213.48.218:12080/ws-stage/"
    }
};
export const mqttBaseFun = (type) => mqttData[type]
//mqttData[import.meta.env.VITE_NODE_ENV];
