/**
 * 高德地图配置工具类
 * 
 * 使用说明：
 * 1. 需要在高德开放平台申请 Key：https://lbs.amap.com/
 * 2. 创建 Web 端（JS API）类型的 Key
 * 3. 将安全密钥配置到此处
 */

// ==================== 配置区域 ====================
// TODO: 请替换为你自己申请的高德地图 Key
export const AMAP_CONFIG = {
  // 高德地图 Key（需要在高德开放平台申请）
  key: '5fb7e4ea217020851f30f04ef08dd9fb', // 示例：'182d3966e08f7d0f6b8f0b5f8f0b5f8f'
  
  // 安全密钥（2021 年 12 月 02 日升级之后获取的 key 必须配置安全密钥）
  securityCode: 'c5be1016aba27b4b039100e2caf17ba1', // 示例：'8d8f0b5f8f0b5f8f0b5f8f0b5f8f0b5f'
  
  // 地图初始配置
  mapOptions: {
    center: [116.397428, 39.90923], // 北京市中心
    zoom: 11, // 初始缩放级别（3-19）
    mapStyle: 'amap://styles/normal', // 地图样式
    features: ['bg', 'road', 'building', 'point'], // 显示的元素
    expandZoomRange: true, // 允许缩放至 20 级
    zooms: [3, 20] // 缩放级别范围
  }
}

// ==================== 工具函数 ====================

/**
 * 加载高德地图
 * @returns {Promise<AMap.Map>} 地图实例
 */
export const loadAmap = () => {
  return new Promise((resolve, reject) => {
    // 检查 AMap 是否已加载
    if (window.AMap) {
      resolve(window.AMap)
      return
    }
    
    // 等待地图加载
    const checkAmapLoaded = () => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        // 继续等待
        setTimeout(checkAmapLoaded, 100)
      }
    }
    
    // 设置超时（15 秒）
    setTimeout(() => {
      if (!window.AMap) {
        const error = new Error('高德地图加载超时，请检查：\n1. 网络连接是否正常\n2. Key 和安全密钥是否正确\n3. Key 的白名单设置')
        console.error(error)
        console.error('当前 Key:', AMAP_CONFIG.key)
        console.error('当前安全密钥:', AMAP_CONFIG.securityCode)
        reject(error)
      }
    }, 15000)
    
    // 开始检查
    setTimeout(checkAmapLoaded, 100)
  })
}

/**
 * 创建地图实例
 * @param {string} container - 地图容器 ID 或 DOM 元素
 * @param {Object} options - 可选配置项
 * @returns {Promise<AMap.Map>} 地图实例
 */
export const createMap = async (container, options = {}) => {
  try {
    const AMap = await loadAmap()
    
    // 确保容器存在
    const containerElement = typeof container === 'string' 
      ? document.getElementById(container) 
      : container
    
    if (!containerElement) {
      throw new Error(`地图容器不存在：${container}`)
    }
    
    // 确保容器有高度
    const computedStyle = window.getComputedStyle(containerElement)
    if (computedStyle.height === '0px' || computedStyle.height === 'auto') {
      console.warn('地图容器高度可能为 0，请设置明确的高度')
    }
    
    const mapOptions = {
      ...AMAP_CONFIG.mapOptions,
      ...options,
      container: containerElement
    }
    
    console.log('开始创建地图，容器:', containerElement)
    console.log('地图配置:', mapOptions)
    
    const map = new AMap.Map(mapOptions)
    
    console.log('地图创建成功:', map)
    
    // 添加缩放控件
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.Zoom())
    
    return map
  } catch (error) {
    console.error('创建地图失败:', error)
    throw error
  }
}

/**
 * 创建标记点
 * @param {AMap.Map} map - 地图实例
 * @param {Array<number>} position - 经纬度 [lng, lat]
 * @param {Object} options - 配置项
 * @returns {AMap.Marker} 标记实例
 */
export const createMarker = (map, position, options = {}) => {
  const marker = new window.AMap.Marker({
    position: position,
    map: map,
    title: options.title || '',
    label: options.label ? {
      content: options.label,
      direction: 'top',
      offset: new window.AMap.Pixel(0, -5)
    } : undefined,
    icon: options.icon || undefined,
    ...options
  })
  
  return marker
}

