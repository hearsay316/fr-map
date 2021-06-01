<template>
    <div>
        <header class="home-record-header">
            <el-form ref="form" :inline="true" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-col :span="11">
                                <el-date-picker
                                    v-model="form_data.startTime"
                                    type="date"
                                    placeholder="开始时间"
                                    style="width: 100%"
                                    class="fr-input fr-input-primary"
                                    clearable
                                    prefix-icon="el-icon-date el-icon-primary"
                                ></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-date-picker
                                    v-model="form_data.endTime"
                                    type="date"
                                    placeholder="结束时间"
                                    style="width: 100%"
                                    prefix-icon="el-icon"
                                    class="fr-input fr-input-primary"
                                    clearable
                                ></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="fr-form-item">
                            <el-input
                                v-model="form_data.keyText"
                                placeholder="请输入内容"
                                style="width: 100%"
                                class="fr-input fr-input-warning set-h-42"
                                clearable
                            >
                                <template #append>
                                    <div class="input-with-select-append">
                                        <div>
                                            <el-select
                                                v-model="form_data.status"
                                                clearable
                                                placeholder="状态"
                                            >
                                                <el-option
                                                    v-for="(values, index) of listDic_values"
                                                    :key="index"
                                                    :label="values?.dicValueText"
                                                    :value="values?.dicValueCode"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div>
                                            <el-button
                                                icon="el-icon-search"
                                                @click="currentChange"
                                            ></el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </header>
        <div class="home-record-battle-list">
            <div class="home-record-battle-type">
                <div class="home-record-battle-type-A cursor" @click="create_handle">
                    <i class="el-icon-plus plus"></i>
                    <div class="text-color">创建组</div>
                </div>
                <div v-if="active" class="home-record-battle-type-B cursor" @click="manage_handle">
                    <i class="fr-el-icon-type-B"></i>
                    <div class="text-color">管理</div>
                </div>
            </div>
            <div class="home-record-list-main">
                <div class="home-record-list-box">
                    <div
                        v-for="(tableData, index) of baseOptions?.tableData"
                        :key="index"
                        class="home-record-item"
                        :class="{ active: active?.index === index }"
                        @click="tableData_handle(tableData, index)"
                    >
                        <div class="home-record-item-header">
                            <div class="left">{{ tableData?.createTime?.split(' ')?.[0] }}</div>
                            <div class="center">
                                <div class="center-bg" :class="tableData?.status"></div>
                            </div>
                            <div :class="tableData?.status" class="right">
                                {{ tableData?.status_str }}
                            </div>
                        </div>
                        <div class="home-record-item-desc">
                            <h3>{{ tableData?.teamName }}</h3>
                            <div :title="tableData?.remark" class="desc">
                                {{ tableData?.remark }}
                            </div>
                        </div>
                        <component
                            :is="component_type[tableData?.status]"
                            :table-data="{ tableData, index }"
                            class="home-record-item-operation"
                            @update="currentChange"
                        ></component>
                    </div>
                </div>
                <div class="pagination">
                    <div class="pagination-currentPage m-r-42">
                        第 <span>{{ form_data.pageNumber }}</span> 页
                    </div>
                    <el-pagination
                        v-model:current-page="form_data.pageNumber"
                        :page-size="form_data.pageSize"
                        layout="prev, pager, next"
                        :total="baseOptions.total"
                        @prev-click="form_data.pageNumber--"
                        @next-click="form_data.pageNumber++"
                        @current-change="currentChange"
                    >
                    </el-pagination>
                    <div class="pagination-currentPage m-l-42">
                        总<span>{{ baseOptions.total }}</span
                        >条
                    </div>
                </div>
            </div>
        </div>

        <!--        <enforce></enforce>-->
        <!--      添加-->
        <HomeRecordPopAdd
            v-if="HomeRecordPopAdd_show"
            v-model="HomeRecordPopAdd_show"
            class="home-record-pop-add"
        ></HomeRecordPopAdd>
        <!--      管理-->
        <HomeRecordManage
            v-if="HomeRecordPopManage_show"
            v-model="HomeRecordPopManage_show"
            class="home-record-pop-add"
            :table-data="active"
        ></HomeRecordManage>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { sevenDays } from '../utils/common';
