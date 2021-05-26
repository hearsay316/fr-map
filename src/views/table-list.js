import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export function tableList(get_list_fn, data, type_arrs) {
    return get_list_fn(data).then((res) => {
        if (type_arrs) {
            let list = res?.list.map((item) => {
                type_arrs.forEach((type_arr) => {
                    let find_data = type_arr?.data.value?.find((i) => {
                        return i[type_arr.data_type] === item[type_arr.type];
                    });
                    find_data ? (item[type_arr.newType] = find_data[type_arr.data_value]) : void 0;
                });
                return item;
            });
            return {
                total: Number(res.total),
                tableData: list ?? []
            };
        }

        return {
            total: Number(res.total),
            tableData: res?.list ?? []
        };
    });
}

export function object_remove_null(objet) {
    let new_object = {};
    for (let key in objet) {
        if (objet[key]) {
            new_object[key] = objet[key];
        }
    }
    return new_object;
}
