import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import '@/assets/css/global.css'
// 引入字体图标
import '@/assets/font/iconfont.css'
// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://www.chenfuguo.cn:8899/api/private/v1'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 时间过滤器
import moment from 'moment';

Vue.filter('dateFormat', (str, partten = "YYYY-MM-DD HH:mm:ss") => {
  return moment(str).format(partten);
})
// 引入NProgress 进度条 的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// request拦截器
axios.interceptors.request.use(config => {
  // 发起请求时打开进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// response拦截器
axios.interceptors.response.use(config => {
  // 请求结束时关闭进度条
  NProgress.done()
  return config
})
Vue.prototype.$axios = axios
import treeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', treeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
