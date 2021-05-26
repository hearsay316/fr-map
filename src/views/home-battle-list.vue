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
                                v-model="form_data.name"
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
                <div class="home-record-battle-type-A">
                    <i class="el-icon-plus plus"></i>
                    <div class="text-color">创建组</div>
                </div>
                <div class="home-record-battle-type-B">
                    <i class="el-icon-plus plus"></i>
                    <div class="text-color">管理</div>
                </div>
            </div>
            <div class="home-record-list-main">
                <div class="home-record-list-box">
                    <div
                        v-for="(tableData, index) of baseOptions?.tableData"
                        :key="index"
                        class="home-record-item"
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
                        <div class="home-record-item-operation">
                            <div class="home-record-item-operation-btn">作战记录</div>
                            <div class="home-record-item-operation-btn">作战记录</div>
                            <div class="home-record-item-operation-btn">作战记录</div>
                            <div class="home-record-item-operation-btn">作战记录</div>
                        </div>
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
        <HomeRecordPopAdd class="home-record-pop-add"></HomeRecordPopAdd>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { sevenDays } from '../utils/common';
import { combatTeam_pageList } from '../api/page_list';
import { object_remove_null, tableList } from './table-list';
import HomeRecordPopAdd from './home-record-pop-add.vue';
import dayjs from 'dayjs';
let form_data = reactive({
    pageNumber: 1,
    pageSize: 6,
    endTime: sevenDays(new Date())[1],
    startTime: sevenDays(new Date())[0],
    status: ''
});
let form_data_f = computed(() => {
    form_data.endTime = form_data.endTime && dayjs(form_data.endTime).format('YYYY-MM-DD HH:mm:ss');
    form_data.startTime =
        form_data.startTime && dayjs(form_data.startTime).format('YYYY-MM-DD HH:mm:ss');
    return object_remove_null(form_data);
});
let baseOptions = ref({
    tableData: [],
    total: 0
});

const store = useStore();
let listDic_values = computed(() => store.state.user.listDic_values);

function currentChange() {
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
                gap: column-width(50);
                .home-record-item-operation-btn {
                    text-align: center;
                }
            }
        }
    }
    .text-color {
        color: $white;
        text-align: center;
    }
    .plus {
        margin-top: 8px;
        display: block;
        text-align: center;
        width: 100%;
        font-weight: 600;
        color: $white;
        font-size: 42px;
    }
}
.home-record-pop-add {
    position: absolute;
    right: 0;
    top: 68px;
    width: column-width(1595);
    height: column-width(1590);
    background-size: 100% 100%;
    background-image: url('../assets/page/home-create.png');
}
</style>
