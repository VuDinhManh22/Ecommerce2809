﻿/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, computed, ref, reactive, onMounted } from 'vue'
import { useAccessManager } from 'useAccessManager'
import { useStorageManager } from 'useStorageManager'
import { useAxios } from 'useAxios'
import { usePagedList } from 'usePagedList'
import indotable from 'indotable'
import indosearchbox from 'indosearchbox'
import indoloading from 'indoloading'
import indobutton from 'indobutton'

const app = createApp({
    components: {
        indotable,
        indosearchbox,
        indoloading,
        indobutton
    },
    setup() {
        const { checkPageAccess, hasClaimAccess } = useAccessManager()
        const { getUserId } = useStorageManager()
        const userId = ref(getUserId())
        const { isSubmitting, request } = useAxios()
        const pageLoading = ref(true)
        const successMessage = ref('')
        const columns = ref([
            { columnKey: 'name', columnName: 'Name', columnCaption: 'Name', columnSort: 'Name' },
            { columnKey: 'description', columnName: 'Description', columnCaption: 'Description', columnSort: 'Description' },
        ])
        const {
            paged,
            apiUrl
        } = usePagedList('/Gender/GetPagedGender', ``)
        const pageMode = reactive({
            create: false,
            read: true,
            update: false,
            delete: false
        })
        const formData = reactive({ ...paged.selectedRow })
        const errorData = reactive({})

        const changePageMode = (mode) => {
            successMessage.value = ''
            const modes = ['create', 'read', 'update', 'delete']
            modes.forEach(m => pageMode[m] = m === mode)
        }

        const handleClickClose = () => {
            if (pageMode.create) {
                paged.selectedRow = null
            } else {
                Object.assign(formData, paged.selectedRow)
            }
            changePageMode('read')
            successMessage.value = ''
        }

        const handleClickCreate = () => {
            changePageMode('create')
            paged.selectedRow = {}
            Object.assign(formData, { id: null, name: null, description: null })
        }

        const handleClickEdit = () => {
            changePageMode('update')
            Object.assign(formData, paged.selectedRow)
        }

        const handleClickDelete = async () => {

            changePageMode('delete')
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false
            }).then(async (result) => {

                if (result.isConfirmed) {

                    try {

                        changePageMode('read')

                        const response = await request('delete', `/Gender/DeleteGender`, {
                            id: paged.selectedRow.id,
                            userId: userId.value
                        })

                        if (response?.data?.code === 200) {

                            await getDataTable()
                            Object.assign(paged.selectedRow, { id: null, name: null, description: null })

                            Swal.fire(
                                'Deleted!',
                                'Your data has been deleted.',
                                'success'
                            )
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: `${response?.data?.content?.message}`,
                                icon: 'error',
                                confirmButtonText: 'Ok',
                                allowOutsideClick: false
                            })
                        }

                    } catch (error) {

                        Swal.fire({
                            title: 'Error!',
                            text: `Delete: ${error?.response?.data?.message || error}`,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false
                        })

                    }
                }

                if (!result.isConfirmed) {
                    changePageMode('read')
                }
            })
        }


        const formValidation = () => {
            let valid = true

            errorData.name = ''


            if (!formData.name) {
                errorData.name = 'Name is required.'
                valid = false
            }

            return valid
        }

        const handleSubmitForm = async () => {
            if (!formValidation()) return

            try {
                const response = await request(
                    'post',
                    pageMode.create ? '/Gender/CreateGender' : '/Gender/UpdateGender',
                    {
                        ...(pageMode.create ? {} : { id: formData.id }),
                        userId: userId.value,
                        name: formData.name,
                        symbol: formData.symbol,
                        description: formData.description
                    }
                )

                successMessage.value = `${pageMode.create ? 'Create successfull!' : 'Update successfull!'}`

                Swal.fire({
                    title: 'Success!',
                    text: `${successMessage.value}`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        if (pageMode.create) {
                            changePageMode('update')
                            await getDataTable()
                            paged.selectedRow = {}
                            formData.id = response?.data?.content?.id
                            Object.assign(paged.selectedRow, formData)
                        } else {
                            await getDataTable()
                            Object.assign(paged.selectedRow, formData)
                        }
                    }
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `${pageMode.create ? 'Create' : 'Update'}: ${error}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            } finally {
                isSubmitting.value = false
            }
        }


        const getDataTable = async () => {
            try {
                paged.tableLoading = true
                const response = await request('get', apiUrl.value, {})
                const data = response?.data?.content?.data
                if (data) {
                    paged.data = data.items
                    paged.totalRecords = data.totalRecords
                    paged.totalPages = data.totalPages
                    paged.count = data.count
                    paged.pages = data.pages
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `getDataTable: ${error?.response?.data?.message || error}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            } finally {
                paged.tableLoading = false
            }
        }

        const handleTableAction = async (payload) => {
            paged.limit = payload?.limit ?? paged.limit
            paged.page = payload?.page ?? paged.page
            paged.sortBy = payload?.sortBy ?? paged.sortBy
            paged.sortDirection = payload?.sortDirection ?? paged.sortDirection
            paged.selectedRow = null
            await getDataTable()
        }

        const odataFilter = computed(() => {
            const filters = [
                `contains(tolower(Name), '${paged.searchValue}')`,
                `contains(tolower(Description), '${paged.searchValue}')`
            ]
            return filters.join(' or ')
        })

        const handleSearchAction = async (payload) => {
            paged.searchValue = payload?.searchQuery
            paged.page = 1
            paged.filter = odataFilter.value
            paged.selectedRow = null
            await getDataTable()
        }


        const handleTableActionRowClick = async (payload) => {
            changePageMode('read')
            paged.selectedRow = payload
        }

        const preparePage = async () => {
            await checkPageAccess()
            await getDataTable()
            setTimeout(() => {
                pageLoading.value = false
            }, 100)
        }

        onMounted(async () => {
            await preparePage()
        })


        return {
            columns,
            pageLoading,
            successMessage,
            getDataTable,
            handleTableAction,
            handleSearchAction,
            paged,
            handleTableActionRowClick,
            hasClaimAccess,
            pageMode,
            changePageMode,
            formData,
            errorData,
            handleClickClose,
            handleClickEdit,
            handleClickCreate,
            handleClickDelete,
            handleSubmitForm,
            isSubmitting
        }
    }
})


app.config.errorHandler = (err, instance, info) => {
    Swal.fire({
        title: 'Error!',
        text: `Error: ${err}`,
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
    })
}
app.mount('#app')