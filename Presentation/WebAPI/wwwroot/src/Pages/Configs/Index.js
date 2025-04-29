/*
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
            { columnKey: 'currencyName', columnName: 'CurrencyName', columnCaption: 'CurrencyName', columnSort: 'Currency.Name' },
            { columnKey: 'smtpHost', columnName: 'SmtpHost', columnCaption: 'SmtpHost', columnSort: 'SmtpHost' },
            { columnKey: 'smtpPort', columnName: 'SmtpPort', columnCaption: 'SmtpPort', columnSort: 'SmtpPort' },
            { columnKey: 'smtpUserName', columnName: 'SmtpUserName', columnCaption: 'SmtpUserName', columnSort: 'SmtpUserName' },
            { columnKey: 'smtpUseSSL', columnName: 'SmtpUseSSL', columnCaption: 'SmtpUseSSL', columnSort: 'SmtpUseSSL' },
            { columnKey: 'active', columnName: 'Active', columnCaption: 'Active', columnSort: 'Active' },
        ])
        const {
            paged,
            apiUrl
        } = usePagedList('/Config/GetPagedConfig', ``)
        const pageMode = reactive({
            create: false,
            read: true,
            update: false,
            delete: false
        })
        const formData = reactive({ ...paged.selectedRow })
        const errorData = reactive({})
        const currencyLookup = ref([])

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
            Object.assign(formData,
                {   
                    id: null,
                    name: null,
                    currencyId: null,
                    currencyName: null,
                    description: null,
                    active: false,
                    smtpHost: null,
                    smtpPort: 0,
                    smtpUserName: null,
                    smtpPassword: null,
                    smtpUseSSL: false
                })
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

                        const response = await request('delete', `/Config/DeleteConfig`, {
                            id: paged.selectedRow.id,
                            userId: userId.value
                        })

                        if (response?.data?.code === 200) {

                            await getDataTable()
                            Object.assign(paged.selectedRow,
                                {
                                    id: null,
                                    name: null,
                                    description: null,
                                    currencyId: null,
                                    currencyName: null,
                                    active: null,
                                    smtpHost: null,
                                    smtpPort: null,
                                    smtpUserName: null,
                                    smtpPassword: null,
                                    smtpUseSSL: null
                                })

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
            errorData.currencyId = ''
            errorData.smtpHost = ''
            errorData.smtpPort = 0
            errorData.smtpUserName = ''
            errorData.smtpPassword = ''
            errorData.smtpUseSSL = false
            errorData.active = false

            if (!formData.name) {
                errorData.name = 'Name is required.'
                valid = false
            }
            if (!formData.currencyId) {
                errorData.currencyId = 'Currency is required.'
                valid = false
            }
            if (!formData.smtpHost) {
                errorData.smtpHost = 'SMTP Host is required.'
                valid = false
            }
            if (formData.smtpPort === null || formData.smtpPort === undefined || formData.smtpPort === "") {
                errorData.smtpPort = 'SMTP Port is required.';
                valid = false;
            }
            if (!formData.smtpUserName) {
                errorData.smtpUserName = 'SMTP UserName is required.'
                valid = false
            }
            if (pageMode.create) {
                if (!formData.smtpPassword) {
                    errorData.smtpPassword = 'SMTP Password is required.'
                    valid = false
                }
            }
            if (formData.smtpUseSSL === null || formData.smtpUseSSL === undefined || formData.smtpUseSSL === "") {
                errorData.smtpUseSSL = 'SMTP Use SSL is required.'
                valid = false
            }
            if (formData.active === null || formData.active === undefined || formData.active === "") {
                errorData.active = 'Active is required.'
                valid = false
            }

            return valid
        }

        const handleSubmitForm = async () => {
            if (!formValidation()) return

            try {
                const response = await request(
                    'post',
                    pageMode.create ? '/Config/CreateConfig' : '/Config/UpdateConfig',
                    {
                        ...(pageMode.create ? {} : { id: formData.id }),
                        userId: userId.value,
                        name: formData.name,
                        description: formData.description,
                        currencyId: formData.currencyId,
                        smtpHost: formData.smtpHost,
                        smtpPort: formData.smtpPort,
                        smtpUserName: formData.smtpUserName,
                        smtpPassword: formData.smtpPassword,
                        smtpUseSSL: formData.smtpUseSSL,
                        active: formData.active
                    }
                )

                successMessage.value = `${pageMode.create ? 'Create successfull!' : 'Update successfull!'}`

                Swal.fire({
                    title: 'Success!',
                    text: `${successMessage.value} ${paged.selectedRow.active !== formData.active && formData.active === true ? 'Changes in active config, screen will refreshed' : ''}`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        if (paged.selectedRow.active !== formData.active && formData.active === true) {
                            window.location.href = '/Configs'
                        }

                        if (pageMode.create) {
                            changePageMode('update')
                            await getDataTable()
                            paged.selectedRow = {}
                            formData.id = response?.data?.content?.id
                            formData.smtpPassword = null
                            Object.assign(paged.selectedRow, formData)
                        } else {
                            await getDataTable()
                            formData.smtpPassword = null
                            Object.assign(paged.selectedRow, formData)
                        }
                    }
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `${pageMode.create ? 'Create' : 'Update'}: ${error?.response?.data?.message || error}`,
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
                `contains(tolower(Description), '${paged.searchValue}')`,
                `contains(tolower(SmtpHost), '${paged.searchValue}')`,
                `contains(tolower(SmtpUserName), '${paged.searchValue}')`,
                paged.searchValue && !isNaN(paged.searchValue) ? `SmtpPort eq ${paged.searchValue}` : null,
                paged.searchValue && (paged.searchValue === 'true' || paged.searchValue === 'false') ? `SmtpUseSSL eq ${paged.searchValue}` : null,
                paged.searchValue && (paged.searchValue === 'true' || paged.searchValue === 'false') ? `Active eq ${paged.searchValue}` : null
            ].filter(Boolean)
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
            const response = await request('get', '/Currency/GetCurrencyLookup', {})
            currencyLookup.value = response?.data?.content?.data
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
            isSubmitting,
            currencyLookup
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