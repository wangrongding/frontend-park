import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

const baseUrl = import.meta.env.VITE_APP_BASE_API as string
// 创建axios实例
const request = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 20 * 1000, // 请求超时时间
})

let loadingInstance: any
let loadingCount = 0
const addLoading = () => {
  // 增加loading 如果pending请求数量等于1，弹出loading, 防止重复弹出
  loadingCount += 1
  if (loadingCount === 1) {
    loadingInstance = ElLoading.service({
      target: document.querySelector('.main') as HTMLElement,
      lock: true,
      text: '加载中...',
      background: 'rgba(100, 175, 255, 0.3)',
    })
  }
}
const cancelLoading = () => {
  // 减少pending请求数量
  loadingCount -= 1
  if (loadingCount === 0) {
    loadingInstance.close()
  }
}
// request请求拦截器
request.interceptors.request.use(
  (config: any) => {
    const { loading } = config
    if (loading) {
      addLoading()
    }
    const { data = {}, method } = config
    // 将请求中值为undefined,null的过滤
    Object.keys(data).forEach((item) => {
      if (
        data[item] === undefined ||
        data[item] === null ||
        data[item] === 'null'
      ) {
        delete data[item]
      }
    })
    if (method === 'post') {
      config.data = data.data
    }
    // get请求转参数key为params
    if (method === 'get' || method === 'delete') {
      config.params = data
    }
    if (method === 'put') {
      config.data = { ...data.data }
    }
    return config
  },
  (error) => error,
)

// 请求成功回调
async function successCallback(res: any) {
  const { loading } = res.config
  if (loading) {
    cancelLoading()
  }
  const { data } = res
  if (data.code === 200) {
    return Promise.resolve(data.data)
  }
  if (Object.prototype.toString.apply(data) === '[object Blob]') {
    return Promise.resolve(res)
  }

  ElMessage({
    message: data.msg,
    grouping: true,
    type: 'error',
  })
  return Promise.reject(new Error(`${data.msg}(${data.code})`))
}

// 请求错误回调
function errorCallback(error: any) {
  const { loading } = error.config
  if (loading) {
    cancelLoading()
  }
  if (error.response.status === 401) {
    ElMessage({
      type: 'warning',
      message: '请重新登录！',
    })
  } else {
    ElMessage({
      message: error,
      grouping: true,
      type: 'error',
    })
  }
  return Promise.reject(error)
}
// response返回拦截器
request.interceptors.response.use(successCallback, errorCallback)
export default request
