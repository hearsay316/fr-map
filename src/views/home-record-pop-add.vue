<template>
    <div>
        <div class="main">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item class="fr-pop-form-item" prop="teamName" label="作战组名">
                    <el-input v-model="form.teamName"></el-input>
                </el-form-item>
                <el-form-item class="fr-pop-form-item" prop="remark" label="详情描述">
                    <el-input v-model="form.remark" type="textarea"></el-input>
                </el-form-item>
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
                    <div class="fr-bottom" @click="onSubmit">立即创建</div>
                    <div class="fr-bottom" @click="$emit('update:modelValue', false)">取消</div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { combatTeam_save, userAndEquipment } from '../api/login';

export default {
    name: 'HomeRecordPopAdd',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            form: {
                teamName: '',
                remark: '',
                equipmentIds: []
            },
            rules: {
                teamName: [{ required: true, message: '请输入作战组名', trigger: 'blur' }],
                equipmentIds: [{ required: true, message: '请勾选', trigger: 'change' }],
                remark: [{ required: true, message: '请填详情描述', trigger: 'blur' }]
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
        this.get_tree();
    },
    methods: {
        save_data() {
            combatTeam_save({});
        },
        handleClick(data, checked, node) {
            if (checked) {
                console.log(data, checked, node, 'data, checked, node');
                this.checkedData.push(data);
                return;
            }
            return (this.checkedData = this.checkedDataFnc(this.checkedData, data));
            // 消除 取消的那一项
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
            userAndEquipment().then((res) => {
                this.data = this.handler_tree(res);
                console.log(this.data, 'this.datathis.data');
            });
        },
        handler_tree(arr, num) {
            if (!arr) return;
            return arr?.map((item, index) => {
                item.id = num + '-' + index;
                if (item.userAndEquipments) {
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
        onSubmit() {
            this.form.equipmentIds = this.checkedData.map((item) => {
                return item.equipmentId;
            });
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    combatTeam_save(this.form)
                        .then((res) => {
                            console.log('combatTeam_savecombatTeam_save');
                            this.$emit('update:modelValue', false);
                        })
                        .catch((error) => {
                            console.log(555);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
                data.children = [];
            }
            data.children.push(newChild);
            this.data = [...this.data];
        },

        handleClickRemove(data, checked) {
            if (checked) {
                const index = this.checkedData.findIndex((d) => d.id === data.id);
                this.checkedData.splice(index, 1);
                this.$refs.fr_el_tree.setChecked(data, false);
            }
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
