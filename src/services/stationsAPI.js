import axios from 'axios'

// 创建 axios 实例
const stationsApi = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
stationsApi.interceptors.request.use(
  config => {
    // 管理端 API 使用 adminToken，用户端 API 使用 userToken
    let token = null
    if (config.url.includes('/admin/')) {
      token = localStorage.getItem('adminToken')
    } else {
      token = localStorage.getItem('userToken')
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
stationsApi.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

/**
 * 获取服务网点列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认 1
 * @param {number} params.pageSize - 每页数量，默认 20
 * @param {string} params.type - 站点类型：'battery' | 'service' | 'all'
 * @param {number} params.latitude - 用户纬度（用于计算距离）
 * @param {number} params.longitude - 用户经度（用于计算距离）
 * @param {number} params.radius - 搜索半径（公里），默认 10
 * @returns {Promise<Array>} 站点列表
 */
export const getStationsListAPI = (params = {}) => {
  const defaultParams = {
    page: 1,
    pageSize: 20,
    type: 'all',
    radius: 10,
    ...params
  }
  
  return stationsApi.get('/stations', {
    params: defaultParams
  }).then(response => {
    // 响应格式：{ code: 200, message: 'success', data: { content: [...], total: 100, page: 1, pageSize: 20 } }
    if (response.data && response.data.data) {
      const responseData = response.data.data
      // 如果是分页对象，返回 content 数组
      if (responseData.content) {
        return responseData.content
      }
      // 如果直接是数组
      if (Array.isArray(responseData)) {
        return responseData
      }
    }
    return []
  })
}

/**
 * 获取服务网点详情
 * @param {string} stationId - 站点 ID
 * @returns {Promise<Object>} 站点详情
 */
export const getStationDetailAPI = (stationId) => {
  return stationsApi.get(`/stations/${stationId}`)
    .then(response => {
      // 响应格式：{ code: 200, message: 'success', data: {...} }
      return response.data
    })
}

/**
 * 搜索服务网点
 * @param {string} keyword - 搜索关键词
 * @param {number} params.latitude - 用户纬度
 * @param {number} params.longitude - 用户经度
 * @returns {Promise<Array>} 站点列表
 */
export const searchStationsAPI = (keyword, params = {}) => {
  return stationsApi.get('/stations/search', {
    params: {
      keyword,
      ...params
    }
  }).then(response => {
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        return response.data.data
      }
      if (response.data.data.content) {
        return response.data.data.content
      }
    }
    return []
  })
}

/**
 * 新增站点（管理员功能）
 * @param {Object} data - 站点数据
 * @param {string} data.name - 站点名称
 * @param {string} data.type - 站点类型：'battery' | 'service' | 'all'
 * @param {string} data.address - 地址
 * @param {number} data.latitude - 纬度
 * @param {number} data.longitude - 经度
 * @param {string} data.contactPhone - 联系电话
 * @param {string} data.manager - 管理者
 * @param {string} data.serviceTime - 服务时间
 * @param {number} data.availableBatteries - 可用电池数
 * @param {number} data.availableSlots - 空闲车位数
 * @param {string} data.status - 状态：'active' | 'online' | 'offline' | 'maintenance' | 'closed'
 * @returns {Promise<Object>} 创建结果
 */
export const createStationAPI = (data) => {
  return stationsApi.post('/admin/stations', data)
    .then(response => {
      return response.data
    })
}

/**
 * 更新站点（管理员功能）
 * @param {string} stationId - 站点 ID
 * @param {Object} data - 站点数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateStationAPI = (stationId, data) => {
  return stationsApi.put(`/admin/stations/${stationId}`, data)
    .then(response => {
      return response.data
    })
}

/**
 * 删除站点（管理员功能）
 * @param {string} stationId - 站点 ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteStationAPI = (stationId) => {
  return stationsApi.delete(`/admin/stations/${stationId}`)
    .then(response => {
      return response.data
    })
}

/**
 * 上传站点照片（管理员功能）
 * @param {string} stationId - 站点 ID
 * @param {File} file - 照片文件
 * @returns {Promise<Object>} 上传结果
 */
export const uploadStationPhotoAPI = (stationId, file) => {
  const formData = new FormData()
  formData.append('file', file)  // 使用 'file' 而不是 'photo'
  
  return stationsApi.post(`/admin/stations/${stationId}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    return response.data
  })
}

/**
 * 删除站点照片（管理员功能）
 * @param {string} stationId - 站点 ID
 * @param {string} photoId - 照片 ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteStationPhotoAPI = (stationId, photoId) => {
  return stationsApi.delete(`/admin/stations/${stationId}/photos/${photoId}`)
    .then(response => {
      return response.data
    })
}

/**
 * 获取站点照片列表
 * @param {string} stationId - 站点 ID
 * @returns {Promise<Array>} 照片列表
 */
export const getStationPhotosAPI = (stationId) => {
  return stationsApi.get(`/admin/stations/${stationId}/photos`)
    .then(response => {
      return response.data.data || []
    })
}

export default {
  getStationsListAPI,
  getStationDetailAPI,
  searchStationsAPI,
  createStationAPI,
  updateStationAPI,
  deleteStationAPI,
  getStationPhotosAPI,
  uploadStationPhotoAPI,
  deleteStationPhotoAPI
}
