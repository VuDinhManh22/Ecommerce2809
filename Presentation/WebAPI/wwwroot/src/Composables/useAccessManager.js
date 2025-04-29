/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { ref } from 'vue'
import { useStorageManager } from 'useStorageManager'
import { useAxios } from 'useAxios'

export function useAccessManager() {
    const hasAccess = ref(false)
    const requiredKey = ref(null)
    const isAuthenticated = ref(false)

    const { getUserClaims, saveIsAuthenticated } = useStorageManager()
    const { request } = useAxios()

    const checkAuthentication = async () => {
        try {
            const response = await request('get', '/Account/CheckLoginStatus', {})
            if (response?.data?.code !== 200) {
                throw new Error(response?.message)
            }
            isAuthenticated.value = true
            saveIsAuthenticated(isAuthenticated.value)
        } catch (error) {
            isAuthenticated.value = false
            console.error('checkAuthentication:', error)
        }
        return isAuthenticated.value
    }

    const checkAuthorization = async () => {

        try {

            if (!await checkAuthentication()) {
                return hasAccess.value
            }

            const userClaims = getUserClaims() || []
            requiredKey.value = document.querySelector('[data-key]')?.dataset.key

            if (requiredKey.value && Array.isArray(userClaims)) {
                hasAccess.value = userClaims.includes(requiredKey.value)
            } else {
                hasAccess.value = false
            }

        } catch (error) {
            hasAccess.value = false
            console.error(error)
        } 
        return hasAccess.value
    }

    const checkPageAccess = async () => {
        if (!await checkAuthorization()) {
            window.location.href = '/Accounts/Unauthorized'
        }
    }

    const checkActionAccess = async () => {
        return await checkAuthorization()
    }

    const hasClaimAccess = (claim) => {
        const userClaims = getUserClaims() || []
        if (requiredKey.value && Array.isArray(userClaims)) {
            return userClaims.includes(claim)
        } else {
            return false
        }
    }

    return {
        checkAuthentication,
        checkAuthorization,
        checkPageAccess,
        checkActionAccess,
        hasAccess,
        isAuthenticated,
        hasClaimAccess
    }
}
