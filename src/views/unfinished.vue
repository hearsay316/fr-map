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
        <home_view_combat_team
            v-if="unfinished_open_dialog"
            :id="tableData?.tableData?.id"
            v-model="unfinished_open_dialog"
        ></home_view_combat_team>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { byIdGetCombatTeam, combatTeam_del, combatTeam_reset } from '../api/login';
import { computed, defineProps, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import home_view_combat_team from './home-view-combat-team.vue';
let Props = defineProps({
    tableData: Object
});
let unfinished_open_dialog = ref(false);
let unfinished_open_data = ref(null);

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
    unfinished_open_dialog.value = true;
    console.log(tableData, 'tableDatatableData');
}
function close_handle() {
    unfinished_open_dialog.value = false;
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
