import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    mapData: null,
    vehiclePositions: {},
    chargingStations: [],
    selectedVehicle: null,
    recommendedRoute: null
  }),
  
  getters: {
    getMapGrid: (state) => {
      if (!state.mapData) return null
      return state.mapData.split('\n').map(row => row.split(' ').map(Number))
    },
    
    getChargingStations: (state) => {
      if (!state.mapData) return []
      const grid = this.getMapGrid
      const stations = []
      
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          if (grid[y][x] === 1) { // 1 表示换电站
            stations.push({ x: x + 1, y: y + 1 })
          }
        }
      }
      return stations
    },
    
    getVehiclePosition: (state) => (vid) => {
      return state.vehiclePositions[vid] || null
    }
  },
  
  actions: {
    async loadMapData(filePath) {
      try {
        const response = await fetch(filePath)
        const text = await response.text()
        this.mapData = text
        this.chargingStations = this.getChargingStations
      } catch (error) {
        console.error('加载地图数据失败:', error)
      }
    },
    
    setVehiclePosition(vid, position) {
      this.vehiclePositions[vid] = position
    },
    
    calculateShortestPath(start, end) {
      // 实现A*算法计算最短路径
      // 这里简化实现，实际需要根据地图障碍物计算
      return {
        path: [],
        distance: Math.abs(start.x - end.x) + Math.abs(start.y - end.y)
      }
    },
    
    findNearestChargingStation(position) {
      const stations = this.chargingStations
      if (stations.length === 0) return null
      
      let nearest = stations[0]
      let minDistance = this.calculateShortestPath(position, nearest).distance
      
      for (let i = 1; i < stations.length; i++) {
        const distance = this.calculateShortestPath(position, stations[i]).distance
        if (distance < minDistance) {
          minDistance = distance
          nearest = stations[i]
        }
      }
      
      return { station: nearest, distance: minDistance }
    }
  }
})