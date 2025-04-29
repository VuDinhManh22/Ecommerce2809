/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, computed, ref, reactive, onMounted, watch } from 'vue'
import { useAccessManager } from 'useAccessManager'
import { useStorageManager } from 'useStorageManager'
import { useClientSideSorting } from 'useClientSideSorting'
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
        //setup
        const { checkPageAccess, hasClaimAccess } = useAccessManager()
        const { getUserId } = useStorageManager()
        const userId = ref(getUserId())
        const { isSubmitting, request } = useAxios()
        const pageLoading = ref(true)
        const successMessage = ref('')

        //master
        const columns = ref([
            { columnKey: 'code', columnName: 'Code', columnCaption: 'Code', columnSort: 'Code' },
            { columnKey: 'name', columnName: 'Name', columnCaption: 'Name', columnSort: 'Name' },
            { columnKey: 'vendorGroupName', columnName: 'VendorGroupName', columnCaption: 'Group', columnSort: 'VendorGroup.Name' },
            { columnKey: 'vendorSubGroupName', columnName: 'VendorSubGroupName', columnCaption: 'Sub', columnSort: 'VendorSubGroup.Name' },
            { columnKey: 'street', columnName: 'Street', columnCaption: 'Street', columnSort: 'Street' },
            { columnKey: 'city', columnName: 'City', columnCaption: 'City', columnSort: 'City' }
        ])
        const {
            paged,
            apiUrl
        } = usePagedList('/Vendor/GetPagedVendor', ``)
        const pageMode = reactive({
            create: false,
            read: true,
            update: false,
            delete: false
        })
        const formData = reactive({ ...paged.selectedRow })
        const errorData = reactive({})
        const vendorGroupLookup = ref([])
        const vendorSubGroupLookup = ref([])


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
                    vendorGroupId: null,
                    vendorGroupName: null,
                    vendorSubGroupId: null,
                    vendorSubGroupName: null,
                    name: null,
                    code: null,
                    description: null,
                    street: null,
                    city: null,
                    stateOrProvince: null,
                    zipCode: null,
                    country: null,
                    phone: null,
                    email: null,
                    website: null
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

                        const response = await request('delete', `/Vendor/DeleteVendor`, {
                            id: paged.selectedRow.id,
                            userId: userId.value
                        })

                        if (response?.data?.code === 200) {

                            await getDataTable()
                            Object.assign(paged.selectedRow,
                                {
                                    vendorGroupId: null,
                                    vendorGroupName: null,
                                    vendorSubGroupId: null,
                                    vendorSubGroupName: null,
                                    name: null,
                                    code: null,
                                    description: null,
                                    street: null,
                                    city: null,
                                    stateOrProvince: null,
                                    zipCode: null,
                                    country: null,
                                    phone: null,
                                    email: null,
                                    website: null,
                                    vendorContacts: []
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
            errorData.vendorGroupId = ''
            errorData.street = ''
            errorData.city = ''
            errorData.stateOrProvince = ''
            errorData.zipCode = ''
            errorData.phone = ''
            errorData.email = ''


            if (!formData.name) {
                errorData.name = 'Name is required.'
                valid = false
            }
            if (!formData.vendorGroupId) {
                errorData.vendorGroupId = 'VendorGroup is required.'
                valid = false
            }
            if (!formData.street) {
                errorData.street = 'Street is required.'
                valid = false
            }
            if (!formData.city) {
                errorData.city = 'City is required.'
                valid = false
            }
            if (!formData.stateOrProvince) {
                errorData.stateOrProvince = 'State/Province is required.'
                valid = false
            }
            if (!formData.zipCode) {
                errorData.zipCode = 'ZipCode is required.'
                valid = false
            }
            if (!formData.phone) {
                errorData.phone = 'Phone is required.'
                valid = false
            }
            if (!formData.email) {
                errorData.email = 'Email is required.'
                valid = false
            }

            return valid
        }

        const handleSubmitForm = async () => {
            if (!formValidation()) return

            try {
                const response = await request(
                    'post',
                    pageMode.create ? '/Vendor/CreateVendor' : '/Vendor/UpdateVendor',
                    {
                        ...(pageMode.create ? {} : { id: formData.id }),
                        userId: userId.value,
                        name: formData.name,
                        description: formData.description,
                        vendorGroupId: formData.vendorGroupId,
                        vendorSubGroupId: formData.vendorSubGroupId,
                        street: formData.street,
                        city: formData.city,
                        stateOrProvince: formData.stateOrProvince,
                        zipCode: formData.zipCode,
                        country: formData.country,
                        phone: formData.phone,
                        email: formData.email,
                        website: formData.website,
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
                            formData.code = response?.data?.content?.code
                            formData.vendorGroupName = vendorGroupLookup.value.find(vendorGroup => vendorGroup.value === formData.vendorGroupId)?.text || 'N/A'
                            formData.vendorSubGroupName = vendorSubGroupLookup.value.find(vendorSubGroup => vendorSubGroup.value === formData.vendorSubGroupId)?.text || 'N/A'
                            Object.assign(paged.selectedRow, formData)
                        } else {
                            await getDataTable()
                            formData.vendorGroupName = vendorGroupLookup.value.find(vendorGroup => vendorGroup.value === formData.vendorGroupId)?.text || 'N/A'
                            formData.vendorSubGroupName = vendorSubGroupLookup.value.find(vendorSubGroup => vendorSubGroup.value === formData.vendorSubGroupId)?.text || 'N/A'
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
                `contains(tolower(Code), '${paged.searchValue}')`,
                `contains(tolower(Name), '${paged.searchValue}')`,
                `contains(tolower(Street), '${paged.searchValue}')`,
                `contains(tolower(City), '${paged.searchValue}')`
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

            //load child
            pagedChild.data = payload.vendorContacts
            pagedChild.selectedRow = null
        }


        watch(() => formData.vendorGroupId, async (newValue, oldValue) => {
            let url = '/VendorSubGroup/GetVendorSubGroupLookup'
            if (newValue !== null) {
                url += `?vendorGroupId=${newValue}`
            }
            const respVendorSubGroupLookup = await request('get', url)
            vendorSubGroupLookup.value = respVendorSubGroupLookup?.data?.content?.data
        })




        //child
        const childColumns = ref([
            { columnKey: 'firstName', columnName: 'FirstName', columnCaption: 'FirstName', columnSort: 'FirstName' },
            { columnKey: 'lastName', columnName: 'LastName', columnCaption: 'LastName', columnSort: 'LastName' },
            { columnKey: 'genderName', columnName: 'GenderName', columnCaption: 'GenderName', columnSort: 'GenderName' },
            { columnKey: 'jobTitle', columnName: 'JobTitle', columnCaption: 'JobTitle', columnSort: 'JobTitle' },
            { columnKey: 'email', columnName: 'Email', columnCaption: 'Email', columnSort: 'Email' },
        ])
        const {
            paged: pagedChild
        } = usePagedList('', ``)
        const childMode = reactive({
            create: false,
            read: true,
            update: false,
            delete: false
        })
        const formChildData = reactive({ ...pagedChild.selectedRow })
        const errorChildData = reactive({})
        let childModal = null
        let childModalInstance = null
        const genderLookup = ref([])

        const formChildValidation = () => {
            let valid = true

            errorChildData.firstName = ''
            errorChildData.lastName = ''
            errorChildData.genderId = ''
            errorChildData.jobTitle = ''
            errorChildData.phone = ''
            errorChildData.email = ''


            if (!formChildData.firstName) {
                errorChildData.firstName = 'FirstName is required.'
                valid = false
            }
            if (!formChildData.lastName) {
                errorChildData.lastName = 'LastName is required.'
                valid = false
            }
            if (!formChildData.genderId) {
                errorChildData.genderId = 'Gender is required.'
                valid = false
            }
            if (!formChildData.jobTitle) {
                errorChildData.jobTitle = 'JobTitle is required.'
                valid = false
            }
            if (!formChildData.phone) {
                errorChildData.phone = 'Phone is required.'
                valid = false
            }
            if (!formChildData.email) {
                errorChildData.email = 'Email is required.'
                valid = false
            }

            return valid
        }

        const handleSubmitFormChild = async () => {
            if (!formChildValidation()) return

            try {
                let url = ''
                let method = 'post'

                if (childMode.create) {
                    url = '/VendorContact/CreateVendorContact'
                } else if (childMode.update) {
                    url = '/VendorContact/UpdateVendorContact'
                } else if (childMode.delete) {
                    url = '/VendorContact/DeleteVendorContact'
                    method = 'delete'
                }

                const response = await request(
                    method,
                    url,
                    {
                        ...(pageMode.create ? {} : { id: formChildData.id }),
                        userId: userId.value,
                        vendorId: paged.selectedRow.id,
                        firstName: formChildData.firstName,
                        lastName: formChildData.lastName,
                        genderId: formChildData.genderId,
                        description: formChildData.description,
                        jobTitle: formChildData.jobTitle,
                        mobilePhone: formChildData.mobilePhone,
                        socialMedia: formChildData.socialMedia,
                        address: formChildData.address,
                        city: formChildData.city,
                        stateOrProvince: formChildData.stateOrProvince,
                        zipCode: formChildData.zipCode,
                        country: formChildData.country,
                        phone: formChildData.phone,
                        email: formChildData.email,
                        website: formChildData.website,
                    }
                )

                successMessage.value =
                    childMode.create
                        ? 'Create successful!'
                        : childMode.update
                            ? 'Update successful!'
                            : 'Delete successful!';


                Swal.fire({
                    title: 'Success!',
                    text: `${successMessage.value}`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        handleCloseModalChild()
                        await getDataTable()
                        pagedChild.data = paged.data.find(item => item.id === paged.selectedRow.id)?.vendorContacts

                        if (childMode.create) {
                            formChildData.id = response?.data?.content?.id
                            pagedChild.selectedRow = {}
                            formChildData.genderName = genderLookup.value.find(gender => gender.value === formData.genderId)?.text || 'N/A'
                            Object.assign(pagedChild.selectedRow, formChildData)
                        } else if (childMode.update) {
                            formChildData.genderName = genderLookup.value.find(gender => gender.value === formData.genderId)?.text || 'N/A'
                            Object.assign(pagedChild.selectedRow, formChildData)
                        } else if (childMode.delete) {
                            pagedChild.selectedRow = null
                        }

                    }
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `${childMode.create
                        ? 'Create'
                        : childMode.update
                            ? 'Update'
                            : 'Delete'}: ${error?.response?.data?.message || error}`,

                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            } finally {
                isSubmitting.value = false
            }
        }

        const changeChildMode = (mode) => {
            const modes = ['create', 'read', 'update', 'delete']
            modes.forEach(m => childMode[m] = m === mode)
        }

        const handleClickCreateChild = () => {
            successMessage.value = ''
            changeChildMode('create')
            pagedChild.selectedRow = null
            Object.assign(formChildData,
                {
                    vendorId: null,
                    vendorName: null,
                    firstName: null,
                    lastName: null,
                    genderId: null,
                    genderName: null,
                    description: null,
                    jobTitle: null,
                    mobilePhone: null,
                    socialMedia: null,
                    address: null,
                    city: null,
                    stateOrProvince: null,
                    zipCode: null,
                    country: null,
                    phone: null,
                    email: null,
                    website: null
                })
            childModalInstance.show()
        }

        const handleClickEditChild = () => {
            successMessage.value = ''
            changeChildMode('update')
            Object.assign(formChildData, pagedChild.selectedRow)
            childModalInstance.show()
        }

        const handleClickDeleteChild = () => {
            successMessage.value = ''
            changeChildMode('delete')
            Object.assign(formChildData, pagedChild.selectedRow)
            childModalInstance.show()
        }

        const handleCloseModalChild = () => {
            childModalInstance.hide()
        }

        const handleTableChildActionRowClick = async (payload) => {
            successMessage.value = ''
            pagedChild.selectedRow = payload
        }

        const handleTableChildAction = async (payload) => {
            successMessage.value = ''
            pagedChild.sortBy = payload?.sortBy ?? paged.sortBy
            pagedChild.sortDirection = payload?.sortDirection ?? paged.sortDirection
            pagedChild.data = useClientSideSorting(pagedChild.data, pagedChild.sortBy, pagedChild.sortDirection)
            pagedChild.selectedRow = null
        }

        //init
        const preparePage = async () => {
            await checkPageAccess()
            await getDataTable()
            const respVendorGroupLookup = await request('get', '/VendorGroup/GetVendorGroupLookup', {})
            vendorGroupLookup.value = respVendorGroupLookup?.data?.content?.data
            const respGenderLookup = await request('get', '/Gender/GetGenderLookup', {})
            genderLookup.value = respGenderLookup?.data?.content?.data
            childModal = document.querySelector('[data-modal="childModal"]')
            childModalInstance = new window.bootstrap.Modal(childModal)
            setTimeout(() => {
                pageLoading.value = false
            }, 100)
        }

        onMounted(async () => {
            await preparePage()
        })


        return {
            //master
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
            vendorGroupLookup,
            vendorSubGroupLookup,

            //child
            handleClickCreateChild,
            handleClickEditChild,
            handleClickDeleteChild,
            handleCloseModalChild,
            handleSubmitFormChild,
            pagedChild,
            childMode,
            childColumns,
            handleTableChildActionRowClick,
            handleTableChildAction,
            formChildData,
            errorChildData,
            genderLookup,
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