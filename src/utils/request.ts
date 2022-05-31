import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store/index.ts'

const baseUrl = import.meta.env.VITE_APP_BASE_API as string
// 创建axios实例
const request = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 15000, // 请求超时时间
  headers: {
    Authorization: 'Basic c3R1ZGVudDpzdHVkZW50X3NlY3JldA==',
  },
})
// request请求拦截器
request.interceptors.request.use(
  (config: any) => {
    const { loginInfo } = useStore()
    ;(config.headers as any)['platform-auth'] = `bearer ${loginInfo.token}`
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
  (error: any) => error,
)

// 请求成功回调
async function successCallback(res: any) {
  const { data } = res
  if (data.code === 200) {
    return Promise.resolve(data.data)
  }
  if (Object.prototype.toString.apply(data) === '[object Blob]') {
    return Promise.resolve(data)
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
// respone返回拦截器
request.interceptors.response.use(successCallback, errorCallback)
export default request
