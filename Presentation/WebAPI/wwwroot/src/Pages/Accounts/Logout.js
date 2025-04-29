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
        const { clearStorage, getEmail, getUserId } = useStorageManager()
        const { isSubmitting, request } = useAxios()
        const pageLoading = ref(true)
        const successMessage = ref('')
        const logoutForm = reactive({
            email: getEmail(),
            password: 'dummyplaceholder'
        })

        const handleLogoutSubmit = async () => {
            const userId = getUserId()
            try {
                const response = await request('post', '/Account/Logout', { userId })
                clearStorage()
                successMessage.value = 'Logout successful!'
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
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: `Logout: ${error}`,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false
                })
            }

        }

        const handleBackToHome = () => {
            localStorage.setItem('selected-menu', 'UserProfiles')
            window.location.href = '/UserProfiles'
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
            handleLogoutSubmit,
            logoutForm,
            handleBackToHome
        }
    }
})

app.config.errorHandler = (err, instance, info) => {
    Swal.fire({
        title: 'Error!',
        text: `Error: ${err}`,
        icon: 'error',
        confirmButtonText: 'Ok'
    })
}
app.mount('#app')
