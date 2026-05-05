# CitySwap 智慧换电管理平台

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFC107?logo=pinia)](https://pinia.vuejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 📖 项目简介

**CitySwap 智慧换电管理平台**是一款面向城市电动出行领域的物联网监控系统，提供完整的电池 Swap 网络管理和车辆追踪解决方案。平台采用前后端分离架构，实现了从电池状态实时监控、智能换电推荐、车辆位置追踪到多格式报表生成的全链路功能。

系统支持**管理端**和**用户端**双重视角：
- **管理端**：提供全面的车辆与电池资产管理、数据报表导出功能
- **用户端**：专注于智能换电服务，通过实时电池健康监测和电量预测，为用户提供便捷的换电站点推荐

界面设计简洁现代，采用黑白配色方案，确保专业高效的视觉体验。

## ✨ 核心功能

### 管理端功能
- 📊 **系统概览**：实时数据统计、系统功能导航、快速操作入口
- 🚗 **车辆管理**：车辆列表、实时状态监控、位置追踪、数据刷新
- 🔋 **电池管理**：电池状态监控、健康度分析、批量操作
- 📍 **位置管理**：车辆位置查看、位置指令发送、轨迹追踪
- 📈 **数据报表**：多格式报表生成（CSV/Excel/PDF）、数据导出
- ⚙️ **系统设置**：通知配置、系统参数管理

### 用户端功能
- 🔋 **智能换电**：电池电量实时监控、换电推荐、附近站点查询
- 📊 **电池监控**：电压、温度、健康度等多维度数据展示
- 🚗 **我的车辆**：车辆绑定、状态查看、报警提醒
- 🔔 **通知设置**：系统通知、报警配置

## 🛠️ 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架，使用 Composition API
- **Vue Router 4** - 官方路由管理器
- **Pinia** - Vue 官方状态管理库

### UI 与样式
- 自定义组件库
- CSS3 (响应式布局)
- 现代化黑白配色设计
- 动画效果与过渡

### 数据可视化
- **ECharts** - 强大的数据可视化图表库
- 实时数据更新与动态渲染

### 数据导出
- **SheetJS/xlsx** - Excel 文件处理
- **jsPDF** - PDF 文档生成
- 原生 CSV 处理

### 网络通信
- **Axios** - HTTP 客户端
- **WebSocket** - 实时数据推送
- RESTful API 集成

### 开发工具
- **Vite 5** - 下一代前端构建工具
- JavaScript ES6+
- 模块化架构设计

## 📦 项目结构

```
city-battery-panel-2024/
├── public/                    # 静态资源
├── src/
│   ├── api/                   # API 接口定义
│   ├── assets/                # 资源文件 (图片、样式等)
│   ├── components/            # 公共组件
│   │   ├── VehiclePositionControl.vue   # 车辆位置控制组件
│   │   └── ...
│   ├── layout/                # 布局组件
│   │   ├── AdminLayout.vue    # 管理端布局
│   │   └── UserLayout.vue     # 用户端布局
│   ├── router/                # 路由配置
│   │   └── index.js
│   ├── services/              # 服务层
│   │   ├── adminUserDataService.js  # 管理端用户数据服务
│   │   └── ...
│   ├── store/                 # 状态管理
│   │   └── modules/
│   │       ├── batteryStore.js      # 电池状态管理
│   │       └── ...
│   ├── utils/                 # 工具函数
│   │   ├── exportUtils.js     # 数据导出工具
│   │   └── ...
│   ├── views/                 # 页面组件
│   │   ├── Dashboard.vue      # 系统概览
│   │   ├── Vehicles.vue       # 车辆管理
│   │   ├── Batteries.vue      # 电池管理
│   │   ├── SmartSwap.vue      # 智能换电
│   │   └── ...
│   ├── App.vue                # 根组件
│   └── main.js                # 入口文件
├── index.html                 # HTML 模板
├── package.json               # 项目依赖
├── vite.config.js             # Vite 配置
└── README.md                  # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🔌 API 接口

### 管理端 API
- `/api/admin/vehicles` - 车辆数据
- `/api/admin/user-batteries` - 用户电池数据
- `/api/admin/positions` - 位置数据
- `/api/admin/reports` - 报表数据

### 用户端 API
- `/api/user/vehicles` - 我的车辆
- `/api/user/batteries` - 我的电池
- `/api/user/stations` - 附近换电站

## 📸 界面预览

### 管理端
- 系统概览：实时数据统计、功能导航、快速操作
- 车辆管理：车辆列表、状态监控、位置追踪
- 电池管理：电池状态、健康度分析
- 数据报表：多格式导出

### 用户端
- 智能换电：电池监控、换电推荐
- 我的车辆：车辆状态、报警提醒

## 🎨 设计特色

- **黑白配色**：专业简洁的视觉效果
- **响应式布局**：适配不同屏幕尺寸
- **流畅动画**：提升用户体验
- **模块化设计**：易于维护和扩展

## 📊 核心模块说明

### 电池状态监控
实时监测电池电压、温度、电量、健康度等关键指标，支持异常状态预警。

### 智能换电推荐
基于电池电量和位置信息，智能推荐附近换电站点。

### 数据报表系统
支持 CSV、Excel、PDF 三种格式的数据导出，可生成车辆运营报表、电池状态报表、报警统计报表等。

### 实时位置追踪
集成地图服务，实时显示车辆位置和运动轨迹。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 👥 团队信息

本项目为 2024 CitySwap 智慧换电系统的前端实现。

---

**注意**：本项目为前端演示版本，部分功能需要配合后端 API 使用。
