const mqttData = {
  production: {
    clientId: "stage",
    username: "test",
    password: "passwd",
    url: "wss://www.huaitaos.com:8445"
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
export default mqttData[import.meta.env.VITE_NODE_ENV];

