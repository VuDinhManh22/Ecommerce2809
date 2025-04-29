/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, reactive, ref, onMounted } from 'vue'
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
            { columnKey: 'name', columnName: 'Name', columnCaption: 'Name', columnSort: 'Name' }
        ])
        const {
            paged,
            apiUrl
        } = usePagedList('/Role/GetRoles', ``)
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
        const claimLookup = ref([])
        const roleClaims = ref({})
        const accessTypesSelected = ref({})

        const handleClickClose = () => {
            if (pageMode.create) {
                paged.selectedRow = null
            } else {
                Object.assign(formData, paged.selectedRow)
            }
            changePageMode('read')
            successMessage.value = ''
        }

        const refreshRoleTable = () => {

            roleClaims.value = claimLookup.value.reduce((entities, claim) => {
                const [entity, access] = claim.text.split(':')
                if (!entities[entity]) {
                    entities[entity] = [] 
                }
                return entities
            }, {})

            accessTypesSelected.value = Object.keys(roleClaims.value).reduce((acc, entity) => {
                acc[entity] = {
                    Create: false,
                    Read: false,
                    Update: false,
                    Delete: false
                }
                return acc
            }, {})

            if (paged.selectedRow.groupedClaims) {

                for (const entity in paged.selectedRow.groupedClaims) {
                    if (roleClaims.value[entity]) {
                        roleClaims.value[entity] = paged.selectedRow.groupedClaims[entity]
                    }
                }

                accessTypesSelected.value = Object.keys(roleClaims.value).reduce((acc, entity) => {
                    acc[entity] = {
                        Create: roleClaims.value[entity]?.includes('Create') || false,
                        Read: roleClaims.value[entity]?.includes('Read') || false,
                        Update: roleClaims.value[entity]?.includes('Update') || false,
                        Delete: roleClaims.value[entity]?.includes('Delete') || false
                    }
                    return acc
                }, {})

            }

        }

        const handleClickCreate = () => {
            changePageMode('create')
            paged.selectedRow = {}
            Object.assign(formData,
                {
                    name: null,
                })
            refreshRoleTable()
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

                        const response = await request('delete', `/Role/DeleteRole`, {
                            role: paged.selectedRow.name,
                            userId: userId.value
                        })

                        if (response?.data?.code === 200) {

                            await getDataTable()
                            Object.assign(paged.selectedRow,
                                {
                                    id: null,
                                    name: null,
                                    groupedClaims: null
                                })
                            refreshRoleTable()

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
                                confirmButtonText: 'Ok'
                            })
                        }

                    } catch (error) {

                        Swal.fire({
                            title: 'Error!',
                            text: `Delete: ${error?.response?.data?.message}`,
                            icon: 'error',
                            confirmButtonText: 'Ok'
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
            errorData.email = ''

            if (!formData.name) {
                errorData.name = 'Name is required.'
                valid = false
            }

            return valid
        }


        const handleSubmitForm = async () => {
            if (!formValidation()) return

            try {

                let selectedClaims = []

                for (const entity in accessTypesSelected.value) {
                    const entityAccess = accessTypesSelected.value[entity]
                    if (entityAccess.Create) selectedClaims.push(`${entity}:Create`)
                    if (entityAccess.Read) selectedClaims.push(`${entity}:Read`)
                    if (entityAccess.Update) selectedClaims.push(`${entity}:Update`)
                    if (entityAccess.Delete) selectedClaims.push(`${entity}:Delete`)
                }


                const response = await request(
                    'post',
                    pageMode.create ? '/Role/CreateRole' : '/Role/UpdateRole',
                    {
                        ...(pageMode.create ? {} : { id: formData.id }),
                        userId: userId.value,
                        ...(pageMode.create ? { role: formData.name } : {}),
                        ...(pageMode.update ? { newRole: formData.name } : {}),
                        ...(pageMode.update ? { oldRole: paged.selectedRow.name } : {}),
                        claims: selectedClaims
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
                            formData.id = (paged.data.find(item => item.name === formData.name) || {}).id
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

        const handleSearchAction = async (payload) => {
            paged.searchValue = payload?.searchQuery
            paged.page = 1
            paged.selectedRow = null
            await getDataTable()
        }


        const handleTableActionRowClick = async (payload) => {
            changePageMode('read')
            payload.groupedClaims = payload.claims.reduce((acc, claim) => {
                const [entity, access] = claim.split(':')
                if (!acc[entity]) {
                    acc[entity] = []
                }
                acc[entity].push(access)
                return acc
            }, {})
            paged.selectedRow = payload
            refreshRoleTable()
        }



        const preparePage = async () => {
            await checkPageAccess()
            await getDataTable()
            const respClaimLookup = await request('get', '/Claim/GetClaimLookup', {})
            claimLookup.value = respClaimLookup?.data?.content?.data
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
            hasClaimAccess,
            getDataTable,
            handleTableAction,
            handleSearchAction,
            paged,
            formData,
            errorData,
            handleClickClose,
            handleClickEdit,
            handleClickCreate,
            handleClickDelete,
            handleSubmitForm,
            handleTableActionRowClick,
            roleClaims,
            accessTypesSelected,
            pageMode
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