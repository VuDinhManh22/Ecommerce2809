/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { ref } from 'vue'
import { useStorageManager } from 'useStorageManager'

export function useAxios() {
    const isSubmitting = ref(false)
    const isRefreshing = ref(false)
    const failedQueue = []
    const { getAccessToken, getRefreshToken, saveLoginResult } = useStorageManager()

    const axiosInstance = axios.create({
        baseURL: '/api',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    const processQueue = (error, token = null) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error)
            } else {
                prom.resolve(token)
            }
        })
        failedQueue.length = 0
    }

    axiosInstance.interceptors.response.use(
        (response) => {
            try {
                const data = response.data
                const contentType = response.headers['content-type'] || ''
                if (contentType.includes('application/json') && data?.code !== 200) {
                    return Promise.reject(new Error(`${data?.code}. ${data?.message}. innerException: ${data?.error?.innerException || 'No inner exception'}`));
                }
            } catch (error) {
                return Promise.reject(error)
            }
            return response
        },
        (error) => {
            const originalRequest = error.config
            const refreshToken = getRefreshToken()

            if (error?.response?.status === 500) {
                return Promise.reject(error)
            }

            if (
                (error?.response?.status === 403 || error?.response?.status === 401) 
                && !originalRequest._retry 
            ) {
                //[401,403] have valid token, should try to refresh the token expired date
                if (isRefreshing.value) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject })
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token
                            return axiosInstance(originalRequest)
                        })
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                }

                originalRequest._retry = true
                isRefreshing.value = true
                return axiosInstance.post('/Account/RefreshAccessToken', { refreshToken })
                    .then((refreshResponse) => {
                        if (refreshResponse) {
                            const data = refreshResponse.data
                            saveLoginResult(data)
                            const accessToken = getAccessToken()
                            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
                            processQueue(null, accessToken)

                            return axiosInstance(originalRequest)

                        } else {
                            return Promise.reject(new Error(`${error?.code} ${error?.status} ${error?.response?.data?.message}`))
                        }
                    })
                    .catch((refreshError) => {
                        processQueue(refreshError, null)
                        return Promise.reject(refreshError)
                    })
                    .finally(() => {
                        isRefreshing.value = false
                    })
            }

            return Promise.reject(error)
        }
    )


    const request = async (method, url, data = {}, customHeaders = {}, responseType = 'json') => {
        isSubmitting.value = true
        const token = getAccessToken()
        
        try {
            const response = await axiosInstance({
                method,
                url,
                data,
                headers: {
                    ...axiosInstance.defaults.headers.common,
                    'Authorization': `Bearer ${token}`,
                    ...customHeaders 
                },
                responseType
            })
            return response
        } catch (error) {
            throw error
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        isSubmitting,
        request
    }
}
