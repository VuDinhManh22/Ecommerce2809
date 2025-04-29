/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, computed, reactive, ref, onMounted } from 'vue'
import { useStorageManager } from 'useStorageManager'
import indobutton from 'indobutton'
import indoloading from 'indoloading'
import { useAxios } from 'useAxios'



const app = createApp({
    components: {
        indobutton,
        indoloading
    },
    setup() {
        const { saveLoginResult } = useStorageManager()
        const { isSubmitting, request } = useAxios()
        const pageLoading = ref(true)
        const successMessage = ref('')

        const loginForm = reactive({
            email: '',
            password: ''
        })
        const loginErrors = reactive({
            email: '',
            password: ''
        })

        const validateLoginForm = () => {
            let valid = true
            loginErrors.email = ''
            loginErrors.password = ''
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!loginForm.email) {
                loginErrors.email = 'Email is required.'
                valid = false
            } else if (!emailRegex.test(loginForm.email)) {
                loginErrors.email = 'Invalid email format.'
                valid = false
            }
            if (!loginForm.password) {
                loginErrors.password = 'Password is required.'
                valid = false
            }
            return valid
        }      

        const resetLoginForm = () => {
            loginForm.email = ''
            loginForm.password = ''
        }

        const handleLoginSubmit = async () => {
            if (!validateLoginForm()) return

            try {
                const response = await request('post','/Account/Login', {
                    email: loginForm.email,
                    password: loginForm.password
                })

                const data = response.data
                if (data?.content) {
                    saveLoginResult(data)
                    successMessage.value = 'Login successful!'
                    resetLoginForm()
                    Swal.fire({
                        title: 'Success!',
                        text: `${successMessage.value}`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem('selected-menu', 'UserProfiles')
                            window.location.href = '/UserProfiles'
                        }
                    })
                } else {
                    throw new Error('Login failed: No tokens received')
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Login: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            }
        }

        const handleForgotPasswordClick = () => {
            window.location.href = '/Accounts/ForgotPassword'
        }

        onMounted(async () => {
            setTimeout(() => {
                pageLoading.value = false
            }, 100)
        })

        return {
            pageLoading,
            successMessage,
            isSubmitting,
            handleLoginSubmit,
            loginForm,
            loginErrors,
            handleForgotPasswordClick,
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
