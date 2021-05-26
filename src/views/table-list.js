import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export function tableList(get_list_fn, data, currentPage = 1) {
    return get_list_fn(data).then((res) => {
        console.log(res, 'datadata');
        console.log(res.list[0], 'tableDatatableData');
        return {
            total: Number(res.total),
            currentPage: data.pageNumber,
            pageSize: data.pageSize,
            tableData: res?.list ?? []
        };
    });
}