/**
 * 创建信息窗体
 * @param {AMap.Map} map - 地图实例
 * @param {Array<number>} position - 经纬度
 * @param {string} content - 内容
 * @returns {AMap.InfoWindow} 信息窗体实例
 */
export const createInfoWindow = (map, position, content) => {
  const infoWindow = new window.AMap.InfoWindow({
    content: content,
    position: position,
    offset: new window.AMap.Pixel(0, -10)
  })
  
  infoWindow.open(map)
  return infoWindow
}

/**
 * 批量创建标记点
 * @param {AMap.Map} map - 地图实例
 * @param {Array} markers - 标记点数组 [{position: [lng, lat], title: '标题', ...}]
 * @returns {Array<AMap.Marker>} 标记点实例数组
 */
export const createMarkers = (map, markers) => {
  return markers.map(item => {
    return createMarker(map, item.position, item)
  })
}

/**
 * 清除所有标记
 * @param {AMap.Map} map - 地图实例
 * @param {Array<AMap.Marker>} markers - 标记数组
 */
export const clearMarkers = (map, markers) => {
  if (markers && markers.length > 0) {
    markers.forEach(marker => {
      marker.setMap(null)
    })
  }
}

/**
 * 地图中心点移动到指定位置
 * @param {AMap.Map} map - 地图实例
 * @param {Array<number>} position - 经纬度
 * @param {number} zoom - 缩放级别（可选）
 */
export const panTo = (map, position, zoom) => {
  map.panTo(position)
  if (zoom !== undefined) {
    map.setZoom(zoom)
  }
}

/**
 * 获取两点间距离（米）
 * @param {Array<number>} from - 起点 [lng, lat]
 * @param {Array<number>} to - 终点 [lng, lat]
 * @returns {number} 距离（米）
 */
export const getDistance = (from, to) => {
  return window.AMap.GeometryUtil.distance(from, to)
}

/**
 * 路径规划（驾车路线）
 * @param {Array<number>} from - 起点 [lng, lat]
 * @param {Array<number>} to - 终点 [lng, lat]
 * @returns {Promise<Array>} 路线坐标点数组
 */
export const drivingRoute = async (from, to) => {
  return new Promise((resolve, reject) => {
    const driving = new window.AMap.Driving({
      map: null,
      panel: null,
      policy: window.AMap.DrivingPolicy.LEAST_TIME
    })
    
    driving.search(from, to, (status, result) => {
      if (status === 'complete' && result.routes && result.routes.length > 0) {
        const route = result.routes[0]
        const path = route.paths[0].steps.reduce((acc, step) => {
          return acc.concat(step.path)
        }, [])
        resolve(path)
      } else {
        reject(new Error('路径规划失败'))
      }
    })
  })
}

/**
 * 地理编码（地址转坐标）
 * @param {string} address - 地址
 * @returns {Promise<Array<number>>} 经纬度 [lng, lat]
 */
export const geocode = async (address) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.AMap.Geocoder()
    
    geocoder.getLocation(address, (status, result) => {
      if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
        const location = result.geocodes[0].location
        resolve([location.lng, location.lat])
      } else {
        reject(new Error('地理编码失败'))
      }
    })
  })
}

/**
 * 逆地理编码（坐标转地址）
 * @param {Array<number>} position - 经纬度 [lng, lat]
 * @returns {Promise<string>} 地址
 */
export const reverseGeocode = async (position) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.AMap.Geocoder()
    
    geocoder.getAddress(position, (status, result) => {
      if (status === 'complete' && result.regeocode) {
        resolve(result.regeocode.formattedAddress)
      } else {
        reject(new Error('逆地理编码失败'))
      }
    })
  })
}

export default {
  AMAP_CONFIG,
  loadAmap,
  createMap,
  createMarker,
  createInfoWindow,
  createMarkers,
  clearMarkers,
  panTo,
  getDistance,
  drivingRoute,
  geocode,
  reverseGeocode
}
