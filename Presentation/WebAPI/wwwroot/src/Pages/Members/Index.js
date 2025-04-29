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
            { columnKey: 'firstName', columnName: 'FirstName', columnCaption: 'FirstName', columnSort: 'FirstName' },
            { columnKey: 'lastName', columnName: 'LastName', columnCaption: 'LastName', columnSort: "LastName" },
            { columnKey: 'email', columnName: 'Email', columnCaption: 'Email', columnSort: 'Email' },
            { columnKey: 'emailConfirmed', columnName: 'EmailConfirmed', columnCaption: 'EmailConfirmed', columnSort: null },
            { columnKey: 'isBlocked', columnName: 'IsBlocked', columnCaption: 'IsBlocked', columnSort: null },
            { columnKey: 'isDeleted', columnName: 'IsDeleted', columnCaption: 'IsDeleted', columnSort: null }
        ])
        const {
            paged,
            apiUrl
        } = usePagedList('/Member/GetMembers', ``)
        const imageUrl = ref(null)
        const selectedProfilePicture = ref(null)
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
        const roleLookup = ref([])
        const memberClaims = ref({})
        const memberRoles = ref({})
        const claimsTypesSelected = ref({})
        const rolesTypesSelected = ref({})

        const handleClickClose = () => {
            if (pageMode.create) {
                paged.selectedRow = null
            } else {
                Object.assign(formData, paged.selectedRow)
            }
            changePageMode('read')
            successMessage.value = ''
        }

        const refreshClaimTable = () => {
            memberClaims.value = claimLookup.value.reduce((entities, claim) => {
                const [entity, access] = claim.text.split(':')
                if (!entities[entity]) {
                    entities[entity] = [] 
                }
                return entities
            }, {})

            claimsTypesSelected.value = Object.keys(memberClaims.value).reduce((acc, entity) => {
                acc[entity] = {
                    Create: false,
                    Read: false,
                    Update: false,
                    Delete: false
                }
                return acc
            }, {})

            if (paged.selectedRow.id) {
                let claims = paged.data.find(item => item.id === paged.selectedRow.id)?.claims
                if (claims) {
                    let groupedClaims = claims.reduce((acc, claim) => {
                        const [entity, access] = claim.split(':')
                        if (!acc[entity]) {
                            acc[entity] = []
                        }
                        acc[entity].push(access)
                        return acc
                    }, {})

                    memberClaims.value = claimLookup.value.reduce((entities, claim) => {
                        const [entity, access] = claim.text.split(':')
                        if (!entities[entity]) {
                            entities[entity] = []
                        }
                        return entities
                    }, {})

                    for (const entity in groupedClaims) {
                        if (memberClaims.value[entity]) {
                            memberClaims.value[entity] = groupedClaims[entity]
                        }
                    }

                    claimsTypesSelected.value = Object.keys(memberClaims.value).reduce((acc, entity) => {
                        acc[entity] = {
                            Create: memberClaims.value[entity]?.includes('Create') || false,
                            Read: memberClaims.value[entity]?.includes('Read') || false,
                            Update: memberClaims.value[entity]?.includes('Update') || false,
                            Delete: memberClaims.value[entity]?.includes('Delete') || false
                        }
                        return acc
                    }, {})

                }
            }
        }

        const refreshRoleTable = () => {
            memberRoles.value = roleLookup.value.map(role => role.text)
            rolesTypesSelected.value = memberRoles.value.reduce((acc, role) => {
                acc[role] = false
                return acc
            }, {})

            if (paged.selectedRow.roles) {
                rolesTypesSelected.value = memberRoles.value.reduce((acc, role) => {
                    acc[role] = paged.selectedRow.roles.includes(role)
                    return acc
                }, {})
            }
        }

        const handleClickCreate = () => {
            changePageMode('create')
            paged.selectedRow = {}
            Object.assign(formData,
                {
                    id: null,
                    email: null,
                    firstName: null,
                    lastName: null,
                    password: null,
                    confirmPassword: null,
                    emailConfirmed: null,
                    blocked: null,
                    deleted: null,
                    roles: null
                })
            refreshClaimTable()
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
                        const response = await request('delete', `/Member/DeleteMember`, {
                            email: paged.selectedRow.email,
                            userId: userId.value
                        })

                        if (response?.data?.code === 200) {

                            await getDataTable()
                            Object.assign(paged.selectedRow,
                                {
                                    id: null,
                                    email: null,
                                    firstName: null,
                                    lastName: null,
                                    password: null,
                                    confirmPassword: null,
                                    emailConfirmed: null,
                                    blocked: null,
                                    deleted: null,
                                    roles: null
                                })

                            refreshClaimTable()
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

            errorData.email = ''
            errorData.firstName = ''
            errorData.lastName = ''

            if (!formData.email) {
                errorData.email = 'Email is required.'
                valid = false
            }
            if (!formData.firstName) {
                errorData.firstName = 'FirstName is required.'
                valid = false
            }
            if (!formData.lastName) {
                errorData.lastName = 'LastName is required.'
                valid = false
            }

            return valid
        }


        const handleSubmitForm = async () => {
            if (!formValidation()) return

            try {

                let selectedRoles = []

                for (const role in rolesTypesSelected.value) {
                    if (rolesTypesSelected.value[role]) {
                        selectedRoles.push(role)
                    }
                }


                const response = await request(
                    'post',
                    pageMode.create ? '/Member/CreateMember' : '/Member/UpdateMember',
                    {
                        ...(pageMode.create ? {} : { id: formData.id }),
                        userId: userId.value,
                        email: formData.email,
                        ...(formData.password ? { password: formData.password } : {}),
                        ...(formData.confirmPassword ? { confirmPassword: formData.confirmPassword } : {}),
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        emailConfirmed: formData.emailConfirmed ?? false,
                        isBlocked: formData.isBlocked ?? false,
                        isDeleted: formData.isDeleted ?? false,
                        roles: selectedRoles
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
                        refreshClaimTable()

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



        const handleProfilePictureChange = async (event) => {
            const file = event.target.files[0]
            if (file) {
                selectedProfilePicture.value = file
                imageUrl.value = URL.createObjectURL(selectedProfilePicture.value)
            }
        }

        const uploadProfilePicture = async () => {
            try {
                const email = paged.selectedRow.email
                const formData = new FormData()
                formData.append('imageFile', selectedProfilePicture.value)
                const response = await request('post', `/UserProfile/UploadProfilePictureMember?userEmail=${email}`, formData)
                paged.selectedRow.profilePictureName = response?.data?.content?.imageName
                Swal.fire({
                    title: 'Success!',
                    text: 'Profile picture uploaded successfully.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `UploadProfilePicture: ${error?.response?.data?.message || error}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            }
        }

        const handleTableActionRowClick = async (payload) => {
            changePageMode('read')
            paged.selectedRow = payload
            refreshClaimTable()
            refreshRoleTable()

            const response = await request('get', `/FileOperation/GetImage?imageName=${paged?.selectedRow?.profilePictureName || ''}`, {}, {}, 'blob')
            imageUrl.value = URL.createObjectURL(response.data)
        }



        const preparePage = async () => {
            await checkPageAccess()
            await getDataTable()
            const respClaimLookup = await request('get', '/Claim/GetClaimLookup', {})
            claimLookup.value = respClaimLookup?.data?.content?.data
            const respRoleLookup = await request('get', '/Role/GetRoleLookup', {})
            roleLookup.value = respRoleLookup?.data?.content?.data
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
            memberClaims,
            memberRoles,
            claimsTypesSelected,
            rolesTypesSelected,
            pageMode,
            imageUrl,
            handleProfilePictureChange,
            uploadProfilePicture,
            selectedProfilePicture
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