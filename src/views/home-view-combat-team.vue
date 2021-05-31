<template>
    <teleport to=".home-battle-list">
        <div class="unfinished-dialog">
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
                    <el-descriptions-item label="用户名">{{ user?.userName }}</el-descriptions-item>
                    <el-descriptions-item label="用户ID">{{ user?.userId }}</el-descriptions-item>
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

<style scoped></style>
