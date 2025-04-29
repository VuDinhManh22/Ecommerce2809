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
            { columnKey: 'firstName', columnName: 'FirstName', columnCaption: 'FirstName', columnSort: 'FirstName' },
            { columnKey: 'lastName', columnName: 'LastName', columnCaption: 'LastName', columnSort: 'LastName' },
            { columnKey: 'genderName', columnName: 'GenderName', columnCaption: 'GenderName', columnSort: 'Gender.Name' },
            { columnKey: 'jobTitle', columnName: 'JobTitle', columnCaption: 'JobTitle', columnSort: 'JobTitle' },
            { columnKey: 'email', columnName: 'Email', columnCaption: 'Email', columnSort: 'Email' },
            { columnKey: 'customerName', columnName: 'CustomerName', columnCaption: 'CustomerName', columnSort: 'Customer.Name' }
        ])
        const {
            paged,
            apiUrl
        } = usePagedList('/CustomerContact/GetPagedCustomerContact', ``)
        const pageMode = reactive({
            create: false,
            read: true,
            update: false,
            delete: false
        })
        const formData = reactive({ ...paged.selectedRow })
        const errorData = reactive({})
        const customerLookup = ref([])
        const genderLookup = ref([])

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
                    customerId: null,
                    customerName: null,
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

                        const response = await request('delete', `/CustomerContact/DeleteCustomerContact`, {
                            id: paged.selectedRow.id,
                            userId: userId.value,
                            customerId: paged.selectedRow.customerId
                        })
                        
                        if (response?.data?.code === 200) {
                            
                            await getDataTable()
                            Object.assign(paged.selectedRow,
                                {
                                    customerId: null,
                                    customerName: null,
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

            errorData.customerId = ''
            errorData.firstName = ''
            errorData.lastName = ''
            errorData.genderId = ''
            errorData.jobTitle = ''
            errorData.phone = ''
            errorData.email = ''

            if (!formData.customerId) {
                errorData.customerId = 'Customer is required.'
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
            if (!formData.genderId) {
                errorData.genderId = 'Gender is required.'
                valid = false
            }
            if (!formData.jobTitle) {
                errorData.jobTitle = 'JobTitle is required.'
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
                    pageMode.create ? '/CustomerContact/CreateCustomerContact' : '/CustomerContact/UpdateCustomerContact',
                    {
                        ...(pageMode.create ? {} : { id: formData.id }),
                        userId: userId.value,
                        customerId: formData.customerId,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        genderId: formData.genderId,
                        description: formData.description,
                        jobTitle: formData.jobTitle,
                        mobilePhone: formData.mobilePhone,
                        socialMedia: formData.socialMedia,
                        address: formData.address,
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
                            formData.customerName = customerLookup.value.find(customer => customer.value === formData.customerId)?.text || 'N/A'
                            formData.genderName = genderLookup.value.find(gender => gender.value === formData.genderId)?.text || 'N/A'
                            Object.assign(paged.selectedRow, formData)
                        } else {
                            await getDataTable()
                            formData.customerName = customerLookup.value.find(customer => customer.value === formData.customerId)?.text || 'N/A'
                            formData.genderName = genderLookup.value.find(gender => gender.value === formData.genderId)?.text || 'N/A'
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
                `contains(tolower(FirstName), '${paged.searchValue}')`,
                `contains(tolower(LastName), '${paged.searchValue}')`,
                `contains(tolower(JobTitle), '${paged.searchValue}')`,
                `contains(tolower(Email), '${paged.searchValue}')`
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
            const respCustomerLookup = await request('get', '/Customer/GetCustomerLookup', {})
            customerLookup.value = respCustomerLookup?.data?.content?.data
            const respGenderLookup = await request('get', '/Gender/GetGenderLookup', {})
            genderLookup.value = respGenderLookup?.data?.content?.data
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
            customerLookup,
            genderLookup
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