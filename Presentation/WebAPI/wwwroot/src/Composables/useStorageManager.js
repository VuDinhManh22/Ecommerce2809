/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    IS_AUTHENTICATED: 'isAuthenticated',
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    EMAIL: 'email',
    USER_ID: 'userId',
    USER_CLAIMS: 'userClaims',
    MAIN_NAVIGATIONS: 'mainNavigations'
}

export function useStorageManager() {
    const save = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Failed to save data to localStorage', error)
        }
    }

    const get = (key) => {
        try {
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : null
        } catch (error) {
            console.error('Failed to retrieve data from localStorage', error)
            return null
        }
    }

    const remove = (key) => {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Failed to remove data from localStorage', error)
        }
    }

    const clearStorage = () => {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('Failed to clear localStorage', error)
        }
    }

    const saveAccessToken = (token) => save(STORAGE_KEYS.ACCESS_TOKEN, token)
    const getAccessToken = () => get(STORAGE_KEYS.ACCESS_TOKEN)
    const removeAccessToken = () => remove(STORAGE_KEYS.ACCESS_TOKEN)

    const saveRefreshToken = (token) => save(STORAGE_KEYS.REFRESH_TOKEN, token)
    const getRefreshToken = () => get(STORAGE_KEYS.REFRESH_TOKEN)
    const removeRefreshToken = () => remove(STORAGE_KEYS.REFRESH_TOKEN)

    const saveIsAuthenticated = (status) => save(STORAGE_KEYS.IS_AUTHENTICATED, status)
    const getIsAuthenticated = () => get(STORAGE_KEYS.IS_AUTHENTICATED)
    const removeIsAuthenticated = () => remove(STORAGE_KEYS.IS_AUTHENTICATED)

    const saveFirstName = (firstName) => save(STORAGE_KEYS.FIRST_NAME, firstName)
    const getFirstName = () => get(STORAGE_KEYS.FIRST_NAME)
    const removeFirstName = () => remove(STORAGE_KEYS.FIRST_NAME)

    const saveLastName = (lastName) => save(STORAGE_KEYS.LAST_NAME, lastName)
    const getLastName = () => get(STORAGE_KEYS.LAST_NAME)
    const removeLastName = () => remove(STORAGE_KEYS.LAST_NAME)

    const saveEmail = (email) => save(STORAGE_KEYS.EMAIL, email)
    const getEmail = () => get(STORAGE_KEYS.EMAIL)
    const removeEmail = () => remove(STORAGE_KEYS.EMAIL)

    const saveUserId = (userId) => save(STORAGE_KEYS.USER_ID, userId)
    const getUserId = () => get(STORAGE_KEYS.USER_ID)
    const removeUserId = () => remove(STORAGE_KEYS.USER_ID)

    const saveUserClaims = (claims) => save(STORAGE_KEYS.USER_CLAIMS, claims)
    const getUserClaims = () => get(STORAGE_KEYS.USER_CLAIMS)
    const removeUserClaims = () => remove(STORAGE_KEYS.USER_CLAIMS)

    const saveMainNavigations = (navigations) => save(STORAGE_KEYS.MAIN_NAVIGATIONS, navigations)
    const getMainNavigations = () => get(STORAGE_KEYS.MAIN_NAVIGATIONS)
    const removeMainNavigations = () => remove(STORAGE_KEYS.MAIN_NAVIGATIONS)

    const saveLoginResult = (data) => {
        //saveAccessToken(data?.content?.accessToken) //open comment if not using HTTP ONLY COOKIE
        //saveRefreshToken(data?.content?.refreshToken) //open comment if not using HTTP ONLY COOKIE
        saveFirstName(data?.content?.firstName)
        saveLastName(data?.content?.lastName)
        saveEmail(data?.content?.email)
        saveUserId(data?.content?.userId)
        saveUserClaims(data?.content?.userClaims)
        saveMainNavigations(data?.content?.mainNavigations)
        saveIsAuthenticated(getUserId() != null)
    }

    return {
        saveAccessToken,
        getAccessToken,
        removeAccessToken,
        saveRefreshToken,
        getRefreshToken,
        removeRefreshToken,
        saveIsAuthenticated,
        getIsAuthenticated,
        removeIsAuthenticated,
        saveFirstName,
        getFirstName,
        removeFirstName,
        saveLastName,
        getLastName,
        removeLastName,
        saveEmail,
        getEmail,
        removeEmail,
        saveUserId,
        getUserId,
        removeUserId,
        saveUserClaims,
        getUserClaims,
        removeUserClaims,
        saveMainNavigations,
        getMainNavigations,
        removeMainNavigations,
        clearStorage,
        saveLoginResult
    }
}
