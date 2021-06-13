import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
const api = axios.create({ baseURL: 'https://5f12d167d5e6c90016ee557e.mockapi.io/myapi/v1/bestSellers' })
Vue.prototype.$api = api
export { axios, api }
