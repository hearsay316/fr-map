<template>
    <teleport to="body">
        <div class="unfinished-dialog">
            <div class="descriptions-item">
                <div>作战组名</div>
                <div class="descriptions">{{ unfinished_open_data?.teamName }}</div>
            </div>

            <div class="descriptions-item wrap">
                <div>详情描述</div>
                <div class="descriptions">{{ unfinished_open_data?.teamName }}</div>
            </div>
            <div class="descriptions-item wrap">
                <div>人员</div>
                <div class="descriptions">
                    <el-table
                        class="fr-table"
                        :data="unfinished_open_data?.users"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                    >
                        <el-table-column align="center" prop="userName" label="用户名" width="180">
                        </el-table-column>
                        <el-table-column align="center" prop="userId" label="用户ID" width="180">
                        </el-table-column>
                        <el-table-column align="center" prop="equipmentName" label="设备名称">
                        </el-table-column>
                        <el-table-column align="center" prop="equipmentId" label="设备编号">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="cursor close_handle" @click="close_handle"></div>
        </div>
    </teleport>
</template>

<script setup>
import { byIdGetCombatTeam } from '../api/login';
import { defineProps, defineEmit, ref, onMounted, computed } from 'vue';
import { processing_data } from './table-list';
import { useStore } from 'vuex';
let Props = defineProps({
    tableData: Object,
    modelValue: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        default: ''
    }
});
let Emit = defineEmit(['update:modelValue']);
let unfinished_open_data = ref(null);
const store = useStore();
let listDic_values = computed(() => store.state.user.listDic_values);
function tableRowClassName({ rowIndex }) {
    if (rowIndex % 2 === 1) {
        return 'warning-row';
    }
    return '';
}
function open_handle(id) {
    console.log(id, 'tableDatatableData');

    byIdGetCombatTeam({ id })
        .then((res) => {
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
    console.log(Emit);
    Emit('update:modelValue', false);
}
onMounted(() => {
    open_handle(Props.id);
});
</script>

<style lang="scss" scoped>
.unfinished-dialog {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: column-width(1600);
    height: column-width(1600);
    background: url('../assets/page/unfinished-dialog.png');
    background-size: 100% 100%;
    z-index: 3;
    padding: 90px 40px 40px 40px;
    border-radius: 15px;
    .descriptions-item {
        display: flex;
        color: $white;
        font-size: 20px;
        .descriptions {
            margin-left: 16px;
            font-size: 16px;
            color: $paginationColor;
        }
        margin-bottom: 15px;
    }
    .wrap {
        flex-wrap: wrap;
        .descriptions {
            width: 100%;
            margin-top: 10px;
        }
    }
    .close_handle {
        position: absolute;
        top: 0;
        right: 8px;
        padding: 10px;
        width: 25px;
        height: 25px;
        margin: 0;
    }
    .header-descriptions {
        display: flex;
        font-size: 16px;
        background-color: $backgroundcolor;
    }
    .item-descriptions {
        display: flex;
        color: $white;
    }
}
</style>
