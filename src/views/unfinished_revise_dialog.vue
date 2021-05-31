<template>
    <teleport to=".home-battle-list">
        <div class="home_modify_combat_team home-record-pop-add">
            <div class="main">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item class="fr-pop-form-item" prop="teamName" label="作战组名">
                        <el-input v-model="form.teamName"></el-input>
                    </el-form-item>
                    <el-form-item class="fr-pop-form-item" prop="remark" label="详情描述">
                        <el-input v-model="form.remark" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item class="fr-footer">
                        <div class="fr-bottom" @click="onSubmit">保存修改</div>
                        <div class="fr-bottom" @click="$emit('update:modelValue', false)">取消</div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </teleport>
</template>

<script>
import { combatTeam_save, combatTeam_update, userAndEquipment } from '../api/login';

export default {
    name: 'UnfinishedReviseDialog',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    emits: ['update:modelValue', 'update'],
    data() {
        return {
            form: {
                teamName: '',
                remark: ''
            },
            rules: {
                teamName: [{ required: true, message: '请输入作战组名', trigger: 'blur' }],
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
    created() {
        this.form.remark = this.tableData.tableData.remark;
        this.form.teamName = this.tableData.tableData.teamName;
        console.log(this.tableData.tableData);
    },
    methods: {
        save_data() {
            combatTeam_save({});
        },
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log('submit!', this.tableData.tableData.teamId);
                    let data = {
                        ...this.form,
                        teamId: this.tableData.tableData.id
                    };
                    combatTeam_update(data)
                        .then((res) => {
                            this.$emit('update:modelValue', false);
                            this.$emit('update');
                        })
                        .catch((error) => {
                            console.log(555);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
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
