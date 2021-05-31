<template>
    <div class="unfinished">
        <div class="home-record-item-operation-btn A cursor">执行</div>
        <div
            class="home-record-item-operation-btn B cursor"
            @click.prevent="remove_handle(tableData)"
        >
            设备组删除
        </div>
        <div class="home-record-item-operation-btn C cursor">修改作战组</div>
        <div
            class="home-record-item-operation-btn D cursor"
            @click.prevent="open_handle(tableData)"
        >
            查看作战组
        </div>
        <teleport to=".home-battle-list">
            <div v-if="unfinished_open_dialog" class="unfinished-dialog">
                <el-descriptions
                    v-if="unfinished_open_data"
                    title="详情"
                    direction="vertical"
                    :column="2"
                    border
                >
                    <template #extra>
                        <el-button type="primary" size="small">{{
                            unfinished_open_data?.status_str
                        }}</el-button>
                    </template>
                    <el-descriptions-item label="作战组名">{{
                        unfinished_open_data?.teamName
                    }}</el-descriptions-item>
                    <el-descriptions-item label="详情描述"
                        >{{ unfinished_open_data?.teamName }}}</el-descriptions-item
                    >
                    <template v-for="user of unfinished_open_data?.users" :key="user.userId">
                        <el-descriptions-item label="用户名">{{
                            user?.userName
                        }}</el-descriptions-item>
                        <el-descriptions-item label="用户ID">{{
                            user?.userId
                        }}</el-descriptions-item>
                        <el-descriptions-item label="设备名称">{{
                            user?.equipmentName
                        }}</el-descriptions-item>
                        <el-descriptions-item label="设备编号">{{
                            user?.equipmentId
                        }}</el-descriptions-item>
                    </template>
                </el-descriptions>
                <div class="cursor close_handle" @click="close_handle">关闭</div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { byIdGetCombatTeam, combatTeam_del, combatTeam_reset } from '../api/login';
import { computed, defineProps, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

let Props = defineProps({
    tableData: Object
});
let unfinished_open_dialog = ref(false);
let unfinished_open_data = ref(null);
const store = useStore();
let listDic_values = computed(() => store.state.user.listDic_values);
onMounted(() => {
    console.log(Props, 'tableDatatableData');
});
function remove_handle(tableData) {
    ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            combatTeam_del(tableData.id).then(() => {
                ElMessage({
                    type: 'success',
                    message: '删除成功!'
                });
                currentChange();
            });
        })
        .catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // });
        });
}
function reset_handle(tableData) {
    ElMessageBox.confirm('此操作将重置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            combatTeam_reset({ id: tableData.id }).then(() => {
                ElMessage({
                    type: 'success',
                    message: '重置成功!'
                });
                currentChange();
            });
        })
        .catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // });
        });
}
function open_handle(tableData) {
    console.log(tableData, 'tableDatatableData');

    const id = tableData.tableData.id;
    byIdGetCombatTeam({ id })
        .then((res) => {
            unfinished_open_dialog.value = true;
            unfinished_open_data.value = processing_data(res?.[0], [
                {
                    data: listDic_values,
                    data_type: 'dicValueCode',
                    data_value: 'dicValueText',
                    type: 'status',
                    newType: 'status_str'
                }
            ]);

            console.log(unfinished_open_data.value, 'ididid');
        })
        .catch((error) => {
            console.log(error);
        });
}
function close_handle() {
    unfinished_open_dialog.value = false;
}
function processing_data(data, arr) {
    arr.forEach((item) => {
        let find_data = item?.data.value?.find((i) => {
            return i[item.data_type] === data[item.type];
        });
        find_data ? (data[item.newType] = find_data[item.data_value]) : void 0;
    });
    return data;
}
</script>

<style lang="scss" scoped>
.home-record-item-operation {
    margin-top: column-width(50);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: column-width(30);
    .home-record-item-operation-btn {
        text-align: center;
        border: 2px solid #7dedff;
        border-radius: 15px;
        padding: 3px 0;
    }
    .A {
        border-color: #7dedff;
        background-color: rgba(125, 237, 255, 0.2);
    }
    .B {
        border-color: #2489cd;
        background-color: rgba(36, 137, 205, 0.2);
    }
    .C {
        border-color: #68859f;
        background-color: rgba(104, 133, 159, 0.2);
    }
    .D {
        border-color: #62a2cd;
        background-color: rgba(98, 162, 205, 0.2);
    }
}
</style>
