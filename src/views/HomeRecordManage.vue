<template>
    <div>
        <div class="main">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item prop="equipmentIds">
                    <el-row>
                        <el-col :span="12"
                            ><div class="grid-content bg-purple">
                                <p>选择人选</p>
                                <el-scrollbar class="fr-scrollbar" :height="height_tree">
                                    <el-tree
                                        ref="fr_el_tree"
                                        class="fr-el-tree"
                                        :data="data"
                                        :props="defaultProps"
                                        show-checkbox
                                        node-key="id"
                                        default-expand-all
                                        :expand-on-click-node="false"
                                        @check-change="handleClick"
                                    >
                                    </el-tree>
                                </el-scrollbar></div
                        ></el-col>
                        <el-col :span="12"
                            ><div class="grid-content bg-purple-light">
                                <p>已选人员</p>
                                <el-scrollbar class="fr-scrollbar" :height="height_tree">
                                    <el-tree
                                        class="fr-el-tree fr-el-remove"
                                        :data="checkedData"
                                        show-checkbox
                                        node-key="id"
                                        :props="defaultProps"
                                        default-expand-all
                                        :expand-on-click-node="false"
                                        @check-change="handleClickRemove"
                                    >
                                    </el-tree>
                                </el-scrollbar></div
                        ></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="fr-footer">
                    <div class="fr-bottom" @click="reset_handle">重置绑定</div>
                    <div class="fr-bottom" @click="$emit('update:modelValue', false)">关闭</div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {
    bindingEquipment,
    byIdGetCombatTeam,
    combatTeam_save,
    unBundlingEquipment,
    userAndEquipment
} from '../api/login';

export default {
    name: 'HomeRecordManage',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Object,
            default() {
                return null;
            }
        }
    },
    data() {
        return {
            form: {
                teamName: '',
                remark: '',
                equipmentIds: []
            },
            data: [],
            defaultProps: {
                children: 'rows',
                label: 'deptName'
            },
            checkedData: [],
            height_tree: (880 / 3840) * 100 * 1 + 'vw'
        };
    },
    mounted() {
        this.refresh();
    },
    methods: {
        reset_handle() {
            if (!this.checkedData.length) {
                return this.$message.success('暂无绑定');
            }
            const equipmentIds = this.checkedData.map((item) => {
                return item.equipmentId;
            });
            let record = {
                equipmentIds: equipmentIds,
                teamId: this.tableData.tableData.id
            };
            unBundlingEquipment(record)
                .then((res) => {
                    this.refresh();
                    this.$message.success('重置成功');
                })
                .catch((error) => {
                    console.error(error, 'errorerror');
                });
        },
        refresh() {
            this.get_tree();
            this.get_byIdGetCombatTeam(this.tableData.tableData.id);
        },
        get_byIdGetCombatTeam(id) {
            byIdGetCombatTeam({ id }).then((res) => {
                this.checkedData =
                    res?.[0]?.users.map((item) => {
                        item['deptName'] = item['userName'];
                        return item;
                    }) ?? [];
            });
        },
        save_data() {
            combatTeam_save({});
        },
        handleClick(data, checked, node) {
            this.form.equipmentIds = this.checkedData.map((item) => {
                return item.equipmentId;
            });
            if (checked) {
                this.set_bindingEquipment(data, this.tableData);
                return;
            }
            return (this.checkedData = this.checkedDataFnc(this.checkedData, data));
            // 消除 取消的那一项
        },
        set_bindingEquipment(data, tableData) {
            let record = {
                equipmentIds: [data.equipmentId],
                teamId: tableData.tableData.id
            };
            bindingEquipment(record)
                .then((res) => {
                    this.refresh();
                    this.$message.success('绑定成功');
                })
                .catch((error) => {
                    console.error(error, 'error');
                });
        },
        checkedDataFnc(checkedData, data) {
            let length = checkedData.length;
            const arr = [];
            for (let i = 0; i < length; i++) {
                if (checkedData[i].id !== data.id) {
                    arr.push(checkedData[i]);
                }
            }
            return arr;
        },
        get_tree() {
            userAndEquipment()
                .then((res) => {
                    this.data = this.handler_tree(res);
                })
                .catch((error) => {
                    console.error(error, 'error');
                });
        },
        handler_tree(arr, num) {
            if (!arr) return;
            return arr?.map((item, index) => {
                item.id = num + '-' + index;
                if (item?.userAndEquipments) {
                    const userAndEquipments = item.userAndEquipments?.map(
                        (userAndEquipments, user_index) => {
                            userAndEquipments['deptName'] = userAndEquipments['userName'];
                            userAndEquipments.id = index + '-' + user_index;
                            userAndEquipments.rows = undefined;
                            return userAndEquipments;
                        }
                    );
                    // 递归函数
                    item.rows
                        ? (item.rows = [
                              ...this.handler_tree(item.rows, index + 1),
                              ...userAndEquipments
                          ])
                        : ((item.rows = userAndEquipments), (item.disabled = true));
                }
                return item;
            });
        },
        handleClickRemove(data, checked) {
            if (checked) {
                // const index = this.checkedData.findIndex((d) => d.id === data.id);
                // this.checkedData.splice(index, 1);
                // this.$refs.fr_el_tree.setChecked(data, false);
                this.set_unBundlingEquipment(data, this.tableData);
            }
        },
        set_unBundlingEquipment(data, tableData) {
            let record = {
                equipmentIds: [data.equipmentId],
                teamId: tableData.tableData.id
            };
            unBundlingEquipment(record)
                .then((res) => {
                    console.log(res, 'res');
                    this.refresh();
                    this.$message.success('解绑成功');
                })
                .catch((error) => {
                    console.error(error, 'errorerror');
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.main {
    float: right;
    width: column-width(1388);
    height: 100%;
    color: white;
    padding: column-width(45);
}
.fr-scrollbar {
    width: column-width(440);
}
.fr-footer {
    display: flex;
    justify-content: center;
    margin-left: -15px;
}
.fr-bottom {
    display: inline-block;
    width: column-width(280);
    border-radius: column-width(45);
    border: 1px solid $warningborde;
    height: column-width(80);
    text-align: center;
    color: $warningborde;
    box-shadow: 0 0 column-width(30) $warningborde inset;
    cursor: pointer;
    margin-right: 15px;
}
</style>
