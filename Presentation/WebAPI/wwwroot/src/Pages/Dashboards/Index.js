/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, reactive, ref, onMounted, nextTick } from 'vue'
import { useAccessManager } from 'useAccessManager'
import { useAxios } from 'useAxios'
import indoloading from 'indoloading'

const app = createApp({
    components: {
        indoloading
    },
    setup() {
        const { checkPageAccess } = useAccessManager()
        const { request } = useAxios()
        const vendorContacts = ref([])
        const customerContacts = ref([])
        const vendors = ref([])
        const customers = ref([])
        const pageLoading = ref(true)
        const barChartVendor = ref(null)
        const barChartCustomer = ref(null)
        const pieChart = ref(null)
        const ringChart = ref(null)
        const gaugeChartVendor = ref(null)
        const gaugeChartCustomer = ref(null)


        const drawBarChartCustomer = async () => {
            const myChart = echarts.init(barChartCustomer.value)

            const colors = [
                '#c23531',
                '#2f4554',
                '#61a0a8',
                '#d48265',
                '#91c7ae',
                '#ca8622',
                '#e7bcf1',
                '#b6e0f2',
                '#ff7f50',
                '#f3a243',
                '#6be6c1',
                '#ffb980',
                '#d14a61',
                '#f3e3c6',
                '#2c3e50',
                '#95a5a6'
            ]

            const seriesData = customers.value.map((customer, index) => {
                const count = customerContacts.value.filter(contact => contact.customerName === customer).length
                return {
                    value: count,
                    itemStyle: {
                        color: colors[index % colors.length] 
                    }
                }
            })

            const option = {
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: customers.value,
                    axisLabel: {
                        rotate: 45, 
                        interval: 0 
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Contacts',
                        type: 'bar',
                        data: seriesData
                    }
                ]
            }
            myChart.setOption(option)
        }
        const drawBarChartVendor = async () => {
            const myChart = echarts.init(barChartVendor.value)

            const colors = [
                '#c23531',
                '#2f4554',
                '#61a0a8',
                '#d48265',
                '#91c7ae',
                '#ca8622',
                '#e7bcf1',
                '#b6e0f2',
                '#ff7f50',
                '#f3a243',
                '#6be6c1',
                '#ffb980',
                '#d14a61',
                '#f3e3c6',
                '#2c3e50',
                '#95a5a6'
            ]

            const seriesData = vendors.value.map((vendor, index) => {
                const count = vendorContacts.value.filter(contact => contact.vendorName === vendor).length
                return {
                    value: count,
                    itemStyle: {
                        color: colors[index % colors.length]
                    }
                }
            })

            const option = {
                tooltip: {},
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: vendors.value,
                    axisLabel: {
                        rotate: 45,
                        interval: 0
                    }
                },
                series: [
                    {
                        name: 'Contacts',
                        type: 'bar',
                        data: seriesData
                    }
                ]
            }
            myChart.setOption(option)
        }
        const drawPieChart = async () => {
            const myChart = echarts.init(pieChart.value)

            const customerContactCounts = customerContacts.value.reduce((acc, contact) => {
                const customerName = contact.customerName
                if (acc[customerName]) {
                    acc[customerName] += 1
                } else {
                    acc[customerName] = 1
                }
                return acc
            }, {})

            const pieData = Object.keys(customerContactCounts).map(customerName => {
                return {
                    value: customerContactCounts[customerName],
                    name: customerName
                }
            })

            const option = {
                series: [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        data: pieData
                    }
                ]
            }
            myChart.setOption(option)
        }
        const drawRingChart = async () => {
            const myChart = echarts.init(ringChart.value)


            const vendorContactCounts = vendorContacts.value.reduce((acc, contact) => {
                const vendorName = contact.vendorName
                if (acc[vendorName]) {
                    acc[vendorName] += 1
                } else {
                    acc[vendorName] = 1
                }
                return acc
            }, {})

            const pieData = Object.keys(vendorContactCounts).map(vendorName => {
                return {
                    value: vendorContactCounts[vendorName],
                    name: vendorName
                }
            })

            const option = {
                series: [
                    {
                        type: 'pie',
                        data: pieData,
                        radius: ['40%', '70%']
                    }
                ]
            }
            myChart.setOption(option)
        }
        const drawGaugeChartVendor = async () => {
            const myChart = echarts.init(gaugeChartVendor.value)

            const totalVendorContacts = vendorContacts.value.length
            const totalCustomerContacts = customerContacts.value.length
            const totalContacts = totalVendorContacts + totalCustomerContacts

            const vendorPercentage = totalContacts > 0 ? (totalVendorContacts / totalContacts) * 100 : 0

            const option = {
                tooltip: {
                    formatter: '{a} <br/>{b}: {c}%'
                },
                series: [
                    {
                        name: 'Performance',
                        type: 'gauge',
                        detail: { show: false },
                        data: [{ value: parseFloat(vendorPercentage.toFixed(2)), name: null }]
                    }
                ]
            }
            myChart.setOption(option)
        }

        const drawGaugeChartCustomer = async () => {
            const myChart = echarts.init(gaugeChartCustomer.value)

            const totalVendorContacts = vendorContacts.value.length
            const totalCustomerContacts = customerContacts.value.length
            const totalContacts = totalVendorContacts + totalCustomerContacts

            const customerPercentage = totalContacts > 0 ? (totalCustomerContacts / totalContacts) * 100 : 0

            const option = {
                tooltip: {
                    formatter: '{a} <br/>{b}: {c}%'
                },
                series: [
                    {
                        name: 'Performance',
                        type: 'gauge',
                        detail: { show: false },
                        data: [{ value: parseFloat(customerPercentage.toFixed(2)), name: null }]
                    }
                ]
            }
            myChart.setOption(option)
        }


        onMounted(async () => {
            await checkPageAccess()
            setTimeout(async () => {
                try {
                    const response = await request('get', '/Dashboard/GetDashboardMain', {})

                    if (response) {
                        customerContacts.value = response?.data?.content?.data?.customerContacts ?? []
                        vendorContacts.value = response?.data?.content?.data?.vendorContacts ?? []

                        customers.value = Array.from(new Set(customerContacts.value.filter(item => item?.customerName).map(item => item.customerName)))
                        vendors.value = Array.from(new Set(vendorContacts.value.filter(item => item?.vendorName).map(item => item.vendorName)))
                    }
                } catch (error) {
                    console.error('Error during API call:', error);
                } finally {
                    pageLoading.value = false

                    await nextTick()
                    await drawBarChartCustomer()
                    await drawBarChartVendor()
                    await drawPieChart()
                    await drawRingChart()
                    await drawGaugeChartVendor()
                    await drawGaugeChartCustomer()
                }
            }, 1000)

        })
        return {
            pageLoading,
            vendorContacts,
            customerContacts,
            vendors,
            customers,
            barChartVendor,
            barChartCustomer,
            pieChart,
            ringChart,
            gaugeChartVendor,
            gaugeChartCustomer
        }
    }
})


app.config.errorHandler = (err, instance, info) => {
    console.error('Error:', err)
    Swal.fire({
        title: 'Error!',
        text: `Error: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
    })
}
app.mount('#app')