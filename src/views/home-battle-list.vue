<template>
    <div>
        <header class="home-record-header">
            <el-form ref="form" :inline="true" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-col :span="11">
                                <el-date-picker
                                    v-model="form_data.date1"
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
                                    v-model="form_data.date2"
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
                        <el-form-item>
                            <el-input
                                v-model="form_data.name"
                                placeholder="请输入内容"
                                class="fr-input fr-input-warning set-h-42"
                                clearable
                            >
                                <template #append>
                                    <div class="input-with-select-append">
                                        <div>
                                            <el-select
                                                v-model="form_data.select"
                                                clearable
                                                placeholder="状态"
                                            >
                                                <el-option label="餐厅名" value="1"></el-option>
                                                <el-option label="订单号" value="2"></el-option>
                                                <el-option label="用户电话" value="3"></el-option>
                                            </el-select>
                                        </div>
                                        <div>
                                            <el-button icon="el-icon-search"></el-button>
                                        </div>
                                    </div>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </header>
        <div></div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
let form_data = reactive({
    name: '',
    select: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
});
</script>

<style scoped></style>
