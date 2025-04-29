/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { defineComponent, ref } from 'vue'

export default defineComponent({
    props: {
        columns: {
            type: Array,
            default: null
        },
        data: {
            type: Array,
            default: null
        },
        pages: {
            type: Array,
            default: null
        },
        limit: {
            type: Number,
            default: null
        },
        page: {
            type: Number,
            default: null
        },
        totalRecords: {
            type: Number,
            default: null
        },
        totalPages: {
            type: Number,
            default: null
        },
        tableLoading: {
            type: Boolean,
            default: false
        },
        sortBy: {
            type: String,
            default: 'createdAt'
        },
        sortDirection: {
            type: String,
            default: 'asc'
        },
        selectedRow: {
            type: Object,
            default: null
        },
        tableClass: {
            type: String,
            default: 'table-dark'
        },
        clientSideMode: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {

        const handlePageClick = (pageNumber) => {
            emit('table-action', { page: pageNumber })
        }

        const handleLimitChange = (event) => {
            emit('table-action', { limit: parseInt(event.target.value), page : 1 })
        }

        const handleSorting = (sortColumn) => {
            let direction = 'asc'
            if (props.sortBy === sortColumn) {
                direction = props.sortDirection === 'asc' ? 'desc' : 'asc'
            } 
            emit('table-action', { sortBy: sortColumn, sortDirection: direction })
        }

        const handleRowClick = (row) => {
            emit('table-action-rowclick', row)
            props.selectedRow = row
        }

        return { handlePageClick, handleLimitChange, handleSorting, handleRowClick }
    },
    template:
    `
    <div>
        <!-- Table -->
        <table :class="tableClass">
            <thead>
                <tr>
                    <th v-for="(column, index) in columns" :key="index" scope="col">
                        <div v-if="column.columnSort">
                            <button v-on:click="handleSorting(column.columnSort)"
                                    class="btn btn-link p-0 fw-bold"
                                    style="text-decoration: none; color: var(--table-header-color);">
                                <span>{{ column.columnCaption }}</span>
                                <i v-if="sortBy !== column.columnSort"
                                   class="bi bi-chevron-expand ms-1">
                                </i>
                                <i v-if="sortBy === column.columnSort && sortDirection === 'asc'"
                                   class="bi ms-1 bi-caret-up-fill">
                                </i>
                                <i v-if="sortBy === column.columnSort && sortDirection === 'desc'"
                                   class="bi ms-1 bi-caret-down-fill">
                                </i>
                            </button>
                        </div>
                        <div v-else>
                            <span class="fw-bold">{{ column.columnName }}</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody v-if="data?.length > 0">
                <tr v-for="(row, rowIndex) in data"
                    :key="rowIndex"
                    v-bind:class="{ 'row-selected': selectedRow?.id === row?.id }"
                    v-on:click="handleRowClick(row)">
                    <td v-for="(column, colIndex) in columns" :key="colIndex">
                        {{ row[column.columnKey] }}
                    </td>
                </tr>
            </tbody>
            <template v-else>
                <tr>
                    <td colspan="100%" class="text-center">No data.</td>
                </tr>
            </template>
        </table>

        <!-- Limit Selection -->
        <div v-if="!clientSideMode" class="d-flex justify-content-between align-items-center mt-3">
            <!-- Limit Selection -->
            <div>
                <label for="limitSelect" class="form-label me-2">Show:</label>
                <select id="limitSelect" class="form-select d-inline-block w-auto" :value="limit" v-on:change="handleLimitChange">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <span> from: <strong>{{ totalRecords ?? 'N/A' }}</strong> records.</span>
            </div>

            <div v-if="tableLoading">
                <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Pagination -->
            <nav aria-label="Page navigation">
                <ul class="pagination mb-0">
                    <li class="page-item" v-for="pageNumber in pages" :key="pageNumber">
                        <button v-if="data?.length > 0" class="page-link"
                                v-on:click="handlePageClick(pageNumber)"
                                :class="{'font-weight-bold text-dark': pageNumber === page}">
                            {{ pageNumber }}
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    `
})
