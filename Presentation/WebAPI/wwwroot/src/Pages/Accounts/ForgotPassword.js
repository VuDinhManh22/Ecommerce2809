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
        const { saveForgotPasswordResult } = useStorageManager()
        const { isSubmitting, request } = useAxios()
        const pageLoading = ref(true)
        const successMessage = ref('')

        const forgotPasswordForm = reactive({
            email: ''
        })
        const forgotPasswordErrors = reactive({
            email: ''
        })

        const validateForgotPasswordForm = () => {
            let valid = true
            forgotPasswordErrors.email = ''
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!forgotPasswordForm.email) {
                forgotPasswordErrors.email = 'Email is required.'
                valid = false
            } else if (!emailRegex.test(forgotPasswordForm.email)) {
                forgotPasswordErrors.email = 'Invalid email format.'
                valid = false
            }
            return valid
        }

        const resetForgotPasswordForm = () => {
            forgotPasswordForm.email = ''
        }

        const handleForgotPasswordSubmit = async () => {
            if (!validateForgotPasswordForm()) return

            try {
                const response = await request('post', '/Account/ForgotPassword', {
                    email: forgotPasswordForm.email,
                    host: `${window.location.protocol}//${window.location.host}`
                })

                const data = response.data
                if (data?.content) {
                    successMessage.value = 'Forgot Password successful submitted!. Please check your email.'
                    resetForgotPasswordForm()
                    Swal.fire({
                        title: 'Success!',
                        text: `${successMessage.value}`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/Index'
                        }
                    })
                } else {
                    throw new Error('ForgotPassword failed: No tokens received')
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `ForgotPassword: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            }
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
            handleForgotPasswordSubmit,
            forgotPasswordForm,
            forgotPasswordErrors,
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
