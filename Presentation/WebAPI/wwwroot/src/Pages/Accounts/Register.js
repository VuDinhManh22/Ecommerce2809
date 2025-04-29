/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, reactive, ref, onMounted } from 'vue'
import { useAxios } from 'useAxios'
import indobutton from 'indobutton'
import indoskeleton from 'indoskeleton'

const app = createApp({
    components: {
        indobutton,
        indoskeleton
    },
    setup() {
        const { isSubmitting, request } = useAxios()
        const pageLoading = ref(true)
        const successMessage = ref('')

        const form = reactive({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: ''
        })
        const errors = reactive({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: ''
        })
        const resetForm = () => {
            form.email= ''
            form.firstName = ''
            form.lastName = ''
            form.password = ''
            form.confirmPassword = ''
        }
        const resetErrors = () => {
            errors.email = ''
            errors.firstName = ''
            errors.lastName = ''
            errors.password = ''
            errors.confirmPassword = ''
        }

        const validateRegisterForm = () => {
            let valid = true
            resetErrors()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!form.email) {
                errors.email = 'Email is required.'
                valid = false
            } else if (!emailRegex.test(form.email)) {
                errors.email = 'Invalid email format.'
                valid = false
            }
            if (!form.firstName) {
                errors.firstName = 'First name is required.'
                valid = false
            }
            if (!form.lastName) {
                errors.lastName = 'Last name is required.'
                valid = false
            }
            if (!form.password) {
                errors.password = 'Password is required.'
                valid = false
            }
            if (form.password !== form.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match.'
                valid = false
            }

            return valid
        }


        const handleRegisterSubmit = async () => {
            if (!validateRegisterForm()) return

            try {
                const response = await request('post','/Account/RegisterUser', {
                    email: form.email,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                    host: `${window.location.protocol}//${window.location.host}`
                })

                successMessage.value = 'Registration successful!'
                resetForm()

                Swal.fire({
                    title: 'Success!',
                    text: `${successMessage.value}`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Accounts/Login'
                    }
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Register: ${error}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            } finally {
                isSubmitting.value = false
            }
        }



        onMounted(() => {
            setTimeout(() => {
                pageLoading.value = false
            }, 100) 
        })

        return {
            pageLoading,
            successMessage,
            isSubmitting,
            handleRegisterSubmit,
            form,
            errors,
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
