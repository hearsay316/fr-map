import mqtt from "mqtt";
import {ElNotification} from "element-plus";
import {checkType, parseTime} from "../../utils/common";
import { mqttBaseFun} from "../../utils/ipconfig";
const mqttBase = mqttBaseFun(import.meta.env.VITE_NODE_ENV)
const message = {
    namespaced: true,
    state: {
        client: "", // mqtt客户端
        resMsgNews: [], // 资源信息
        recoNews: [], // 恢复信息
        chiefNews: [], // 总指挥指令
        sceneNews: [], // 现场指挥指令
        actionsNews: [], // 救援动作情况指令
        reConCount: 0, // 重连次数
        reReload: 0, // 刷新次数
        task: [], // 任务指令
        directIsEdit: false // 指令是否被修改
    },
    mutations: {
        // 修改指令是否被修改
        SET_DIRECT_IS_EDIT(state, flag) {
            state.directIsEdit = flag;
        },
        // 整体存储任务指令、更新任务指令
        SET_TASK(state, {data, type}) {
            if (Array.isArray(data) && type === "put") {
                // 整体存储指令
                state.task = data;
            } else if (type === "reply") {
                // 回复指令
                const taskIndex = state.task.findIndex(
                    item => item.taskId === data.taskId
                ); // 对应的任务
                if (
                    taskIndex !== -1 &&
                    state.task[taskIndex] &&
                    state.task[taskIndex].chatroomTaskUserList &&
                    checkType(state.task[taskIndex].chatroomTaskUserList)
                ) {
                    const teamIndex = state.task[
                        taskIndex
                        ].chatroomTaskUserList.findIndex(
                        item => item.teamName === data.teamName
                    ); // 对应的小组
                    console.log(
                        taskIndex,
                        state.task,
                        state.task[taskIndex].chatroomTaskUserList[teamIndex],
                        "state.taskstate.task"
                    );
                    state.task[taskIndex].chatroomTaskUserList[0].complete =
                        data.complete;
                    state.task[
                        taskIndex
                        ].chatroomTaskUserList[0].chatroomTaskUserReplyList.push({
                        ...data
                    });
                }
            } else if (type === "add") {
                // 发布指令
                // console.log(data)
                state.task.push(data);
            } else if (type === "update") {
                // 修改指令
                state.directIsEdit = true;
            } else if (type === "delete") {
                // 修改指令
                state.task = state.task.filter(item => item.taskId !== data.taskId);
            } else if (type === "complete") {
                console.log(type, data);
                state.task = state.task.map(item => {
                    item.taskId === data.taskId && (item.taskType = "1");
                    return item;
                });
            }
        },
        // 存储 总指挥指令
        SET_CHIEFNEWS(state, data) {
            if (checkType(data) === "array") {
                state.chiefNews = data;
            } else if (checkType(data) === "object") {
                state.chiefNews.push(data);
            } else {
                state.chiefNews = [];
            }
        },
        // 存储 现场指挥指令
        SET_SECENENEWS(state, data) {
            if (checkType(data) === "array") {
                state.sceneNews = data;
            } else if (checkType(data) === "object") {
                state.sceneNews.push(data);
            } else {
                state.sceneNews = [];
            }
        },
        // 存储 救援动作情况指令
        SET_ACTIONNEWS(state, data) {
            if (checkType(data) === "array") {
                state.actionsNews = data;
            } else if (checkType(data) === "object") {
                state.actionsNews.push(data);
            } else {
                state.actionsNews = [];
            }
        },
        // 存储 资源信息
        SET_RESMSGNEWS(state, data) {
            if (checkType(data) === "array") {
                state.resMsgNews = data;
            } else if (checkType(data) === "object") {
                state.resMsgNews.push(data);
            } else {
                state.resMsgNews = [];
            }
        },
        // 存储 恢复信息
        SET_RECONEWS(state, data) {
            if (checkType(data) === "array") {
                state.recoNews = data;
            } else if (checkType(data) === "object") {
                !state.recoNews[data.posi] && (state.recoNews[data.posi] = []);
                // var temp = state.recoNews
                if (data._type === "add") {
                    state.recoNews[data.posi].push(data);
                } else if (data._type === "update" || data._type === "delete") {
                    const ind = state.recoNews[data.posi].findIndex(
                        t => t.id === data.id
                    );
                    if (ind !== -1) {
                        if (data._type === "update") {
                            state.recoNews[data.posi].splice(ind, 1, data); // 先删除后添加解决不更新问题
                        } else {
                            state.recoNews[data.posi].splice(ind, 1); // 直接删除
                        }
                    }
                }
                // else if (data._type === 'delete') {
                //   const ind = state.recoNews[data.posi].findIndex(item => item.id === data.id)
                //   ind !== -1 && state.recoNews[data.posi].splice(ind, 1)
                // }
                // state.recoNews = Object.assign([], temp)
            } else {
                state.recoNews = [];
            }
        },
        // 存储 client
        SET_MQTTCLIENT(state, data) {
            state.client = data;
        }
    },
    actions: {
        // 断开连接
        mqtt_handle_end({state}) {
            console.log("mqtt关闭");
            state.client.end();
        },
        // 重新连接mqtt
        mqtt_handle_reconnect({state}) {
            state.client.reconnect();
            console.log("mqtt正在重连");
        },
        // 监听断开
        disconnect_mqtt({state}) {
            state.client.on("disconnect", function (err) {
                // dispatch('connect_mqtt')
                console.log("mqtt监听到disconnect", err);
            });
        },
        // 监听离线
        offline_mqtt({state}) {
            state.client.on("offline", function (err) {
                // dispatch('mqtt_handle_reconnect')
                console.log("mqtt监听到offline", err);
            });
        },
        // 监听重连
        reconnect_mqtt({state}) {
            state.client.on("reconnect", function (err) {
                console.log("mqtt监听到reconnect", err);
            });
        },
        // 监听报错
        error_mqtt({state}) {
            state.client.on("error", function (err) {
                // dispatch('mqtt_handle_end')
                // dispatch('connect_mqtt')
                console.log("mqtt监听到error", err);
            });
        },
        // 监听关闭
        close_mqtt({state}) {
            state.client.on("close", function (err) {
                // dispatch('connect_mqtt')
                console.log("mqtt监听到close", err);
            });
        },
        // 监听结束
        end_mqtt({state}) {
            state.client.on("end", function (err) {
                // dispatch('mqtt_handle_reconnect')
                // dispatch('connect_mqtt')
                console.log("mqtt监听到end", err);
            });
        },
        // 连接消息服务器
        connect_mqtt({state, commit, dispatch}) {
            if (state.client && state.client.connected) {
                try {
                    state.client.end();
                } catch {
                    // console.log(state.client)
                }
            }
            console.log(
                "clientId",
                process.env.NODE_ENV === "production"
                    ? mqttBase.clientId +
                    Math.random()
                        .toString()
                        .slice(2, 7)
                    : process.env.VUE_APP_CLIENTID +
                    Math.random()
                        .toString()
                        .slice(2, 7)
            );
            const client = mqtt.connect(`${mqttBase.url}`, {
                clientId:
                    process.env.NODE_ENV === "production"
                        ? mqttBase.clientId +
                        Math.random()
                            .toString()
                            .slice(2, 7)
                        : process.env.VUE_APP_CLIENTID +
                        Math.random()
                            .toString()
                            .slice(2, 7),
                clean: false,
                username: mqttBase.username,
                password: mqttBase.password
            });
            commit("SET_MQTTCLIENT", client); // 存储client
            // client.on('connect', function(e, c) {
            //   dispatch('mqtt_handle_sub') // 订阅主题
            //   dispatch('mqtt_handle_listen') // 监听收到的消息
            //   dispatch('disconnect_mqtt') // 监听断开
            //   dispatch('offline_mqtt')// 监听离线
            //   dispatch('reconnect_mqtt')// 监听重连
            //   dispatch('error_mqtt')// 监听报错
            //   dispatch('close_mqtt') // 监听关闭
            //   dispatch('end_mqtt')// 监听结束
            // })
            dispatch("mqtt_handle_sub"); // 订阅主题
            dispatch("mqtt_handle_listen"); // 监听收到的消息
            dispatch("disconnect_mqtt"); // 监听断开
            dispatch("offline_mqtt"); // 监听离线
            dispatch("reconnect_mqtt"); // 监听重连
            dispatch("error_mqtt"); // 监听报错
            dispatch("close_mqtt"); // 监听关闭
            dispatch("end_mqtt"); // 监听结束
            // client.on('pingreq', function(packet) {
            //   client.pingresp()
            //   console.log('pingreq & resp')
            // })
        },
        // 连接成功后 订阅主题
        mqtt_handle_sub({state}) {
            return new Promise((resolve, reject) => {
                if (!status) {
                    state.client.subscribe(
                        ["ComplaintOrder", "alarm/#"],
                        {qos: 2},
                        (err, granted) => {
                            if (!err) {
                                console.log(granted);
                                resolve();
                            } else {
                                console.log("订阅出错");
                                reject();
                            }
                        }
                    );
                }
                if (status) {
                    state.client.unsubscribe(
                        ["ComplaintOrder", "alarm/#"],
                        {qos: 2},
                        err => {
                            if (!err) {
                                console.log("取消订阅");
                                resolve();
                            } else {
                                console.log("取消订阅出错");
                                reject();
                            }
                        }
                    );
                }
            });
        },
        // 订阅响应状态
        mqtt_sub_status({state}, status) {
            return new Promise((resolve, reject) => {
                if (!status) {
                    state.client.subscribe("resStatus", {qos: 2}, (err, granted) => {
                        if (!err) {
                            console.log(granted);
                            resolve();
                        } else {
                            console.log("订阅出错");
                            reject();
                        }
                    });
                }
                if (status) {
                    state.client.unsubscribe("resStatus", {qos: 2}, err => {
                        if (!err) {
                            console.log("取消订阅");
                            resolve();
                        } else {
                            console.log("取消订阅出错");
                            reject();
                        }
                    });
                }
            });
        },
        // 订阅聊天室
        mqtt_sub_chatroom({state, rootState}, status) {
            return new Promise((resolve, reject) => {
                let eventId = "";
                let recordId = "";
                try {
                    // eventId = rootGetters.plans.event.eventDtoList.id
                    eventId = rootState.start.events.recordId;
                    console.log(eventId, rootState, "eventIdeventIdeventId");
                    recordId = "1"; // 演练编号id
                } catch {
                    reject(`获取不到事件id或演练编号`);
                }
                const topic = `chatroom/${eventId}/${recordId}/#`;
                console.log("聊天室的topic", topic);
                // 订阅
                if (!status) {
                    state.client.subscribe(topic, {qos: 2}, (err, granted) => {
                        if (!err) {
                            console.log(granted);
                            resolve();
                        } else {
                            console.log("订阅出错");
                            reject();
                        }
                    });
                }
                // 取消订阅
                if (status) {
                    state.client.unsubscribe(topic, {qos: 2}, (err, granted) => {
                        if (!err) {
                            console.log("取消订阅", granted);
                            resolve();
                        } else {
                            console.log("取消订阅出错");
                            reject();
                        }
                    });
                }
            });
        },
        // 订阅回复任务 发布任务
        mqtt_sub_task({state, rootState}, status) {
            return new Promise((resolve, reject) => {
                const eventId = rootState.start.events.id;
                // 订阅
                if (!status) {
                    state.client.subscribe(
                        [`task${eventId}`, `directive${eventId}`],
                        {qos: 2},
                        (err, granted) => {
                            if (!err) {
                                console.log(granted);
                                resolve();
                            } else {
                                console.log("订阅出错");
                                reject();
                            }
                        }
                    );
                }
                // 取消订阅
                if (status) {
                    state.client.unsubscribe(
                        [`task${eventId}`, `directive${eventId}`],
                        {qos: 2},
                        (err, granted) => {
                            if (!err) {
                                console.log("取消订阅", granted);
                                resolve();
                            } else {
                                console.log("取消订阅出错");
                                reject();
                            }
                        }
                    );
                }
            });
        },
        // 监听收到的消息
        mqtt_handle_listen({state, commit, dispatch, rootState}) {
            state.client.on("message", async function (topic, message) {
                console.log(message.toString(), topic);
                let data;
                // 判断消息格式是否合法
                try {
                    data = JSON.parse(message.toString());
                } catch {
                    console.log("消息格式不合法！");
                    return false;
                }
                console.log("mqtt收到消息", data, topic);
                let updateOne;
                // 接受事件
                switch (topic) {
                    // 新增接警
                    case "alarm/add":
                        ElNotification.info({
                            title: "消息",
                            message: "有新接警！"
                        });
                        // 播放声音
                        // commit("plan/SET_audioNums", 1, {
                        //   root: true
                        // });
                        // 存储
                        dispatch(
                            "alarm/getOneAlarm",
                            {id: data.id, type: "add"},
                            {
                                root: true
                            }
                        );
                        break;
                    // 网格员、值班员确认 接警
                    case "alarm/confirm":
                        ElNotification.success({
                            title: "消息",
                            message: "核查已被接单"
                        });
                        updateOne = await dispatch(
                            "alarm/getOneAlarm",
                            {id: data.id, type: "update"},
                            {
                                root: true
                            }
                        );
                        // 动态更新确认接单
                        !updateOne ||
                        dispatch(
                            "alarm/updateOneAlarm",
                            {id: data.id, updateOne, topic},
                            {
                                root: true
                            }
                        );
                        break;
                    // 网格员、值班员确认 取消核查单
                    case "alarm/reject":
                        ElNotification.error({
                            title: "消息",
                            message: "有核查被退回，需要重新指派！"
                        });
                        updateOne = await dispatch(
                            "alarm/getOneAlarm",
                            {id: data.id, type: "update"},
                            {
                                root: true
                            }
                        );
                        // 动态更新退回
                        !updateOne ||
                        dispatch(
                            "alarm/updateOneAlarm",
                            {id: data.id, updateOne, topic},
                            {
                                root: true
                            }
                        );
                        break;
                    // 网格员、值班员确认 完成核查单
                    case "alarm/complete":
                        ElNotification.success({
                            title: "消息",
                            message: "有核查已被完成！"
                        });
                        updateOne = await dispatch(
                            "alarm/getOneAlarm",
                            {id: data.id, type: "update"},
                            {
                                root: true
                            }
                        );
                        // 动态更新已核查
                        !updateOne ||
                        dispatch(
                            "alarm/updateOneAlarm",
                            {id: data.id, updateOne, topic},
                            {
                                root: true
                            }
                        );
                        break;
                    case "alarm/continue":
                        console.log(
                            "续查----",
                            rootState.alarm.isStart,
                            rootState.start.events.id,
                            data.id
                        );
                        if (
                            rootState.alarm.isStart &&
                            rootState.start.events.id === data.id
                        ) {
                            // 只有在续查的事件信息是当前正在启动的事件才会执行修改操作
                            ElNotification.success({
                                title: "消息",
                                message: "有续查！"
                            });
                            // commit("plan/UPDATE_PLANS_DETAIL_EVENTFILE", data.eventFileList, {
                            //   root: true
                            // });
                            commit("alarm/UPDATE_PLANS_EVENTDOTLIST", data, {
                                root: true
                            });
                        }
                        break;
                    // 民意
                    case "ComplaintOrder":
                        commit("app/SET_NEWSCIVILIAN", data, {
                            root: true
                        });
                        break;
                    // 响应状态
                    case "resStatus":
                        if (data.status) {
                            dispatch("start/changeStatus", data, {
                                root: true
                            });
                            break;
                        }
                }
                // 聊天室
                if (checkType(data) === "object" && topic.match(/^chatroom\//i)) {
                    if (/\/chat$/.test(topic)) {
                        console.log("普通聊天", data, topic);
                        if (
                            data.mFromDeptName === "总指挥" &&
                            data.mToid &&
                            data.mToid.match(/(.*)?组$/)
                        ) {
                            commit("SET_SECENENEWS", data);
                        } else if (data.mFromDeptName === "副总指挥") {
                            commit("SET_CHIEFNEWS", data);
                        } else if (data.mFromDeptName && data.mFromDeptName.match(/组$/)) {
                            commit("SET_ACTIONNEWS", data);
                        }
                    } else if (/\/direct$/.test(topic)) {
                        console.log("指令相关", data, topic);
                        // eslint-disable-next-line no-prototype-builtins
                        if (data.hasOwnProperty("add")) {
                            data = JSON.parse(data.add);
                            commit("SET_TASK", {
                                type: "add",
                                data
                            });
                            console.log(data);
                            // eslint-disable-next-line no-prototype-builtins
                        } else if (data.hasOwnProperty("update")) {
                            // data.update = JSON.parse(data.update)
                            // data.taskUserList = JSON.parse(data.taskUserList)
                            // data.updateDate = parseTime(new Date(data.updateDate), '{y}-{m}-{d} {h}:{i}:{s}')
                            // data = {
                            //   ...data,
                            //   ...data.update
                            // }
                            // delete data.update
                            commit("SET_TASK", {
                                type: "update"
                                // data
                            });
                            // eslint-disable-next-line no-prototype-builtins
                        } else if (data.hasOwnProperty("delete")) {
                            data = {taskId: JSON.parse(data.delete)};
                            commit("SET_TASK", {
                                type: "delete",
                                data
                            });
                            // eslint-disable-next-line no-prototype-builtins
                        } else if (data.hasOwnProperty("reply")) {
                            // taskType 为true说明指令整体完成
                            if (data.taskType) {
                                commit("SET_TASK", {
                                    type: "complete",
                                    data: {
                                        taskId: data.taskId
                                    }
                                });
                            }
                            data = {
                                ...data,
                                ...data.reply
                            };
                            data.replyTime = parseTime(
                                new Date(data.replyTime),
                                "{y}-{m}-{d} {h}:{i}:{s}"
                            );
                            data.type = "reply";
                            data.mId = data.replyid;
                            typeof data.complete !== "string" && (data.complete = "1"); // mqtt没有推这个字段就说明已完成 未完成回推0已完成回推1
                            delete data.reply;
                            commit("SET_TASK", {
                                type: "reply",
                                data
                            });
                        }
                    } else if (/\/recovery$/.test(topic)) {
                        console.log("四个任务", topic, data);
                        const keys = [
                            "clear",
                            "warn",
                            "dispose",
                            "survey",
                            "clearUpdate",
                            "warnUpdate",
                            "disposeUpdate",
                            "surveyUpdate",
                            "clearDelete",
                            "warnDelete",
                            "disposeDelete",
                            "surveyDelete"
                        ];
                        // data --> {clear: {...}}
                        const sortObj = {
                            clear: 0,
                            warn: 1,
                            dispose: 2,
                            survey: 3
                        };
                        for (var key of keys) {
                            if (
                                data &&
                                Object.prototype.hasOwnProperty.call(data, key) &&
                                data[key]
                            ) {
                                data = {type: key, ...data[key]};
                                var tempType = "";
                                if (/(delete|update)$/gi.test(key)) {
                                    tempType = key.replace(/(delete|update)$/gi, "");
                                    data.posi = sortObj[tempType];
                                    data._type = /delete$/gi.test(key) ? "delete" : "update";
                                }
                                if (tempType === "") {
                                    data._type = "add";
                                    data.posi = sortObj[key];
                                }
                                commit("SET_RECONEWS", data);
                            }
                        }
                    }
                }
            });
        },
        // 发布消息
        mqtt_handle_pub({state, commit}, data) {
            return new Promise(resolve => {
                const statusList = [];
                data.forEach((item, index) => {
                    const message = Object.assign(
                        {},
                        {
                            sender: {
                                name: "指挥调度中心",
                                dept: "指挥调度中心",
                                client: "node"
                            },
                            receiver: {
                                name: item.receiver.name,
                                dept: item.receiver.dept,
                                client: item.receiver.client
                            },
                            data: {
                                content: item.content
                            },
                            type: {
                                classA: "event",
                                classB: "res"
                            },
                            time: new Date(),
                            topic: "screen",
                            isReaded: false
                        }
                    );
                    state.client.publish(
                        "screen",
                        JSON.stringify(message),
                        {
                            qos: 1, // 0, 1, or 2
                            retain: false,
                            dup: true // or true})
                        },
                        err => {
                            if (err) {
                                statusList[index] = false;
                            } else {
                                statusList[index] = true;
                                commit("SET_SENDEDLIST", message);
                            }
                            if (isEnded(statusList)) {
                                resolve(statusList);
                            }
                        }
                    );
                });

                function isEnded(arr) {
                    if (arr.length === data.length) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }
    }
};

export default message;
