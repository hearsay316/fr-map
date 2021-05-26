<template>
    <div>
        <div class="main">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item class="fr-pop-form-item" label="作战组名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item class="fr-pop-form-item" label="详情描述">
                    <el-input v-model="form.desc" type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :span="12"
                            ><div class="grid-content bg-purple">
                                <p>使用 scoped slot</p>
                                <el-tree
                                    class="fr-el-tree"
                                    :data="data"
                                    show-checkbox
                                    node-key="id"
                                    default-expand-all
                                    :expand-on-click-node="false"
                                >
                                    <template #default="{ node, data }">
                                        <span class="custom-tree-node">
                                            <span>{{ node.label }}</span>
                                            <span>
                                                <a @click="append(data)"> Append </a>
                                                <a @click="remove(node, data)"> Delete </a>
                                            </span>
                                        </span>
                                    </template>
                                </el-tree>
                            </div></el-col
                        >
                        <el-col :span="12"
                            ><div class="grid-content bg-purple-light">
                                <p>使用 scoped slot</p>
                                <el-tree
                                    :data="data"
                                    show-checkbox
                                    node-key="id"
                                    default-expand-all
                                    :expand-on-click-node="false"
                                >
                                    <template #default="{ node, data }">
                                        <span class="custom-tree-node">
                                            <span>{{ node.label }}</span>
                                            <span>
                                                <a @click="append(data)"> Append </a>
                                                <a @click="remove(node, data)"> Delete </a>
                                            </span>
                                        </span>
                                    </template>
                                </el-tree>
                            </div></el-col
                        >
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeRecordPopAdd',
    data() {
        return {
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            data: [
                {
                    id: 1,
                    label: '一级 1',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            children: [
                                {
                                    id: 9,
                                    label: '三级 1-1-1'
                                },
                                {
                                    id: 10,
                                    label: '三级 1-1-2'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    label: '一级 2',
                    children: [
                        {
                            id: 5,
                            label: '二级 2-1'
                        },
                        {
                            id: 6,
                            label: '二级 2-2'
                        }
                    ]
                },
                {
                    id: 3,
                    label: '一级 3',
                    children: [
                        {
                            id: 7,
                            label: '二级 3-1'
                        },
                        {
                            id: 8,
                            label: '二级 3-2'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
                data.children = [];
            }
            data.children.push(newChild);
            this.data = [...this.data];
        },

        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex((d) => d.id === data.id);
            children.splice(index, 1);
            this.data = [...this.data];
        },

        renderContent(h, { node, data, store }) {
            return h(
                'span',
                {
                    class: 'custom-tree-node'
                },
                h('span', null, node.label),
                h(
                    'span',
                    null,
                    h(
                        'a',
                        {
                            onClick: () => this.append(data)
                        },
                        'Append '
                    ),
                    h(
                        'a',
                        {
                            onClick: () => this.remove(node, data)
                        },
                        'Delete'
                    )
                )
            );
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
</style>
