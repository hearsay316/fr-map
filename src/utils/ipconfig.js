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
export default (type)=>urlData[type];