import { combatTeam_pageList } from '../api/page_list';
import { object_remove_null, tableList, component_type } from './table-list';
import HomeRecordPopAdd from './home-record-pop-add.vue';
import HomeRecordManage from './HomeRecordManage.vue';
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';
import { combatTeam_del, combatTeam_reset } from '../api/login';
let form_data = reactive({
    pageNumber: 1,
    pageSize: 6,
    endTime: sevenDays(new Date())[1],
    startTime: sevenDays(new Date())[0],
    status: '',
    keyText: ''
});
let HomeRecordPopAdd_show = ref(false);
let HomeRecordPopManage_show = ref(false);
watch(HomeRecordPopAdd_show, (newValue, oldValue) => {
    newValue == false && currentChange();
});
let form_data_f = computed(() => {
    form_data.endTime =
        form_data.endTime &&
        dayjs(form_data.endTime).format('YYYY-MM-DD HH:mm:ss').split(' ')[0] + ' 23:59:59';
    console.log(form_data.endTime, ' form_data.endTime form_data.endTime');
    form_data.startTime =
        form_data.startTime && dayjs(form_data.startTime).format('YYYY-MM-DD HH:mm:ss');
    return object_remove_null(form_data);
});
let baseOptions = ref({
    tableData: [],
    total: 0
});
let active = ref(null);
function create_handle() {
    HomeRecordPopAdd_show.value = true;
}
function manage_handle() {
    HomeRecordPopManage_show.value = true;
}
function tableData_handle(tableData, index) {
    console.log(tableData);
    if (tableData.status != 'unfinished') {
        return (active.value = null);
    }
    active.value = { tableData, index };
}
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
const store = useStore();
let listDic_values = computed(() => store.state.user.listDic_values);

function currentChange() {
    active.value = null;
    tableList(combatTeam_pageList, form_data_f.value, [
        {
            data: listDic_values,
            data_type: 'dicValueCode',
            data_value: 'dicValueText',
            type: 'status',
            newType: 'status_str'
        }
    ]).then((res) => {
        baseOptions.value = res;
    });
}
onMounted((form_data) => {
    currentChange();
});
</script>

<style lang="scss" scoped>
.home-record-battle-list {
    display: grid;
    grid-template-columns: column-width(160) column-width(1380);
    column-gap: column-width(45);
    .home-record-battle-type-A {
        width: column-width(160);
        height: column-width(200);
        border: 2px solid $primaryborde;
        border-radius: 15px;
        margin-bottom: column-width(90);
        box-shadow: 0 0 column-width(50) $primaryborde inset;
    }
    .home-record-battle-type-B {
        width: column-width(160);
        height: column-width(200);
        border: 2px solid $warningborde;
        border-radius: 15px;
        margin-bottom: column-width(90);
        box-shadow: 0 0 column-width(50) $warningborde inset;
        .text-color {
            color: $warningborde;
        }
        .fr-el-icon-type-B {
            display: block;
            width: 42px;
            height: 42px;
            background: url('../assets/page/home-record-battle-type-B.png');
            background-size: 100% 100%;
            margin: 10px auto 0;
        }
    }
    .home-record-list-main {
        //670*490

        .home-record-list-box {
            display: grid;
            grid-template-columns: column-width(670) column-width(670);
            grid-template-rows: column-width(490) column-width(490) column-width(490);
            gap: column-width(50);
            color: $white;
        }

        .home-record-item {
            border: 2px solid #3b4d5d;
            border-radius: 15px;
            background-color: #152435;
            box-shadow: 0 0 column-width(15) $primaryborde inset, 10px 10px 10px #000000;
            padding: column-width(30);
            cursor: pointer;
            .home-record-item-header {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                margin-bottom: column-width(30);
                .center {
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .center-bg {
                        position: relative;
                        width: column-width(160);
                        height: 14px;
                        border-radius: 5px;
                        background: rgba(210, 215, 46, 0.2);
                    }
                    .finished {
                        background: rgba(37, 208, 150, 0.2);
                    }
                    .finished:after {
                        width: 50%;
                        background: rgb(37, 208, 150);
                        position: absolute;
                        content: '';
                        height: 14px;
                        border-radius: 5px;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                    }
                    //rgb(243, 77, 78)
                    .unfinished {
                        background: rgba(243, 77, 78, 0.2);
                    }
                    .unfinished:after {
                        width: 30%;
                        background: rgb(243, 77, 78);
                        position: absolute;
                        content: '';
                        height: 14px;
                        border-radius: 5px;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                    }
                    .enforce {
                        background: rgba(210, 215, 46, 0.2);
                    }
                    .enforce:after {
                        width: 50%;
                        background: rgb(210, 215, 46);
                        position: absolute;
                        content: '';
                        height: 14px;
                        border-radius: 5px;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                    }
                }
                .right {
                    text-align: right;
                    &.enforce {
                        color: rgb(210, 215, 46);
                    }
                    &.finished {
                        color: rgb(37, 208, 150);
                    }
                    &.unfinished {
                        color: #f34d4e;
                    }
                }
            }
            .home-record-item-desc {
                text-align: center;
                div.desc {
                    color: #68859f;
                    height: column-width(68);
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }
            }
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
        }
        .home-record-item.active {
            box-shadow: 0 0 column-width(25) $warningborde inset, 10px 10px 10px #000000;
        }
    }
    .text-color {
        color: $primaryborde;
        text-align: center;
        margin-top: 10px;
        //font-weight: 600;
        font-size: 18px;
        letter-spacing: 3px;
    }
    .plus {
        margin-top: 8px;
        display: block;
        text-align: center;
        width: 100%;
        font-weight: 700;
        color: $white;
        font-size: 42px;
    }
}
</style>
