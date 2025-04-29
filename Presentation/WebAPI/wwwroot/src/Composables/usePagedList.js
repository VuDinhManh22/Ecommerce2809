/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { reactive, unref, computed } from 'vue'

export function usePagedList(basePath = '', qString = '') {
    const paged = reactive({
        filter: '',
        searchValue: '',
        sortBy: 'CreatedAt',
        sortDirection: 'desc',
        tableLoading: false,
        page: 1,
        limit: 10,
        data: [],
        totalRecords: 0,
        totalPages: 0,
        count: 0,
        pages: [],
        selectedRow: null
    })

    const apiUrl = computed(() => {
        const params = [
            `$skip=${(paged.page - 1) * paged.limit}`,
            `$top=${paged.limit}`,
            `$orderby=${paged.sortBy} ${paged.sortDirection}`,
            paged.filter ? `$filter=${paged.filter}` : null,
            `searchValue=${paged.searchValue}`,
            unref(qString)
        ].filter(Boolean) 

        return `${basePath}?${params.join('&')}`
    })



    return {
        paged,
        apiUrl
    }
}
