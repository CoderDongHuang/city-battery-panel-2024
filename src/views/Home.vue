<template>
  <div class="home">
      <!-- 轮播图区域 - 全屏高度 -->
      <div class="carousel-section" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
        <div class="carousel">
          <div 
            v-for="(slide, index) in carouselSlides" 
            :key="index"
            class="carousel-slide"
            :class="{ active: currentSlide === index }"
            @click="openCarouselNews(slide)"
          >
            <div class="slide-content" v-if="!slide.isPureImage">
              <h1>{{ slide.title }}</h1>
              <p>{{ slide.subtitle }}</p>
            </div>
            <div class="slide-bg">
              <div class="image-overlay" :class="{ 'pure-image-overlay': slide.isPureImage }"></div>
              <img :src="slide.image" :alt="slide.title || '轮播图'" class="slide-image" />
            </div>
          </div>
        </div>
        
        <!-- 轮播图指示器 -->
        <div class="carousel-indicators">
          <span 
            v-for="(slide, index) in carouselSlides" 
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
        
        <!-- 向下箭头 - 放在轮播图内部 -->
        <div class="scroll-arrow" @click="scrollToContent" v-show="showArrow">
          <svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 5L15 15L25 5"/>
            <path d="M5 1L15 11L25 1" opacity="0.5"/>
          </svg>
        </div>
      </div>

      <!-- 行业要闻 - 网格布局（参考北大要闻设计） -->
      <div class="industry-news-section">
        <div class="section-container">
          <h2 class="section-title">行业要闻</h2>
          <p class="section-subtitle">实时获取最新行业资讯，把握行业脉搏</p>
          
          <div class="news-grid-layout">
            <!-- 左上：重点新闻 1（大图） -->
            <div class="featured-news-card large" v-if="industryNews.length > 0" @click="openNews(industryNews[0])">
                <div class="news-image-wrapper">
                  <img :src="industryNews[0].image || 'https://picsum.photos/600/400?random=1'" :alt="industryNews[0].title" class="news-image" />
                </div>
              <div class="news-overlay">
                <h3 class="news-title">{{ industryNews[0].title }}</h3>
                <p class="news-summary">{{ industryNews[0].summary }}</p>
                <div class="news-meta">
                  <span class="news-source">{{ industryNews[0].source }}</span>
                  <span class="news-time">{{ formatTime(industryNews[0].time) }}</span>
                </div>
              </div>
            </div>
            
            <!-- 右上：4 个小卡片（2x2） -->
            <div class="top-right-grid">
              <div class="news-card-item" v-for="(news, index) in industryNews.slice(1, 5)" :key="index" @click="openNews(news)">
                <div class="news-card-content">
                  <h4 class="news-card-title">{{ news.title }}</h4>
                  <div class="news-card-meta">
                    <span class="news-source">{{ news.source }}</span>
                    <span class="news-time">{{ formatTime(news.time) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 左下：4 个小卡片（2x2） -->
            <div class="bottom-left-grid">
              <div class="news-card-item" v-for="(news, index) in industryNews.slice(5, 9)" :key="index" @click="openNews(news)">
                <div class="news-card-content">
                  <h4 class="news-card-title">{{ news.title }}</h4>
                  <div class="news-card-meta">
                    <span class="news-source">{{ news.source }}</span>
                    <span class="news-time">{{ formatTime(news.time) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右下：重点新闻 2（大图） -->
              <div class="featured-news-card large" v-if="industryNews.length > 9" @click="openNews(industryNews[9])">
                <div class="news-image-wrapper">
                  <img :src="industryNews[9].image || 'https://picsum.photos/600/400?random=2'" :alt="industryNews[9].title" class="news-image" />
                </div>
              <div class="news-overlay">
                <h3 class="news-title">{{ industryNews[9].title }}</h3>
                <p class="news-summary">{{ industryNews[9].summary }}</p>
                <div class="news-meta">
                  <span class="news-source">{{ industryNews[9].source }}</span>
                  <span class="news-time">{{ formatTime(industryNews[9].time) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="loading-news" v-if="loading">
            <div class="spinner"></div>
            <p>正在加载最新行业资讯...</p>
          </div>
        </div>
      </div>

      <!-- 数据统计与核心功能 -->
      <div class="data-features-section">
        <div class="two-column-layout">
          <!-- 左侧：系统数据 -->
          <div class="left-column">
            <h2 class="column-title">系统数据</h2>
            <div class="stats-summary-grid">
              <div class="stat-summary-card">
                <div class="stat-number">1000+</div>
                <div class="stat-label">注册用户</div>
              </div>
              <div class="stat-summary-card">
                <div class="stat-number">5000+</div>
                <div class="stat-label">在线设备</div>
              </div>
              <div class="stat-summary-card">
                <div class="stat-number">100+</div>
                <div class="stat-label">换电站点</div>
              </div>
              <div class="stat-summary-card">
                <div class="stat-number">99.9%</div>
                <div class="stat-label">服务可用性</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧：核心功能 -->
          <div class="right-column">
            <h2 class="column-title">核心功能</h2>
            <div class="features-list">
              <div class="feature-item-1">
                <div class="feature-icon-wrapper">🗺️</div>
                <div class="feature-content">
                  <h3>换电地图</h3>
                  <p>实时显示附近换电站点</p>
                </div>
              </div>
              <div class="feature-item-2">
                <div class="feature-icon-wrapper">📱</div>
                <div class="feature-content">
                  <h3>移动管理</h3>
                  <p>随时随地管理设备</p>
                </div>
              </div>
              <div class="feature-item-3">
                <div class="feature-icon-wrapper">🔔</div>
                <div class="feature-content">
                  <h3>智能报警</h3>
                  <p>异常实时推送</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA 区域 -->
      <div class="cta-section">
        <div class="section-container">
          <h2 class="section-title">准备好开始使用了吗？</h2>
          <p class="section-subtitle">立即登录控制台，管理您的设备和电池</p>
          <div class="cta-buttons">
            <button class="cta-btn primary" @click="goToDashboard">进入控制台</button>
            <button class="cta-btn secondary" @click="goToGuide">查看使用指南</button>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <SiteFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()
const showArrow = ref(true) // 控制箭头显示

// 轮播图数据
const carouselSlides = ref([])
const currentSlide = ref(0)
const carouselAutoPlayTimer = ref(null)

// 行业要闻数据
const industryNews = ref([])
const loading = ref(false)
const API_KEY = 'your_aggregate_data_api_key' // 替换为你的聚合数据 API key

// 获取行业要闻数据（使用聚合数据 API）
const fetchIndustryNews = async () => {
  loading.value = true
  try {
    // 从环境变量获取 API Key（.env.local 中配置，不提交到 Git）
    const API_KEY = import.meta.env.VITE_JUHE_API_KEY
    
    if (!API_KEY) {
      console.warn('未配置 VITE_JUHE_API_KEY，请检查 .env.local 文件')
      useMockData()
      return
    }
    
    // 与电车/换电相关的关键词
    const relevantKeywords = [
      '新能源', '电动', '换电', '电池', '充电', '锂电',
      '智能驾驶', '自动驾驶', '车联网', '氢能', '储能',
      '电车', 'EV', 'BEV', 'PHEV', '续航', 'BMS'
    ]
    
    // 判断新闻是否相关
    const isRelevant = (news) => {
      const text = (news.title + ' ' + (news.description || '')).toLowerCase()
      return relevantKeywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      )
    }
    
    console.log('正在调用 API 获取汽车和科技新闻...')
    const [autoResponse, techResponse] = await Promise.all([
      fetch(`/api/toutiao/index?type=auto&key=${API_KEY}`),
      fetch(`/api/toutiao/index?type=keji&key=${API_KEY}`)
    ])
    
    const autoData = await autoResponse.json()
    const techData = await techResponse.json()
    
    console.log('汽车新闻数据:', autoData)
    console.log('科技新闻数据:', techData)
    
    // 合并并筛选相关新闻
    let allNews = []
    let relevantCount = 0
    
    if (autoData.error_code === 0 && techData.error_code === 0) {
      // 两类新闻都获取成功，先筛选相关新闻
      const autoNews = autoData.result.data.filter(isRelevant)
      const techNews = techData.result.data.filter(isRelevant)
      
      console.log(`筛选后：${autoNews.length} 条汽车新闻 + ${techNews.length} 条科技新闻`)
      
      // 优先显示汽车新闻，不足则用科技新闻补充
      allNews = [...autoNews, ...techNews]
      
      // 如果相关新闻不足 10 条，补充一些普通新闻
      if (allNews.length < 10) {
        const remaining = 10 - allNews.length
        const autoRemaining = autoData.result.data.filter(n => !isRelevant(n)).slice(0, Math.ceil(remaining / 2))
        const techRemaining = techData.result.data.filter(n => !isRelevant(n)).slice(0, Math.floor(remaining / 2))
        allNews = [...allNews, ...autoRemaining, ...techRemaining]
        console.log(`相关新闻不足，补充了 ${autoRemaining.length + techRemaining.length} 条普通新闻`)
      }
      
      allNews = allNews.slice(0, 10)
      relevantCount = allNews.filter(isRelevant).length
      console.log(`最终：${allNews.length} 条新闻（${relevantCount} 条相关）`)
      
    } else if (autoData.error_code === 0) {
      // 只有汽车新闻成功
      allNews = autoData.result.data.slice(0, 10)
      relevantCount = allNews.filter(isRelevant).length
      console.log(`仅汽车新闻成功：${allNews.length} 条（${relevantCount} 条相关）`)
    } else if (techData.error_code === 0) {
      // 只有科技新闻成功
      allNews = techData.result.data.slice(0, 10)
      relevantCount = allNews.filter(isRelevant).length
      console.log(`仅科技新闻成功：${allNews.length} 条（${relevantCount} 条相关）`)
    } else {
      console.error('两类新闻都获取失败')
      useMockData()
      return
    }
    
    // 格式化新闻数据
    industryNews.value = allNews.map(item => ({
      title: item.title,
      summary: item.description || item.title,
      image: item.thumbnail_pic_s || item.thumbnail_pic || 'https://picsum.photos/600/400?random=' + Math.random(),
      source: item.author_name || '未知来源',
      time: new Date(item.date).getTime(),
      url: item.url
    }))
    
    console.log('格式化后的新闻数据:', industryNews.value)
    console.log(`显示：${relevantCount}/10 条相关新闻`)
  } catch (error) {
    console.error('获取行业要闻失败:', error)
    useMockData()
  } finally {
    loading.value = false
  }
}

// 使用模拟数据（备用方案）
const useMockData = () => {
  industryNews.value = [
    {
      title: '新能源换电模式迎来政策利好，多地出台支持政策',
      summary: '近日，国家发改委、能源局等多部门出台政策支持新能源汽车换电模式发展...',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=400&fit=crop',
      source: '新华网',
      time: new Date().getTime() - 3600000,
      url: ''
    },
    {
      title: '宁德时代发布新一代换电电池，续航提升 30%',
      summary: '宁德时代正式发布新一代换电电池产品...',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=100&fit=crop',
      source: '36 氪',
      time: new Date().getTime() - 7200000,
      url: ''
    },
    {
      title: 'CitySwap 完成 B 轮融资，加速全国换电网络布局',
      summary: 'CitySwap 宣布完成数亿元 B 轮融资...',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&h=100&fit=crop',
      source: '投资界',
      time: new Date().getTime() - 14400000,
      url: ''
    },
    {
      title: '电池回收行业迎来新机遇，市场规模将破千亿',
      summary: '随着新能源汽车保有量增加...',
      image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=150&h=100&fit=crop',
      source: '财经网',
      time: new Date().getTime() - 28800000,
      url: ''
    },
    {
      title: '智能换电技术标准正式发布，行业规范化发展',
      summary: '中国电池产业联盟正式发布...',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=100&fit=crop',
      source: '科技日报',
      time: new Date().getTime() - 43200000,
      url: ''
    },
    {
      title: '换电站建设提速，2024 年有望突破 3 万座',
      summary: '据行业统计，截至 2023 年底...',
      image: 'https://images.unsplash.com/photo-1574689049597-7e6df3e2b024?w=150&h=100&fit=crop',
      source: '人民日报',
      time: new Date().getTime() - 86400000,
      url: ''
    },
    {
      title: '新能源汽车下乡活动启动，换电模式受青睐',
      summary: '2024 年新能源汽车下乡活动正式启动...',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=150&h=100&fit=crop',
      source: '新华网',
      time: new Date().getTime() - 172800000,
      url: ''
    },
    {
      title: '换电 vs 充电，技术路线之争何时休',
      summary: '新能源汽车补能方式之争持续...',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=100&fit=crop',
      source: '汽车之家',
      time: new Date().getTime() - 259200000,
      url: ''
    },
    {
      title: '电池银行模式兴起，用户购车成本降低',
      summary: '电池银行模式让车电分离...',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&h=100&fit=crop',
      source: '经济日报',
      time: new Date().getTime() - 345600000,
      url: ''
    },
    {
      title: '2024 中国换电产业大会召开，共商发展大计',
      summary: '第三届中国换电产业大会在北京召开...',
      image: 'https://images.unsplash.com/photo-1574689049597-7e6df3e2b024?w=600&h=400&fit=crop',
      source: '人民网',
      time: new Date().getTime() - 432000000,
      url: ''
    }
  ]
}

// 格式化时间显示
const formatTime = (timestamp) => {
  const now = new Date().getTime()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

// 打开新闻链接
const openNews = (news) => {
  if (news.url) {
    window.open(news.url, '_blank')
  }
}

// 打开轮播图新闻链接
const openCarouselNews = (slide) => {
  if (slide.url) {
    window.open(slide.url, '_blank')
  }
}

// 定时更新：每小时更新一次
let newsUpdateInterval = null

// ========== 轮播图相关函数 ==========

// 获取轮播图数据（使用聚合数据 API，与行业要闻相同）
const fetchCarouselSlides = async () => {
  try {
    // 从环境变量获取 API Key（.env.local 中配置，不提交到 Git）
    const API_KEY = import.meta.env.VITE_JUHE_API_KEY
    
    if (!API_KEY) {
      console.warn('未配置 VITE_JUHE_API_KEY，请检查 .env.local 文件')
      useMockCarouselData()
      return
    }
    
    console.log('正在调用 API 获取汽车新闻...')
    const autoResponse = await fetch(`/api/toutiao/index?type=auto&key=${API_KEY}`)
    const autoData = await autoResponse.json()
    
    console.log('汽车新闻数据:', autoData)
    
    if (!autoData || !autoData.result || !autoData.result.data) {
      throw new Error('API 返回数据格式错误')
    }
    
    const allNews = autoData.result.data
    
    // 筛选与新能源/换电相关的新闻
    const relevantKeywords = [
      '新能源', '电动', '换电', '电池', '充电', '锂电',
      '智能驾驶', '自动驾驶', '车联网', '氢能', '储能',
      '电车', 'EV', 'BEV', 'PHEV', '续航', 'BMS'
    ]
    
    const isRelevant = (news) => {
      const text = (news.title + ' ' + (news.description || '')).toLowerCase()
      return relevantKeywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      )
    }
    
    const filteredNews = allNews.filter(isRelevant)
    
    console.log(`筛选出 ${filteredNews.length} 条相关新闻`)
    
    // 取前 4 条相关新闻
    const selectedNews = filteredNews.slice(0, 4)
    
    // 如果相关新闻不足 4 条，用普通汽车新闻补充
    if (selectedNews.length < 4) {
      const remaining = 4 - selectedNews.length
      const additional = allNews
        .filter(n => !selectedNews.includes(n))
        .slice(0, remaining)
      selectedNews.push(...additional)
      console.log(`补充了 ${additional.length} 条普通新闻`)
    }
    
    // 构建轮播图数组：3 张本地图片 + 4 篇新闻文章 = 7 个（间隔排列）
    const localImages = [
      {
        title: '',
        subtitle: '',
        image: '/images/1.jpg',
        url: '',
        isPureImage: true  // 标记为纯图片
      },
      {
        title: '',
        subtitle: '',
        image: '/images/623.jpg',
        url: '',
        isPureImage: true
      },
      {
        title: '',
        subtitle: '',
        image: '/images/2.png',
        url: '',
        isPureImage: true
      }
    ]
    
    // 格式化为轮播图数据（直接使用文章原标题和摘要）
    const newsSlides = selectedNews.map((news, index) => ({
      title: news.title,
      subtitle: news.description || news.title,
      image: news.thumbnail_pic_s || news.thumbnail_pic || `https://picsum.photos/1920/1080?random=${index}`,
      url: news.url,
      isPureImage: false  // 标记为新闻文章
    }))
    
    // 间隔排列：图片 - 新闻 - 图片 - 新闻 - 图片 - 新闻 - 新闻
    carouselSlides.value = []
    const maxCount = Math.max(localImages.length, newsSlides.length)
    
    for (let i = 0; i < maxCount; i++) {
      if (i < localImages.length) {
        carouselSlides.value.push(localImages[i])
      }
      if (i < newsSlides.length) {
        carouselSlides.value.push(newsSlides[i])
      }
    }
    
    console.log('轮播图数据加载成功:', carouselSlides.value.length, '条 (间隔排列：图片 - 新闻 - 图片 - 新闻...)')
  } catch (error) {
    console.error('获取轮播图数据失败，使用模拟数据:', error)
    useMockCarouselData()
  }
}

// 使用模拟轮播图数据（包含本地图片）
const useMockCarouselData = () => {
  // 3 张本地纯图片
  const localImages = [
    {
      title: '',
      subtitle: '',
      image: '/images/1.jpg',
      url: '',
      isPureImage: true
    },
    {
      title: '',
      subtitle: '',
      image: '/images/623.jpg',
      url: '',
      isPureImage: true
    },
    {
      title: '',
      subtitle: '',
      image: '/images/2.png',
      url: '',
      isPureImage: true
    }
  ]
  
  // 4 篇模拟新闻
  const mockNews = [
    {
      title: '新能源换电模式迎来政策利好',
      subtitle: '多地出台支持政策，加速换电网络布局',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&h=1080&fit=crop',
      url: '',
      isPureImage: false
    },
    {
      title: '宁德时代发布新一代换电电池',
      subtitle: '续航提升 30%，充电效率大幅提升',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1920&h=1080&fit=crop',
      url: '',
      isPureImage: false
    },
    {
      title: 'CitySwap 完成 B 轮融资',
      subtitle: '加速全国换电网络布局，覆盖 100+ 城市',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop',
      url: '',
      isPureImage: false
    },
    {
      title: '智能换电技术标准正式发布',
      subtitle: '行业规范化发展，推动技术创新',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
      url: '',
      isPureImage: false
    }
  ]
  
  // 间隔排列：图片 - 新闻 - 图片 - 新闻 - 图片 - 新闻 - 新闻
  carouselSlides.value = []
  const maxCount = Math.max(localImages.length, mockNews.length)
  
  for (let i = 0; i < maxCount; i++) {
    if (i < localImages.length) {
      carouselSlides.value.push(localImages[i])
    }
    if (i < mockNews.length) {
      carouselSlides.value.push(mockNews[i])
    }
  }
  
  console.log('使用模拟轮播图数据:', carouselSlides.value.length, '条 (间隔排列：图片 - 新闻 - 图片 - 新闻...)')
}

// 切换到指定轮播
const goToSlide = (index) => {
  currentSlide.value = index
}

// 下一张轮播
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length
}

// 启动自动播放
const startAutoPlay = () => {
  if (carouselAutoPlayTimer.value) {
    clearInterval(carouselAutoPlayTimer.value)
  }
  carouselAutoPlayTimer.value = setInterval(() => {
    nextSlide()
  }, 5000) // 5 秒切换一次
}

// 停止自动播放
const stopAutoPlay = () => {
  if (carouselAutoPlayTimer.value) {
    clearInterval(carouselAutoPlayTimer.value)
    carouselAutoPlayTimer.value = null
  }
}

// ========== 导航函数 ==========

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToGuide = () => {
  router.push('/guide')
}

// 滚动到内容区域（使用平滑滚动）
const scrollToContent = () => {
  console.log('=== 点击箭头 ===')
  console.log('当前 showArrow:', showArrow.value)
  
  // 目标改为行业要闻区域
  const targetSection = document.querySelector('.industry-news-section')
  console.log('找到 industry-news-section:', !!targetSection)
  
  if (targetSection) {
    const navHeight = 80 // 导航栏高度
    const targetPosition = targetSection.offsetTop - navHeight
    
    console.log('目标滚动位置:', targetPosition)
    console.log('当前滚动位置:', window.pageYOffset)
    
    // 隐藏箭头
    showArrow.value = false
    console.log('隐藏箭头，showArrow =', showArrow.value)
    
    // 标记为手动滚动，防止触发自动捕捉
    isManualScrolling = true
    
    // 使用平滑滚动
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
    
    console.log('开始平滑滚动...')
    
    // 滚动完成后解除标记
    setTimeout(() => {
      isManualScrolling = false
      console.log('手动滚动完成，解锁')
    }, 800)
  } else {
    console.error('未找到 industry-news-section')
  }
}

// 监听滚动，实现自动捕捉
let isAutoScrolling = false
let lastScrollTop = 0
let isManualScrolling = false // 标记是否是手动点击箭头滚动
let scrollTimeout = null // 滚动定时器
let hasVisitedIndustryNews = false // 标记是否已经访问过行业要闻（从轮播图下来）

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  
  // 清除定时器
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  // 控制箭头显示：在顶部时显示
  if (scrollTop < 50) {
    showArrow.value = true
  } else {
    showArrow.value = false
  }
  
  // 自动锁定或手动滚动期间不处理
  if (isAutoScrolling || isManualScrolling) {
    return
  }
  
  const targetSection = document.querySelector('.industry-news-section')
  
  if (!targetSection) {
    lastScrollTop = scrollTop
    return
  }
  
  const targetTop = targetSection.getBoundingClientRect().top
  const targetHeight = targetSection.offsetHeight
  
  // 判断滚动方向
  const isScrollingDown = scrollTop > lastScrollTop
  const isScrollingUp = scrollTop < lastScrollTop
  
  console.log('=== 滚动检测 ===')
  console.log('滚动方向:', isScrollingDown ? '向下' : '向上')
  console.log('scrollTop:', scrollTop)
  console.log('targetTop:', targetTop)
  console.log('hasVisitedIndustryNews:', hasVisitedIndustryNews)
  
  // 向下滑动：从任何位置向下滑，都捕捉到行业要闻
  if (isScrollingDown && scrollTop > 30 && scrollTop < viewportHeight * 0.8) {
    console.log('>>> 向下滑动，捕捉到行业要闻')
    isAutoScrolling = true
    
    const navHeight = 80
    const targetPosition = targetSection.offsetTop - navHeight
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      isAutoScrolling = false
      hasVisitedIndustryNews = true // 标记已经访问过行业要闻
      console.log('<<< 向下捕捉完成，已标记访问过行业要闻')
    }, 600)
    
    lastScrollTop = scrollTop
    return
  }
  
  // 向上滑动：从下方内容滑上来时，定格在行业要闻
  if (isScrollingUp && scrollTop > 100) {
    // 当行业要闻区域在视口中下部时（targetTop 在 0 到 300 之间），强制定格
    if (targetTop > 0 && targetTop < 300) {
      console.log('>>> 从下方滑上来，强制定格在行业要闻！')
      isAutoScrolling = true
      
      const navHeight = 80
      const targetPosition = targetSection.offsetTop - navHeight
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      
      setTimeout(() => {
        isAutoScrolling = false
        console.log('<<< 强制定格完成')
      }, 500)
      
      lastScrollTop = scrollTop
      return
    }
    
    // 只有当已经访问过行业要闻，且行业要闻在顶部时，才触发轮播图
    if (hasVisitedIndustryNews && targetTop >= -100 && targetTop <= 100 && scrollTop > 50) {
      console.log('>>> 从行业要闻向上滑，触发轮播图')
      isAutoScrolling = true
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      
      setTimeout(() => {
        isAutoScrolling = false
        hasVisitedIndustryNews = false
        console.log('<<< 向上捕捉完成，重置访问标记')
      }, 600)
      
      lastScrollTop = scrollTop
      return
    }
  }
  
  // 更新上次滚动位置
  lastScrollTop = scrollTop
  
  // 设置滚动结束后的定时器，重置状态
  scrollTimeout = setTimeout(() => {
    console.log('滚动停止，hasVisitedIndustryNews:', hasVisitedIndustryNews)
  }, 1000)
}

onMounted(() => {
  console.log('Home 组件已挂载，开始监听滚动')
  console.log('初始 showArrow:', showArrow.value)
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 初始检查一次箭头显示
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  if (scrollTop < 50) {
    showArrow.value = true
  } else {
    showArrow.value = false
  }
  
  // 加载轮播图数据
  fetchCarouselSlides()
  
  // 启动轮播图自动播放
  startAutoPlay()
  
  // 加载行业要闻数据
  fetchIndustryNews()
  
  // 定时更新：每天更新一次（24 小时 = 86400000 毫秒）
  newsUpdateInterval = setInterval(() => {
    console.log('定时更新行业要闻...')
    fetchIndustryNews()
  }, 86400000) // 86400000ms = 24 小时
})

onUnmounted(() => {
  console.log('Home 组件已卸载，停止监听滚动')
  window.removeEventListener('scroll', handleScroll)
  
  // 清除轮播图定时器
  stopAutoPlay()
  
  // 清除行业要闻定时器
  if (newsUpdateInterval) {
    clearInterval(newsUpdateInterval)
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
}

/* CSS Scroll Snap - 接近时捕捉，允许慢慢滑动 */
.snap-container {
  scroll-snap-type: y proximity;
  overflow-y: scroll;
  height: 100vh;
  scroll-behavior: smooth;
}

/* 每个捕捉项 - 全屏高度 */
.snap-item {
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  height: 100vh;
  width: 100%;
  position: relative;
}

/* 轮播图区域 - 全屏高度 */
.carousel-section {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  scroll-snap-align: start;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 向下箭头 - 北大官网风格 */
.scroll-arrow {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  animation: bounce 2s infinite;
  pointer-events: auto;
}

.scroll-arrow:hover {
  color: white;
  transform: translateX(-50%) translateY(3px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 响应式适配 */
@media (max-height: 700px) {
  .scroll-arrow {
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
  
  .slide-content h1 {
    font-size: clamp(36px, 6vw, 56px);
  }
  
  .slide-content p {
    font-size: clamp(14px, 2.5vw, 20px);
  }
}

@media (max-width: 768px) {
  .scroll-arrow {
    bottom: 15px;
    width: 35px;
    height: 35px;
  }
  
  .slide-bg {
    background-position: center 40%;
  }
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 1;
}

.carousel-slide.active {
  opacity: 1;
}

/* 轮播图指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background: white;
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.3);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}

/* 响应式适配指示器 */
@media (max-height: 700px) {
  .carousel-indicators {
    bottom: 60px;
  }
  
  .indicator {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 768px) {
  .carousel-indicators {
    bottom: 55px;
  }
  
  .indicator {
    width: 8px;
    height: 8px;
  }
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 0 20px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.slide-content h1 {
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 700;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  color: white;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  line-height: 1.2;
  word-break: break-word;
}

.slide-content p {
  font-size: clamp(14px, 2.5vw, 22px);
  margin: 0 0 32px 0;
  opacity: 0.95;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.5;
}

.cta-btn {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: white;
  color: #0066cc;
}

.cta-btn.primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cta-btn.secondary {
  background: transparent;
  color: #333333;
  border: 2px solid #333333;
  margin-left: 16px;
}

.cta-btn.secondary:hover {
  background: #333333;
  color: white;
}

/* 深色模式下的按钮样式 */
html.dark-mode .cta-btn.secondary {
  background: white;
  color: #000000;
  border-color: white;
}

html.dark-mode .cta-btn.secondary:hover {
  background: #e0e0e0;
  color: #000000;
}

.slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

/* 图片调节层 - 让图片变暗，突出文字 */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* 纯图片的遮罩层 - 更暗一些 */
.pure-image-overlay {
  background: rgba(0, 0, 0, 0.15);
}

/* 通用区块样式 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
}

.section-title {
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  transition: color 0.3s ease;
}

/* 深色模式下，首页标题保持深色（因为背景是浅色） */
html.dark-mode .section-title {
  color: #333333;
}

.section-subtitle {
  text-align: center;
  font-size: 20px;
  color: var(--text-secondary);
  margin: 0 0 60px 0;
  transition: color 0.3s ease;
}

/* 深色模式下，首页副标题保持深色（因为背景是浅色） */
html.dark-mode .section-subtitle {
  color: #666666;
}

/* 介绍区域 - 全屏高度 */
.intro-section {
  background: var(--card-bg);
  margin: 0;
  padding: 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  transition: background-color 0.3s ease;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 30px 20px;
}

.intro-card {
  text-align: center;
  padding: 30px 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 220px;
}

.intro-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 18px;
}

.intro-card h3 {
  font-size: 20px;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  transition: color 0.3s ease;
}

.intro-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  transition: color 0.3s ease;
}

/* 数据统计与核心功能左右布局 */
.data-features-section {
  background: var(--card-bg);
  min-height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  transition: background-color 0.3s ease;
}

.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1100px;
  width: 100%;
}

.left-column,
.right-column {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0 auto 24px auto;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 3px solid var(--border-color);
  width: 200px;
  transition: color 0.3s ease, border-color 0.3s ease;
}

/* 左侧 - 数据统计（2x2 网格，高低层次排列） */
.stats-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.stat-summary-card {
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
  width: 100%;
  height: 140px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 第一行数据项 - 最高位置 */
.stat-summary-card:nth-child(1),
.stat-summary-card:nth-child(2) {
  transform: translateY(0);
}

/* 第二行数据项 - 最低位置（与右侧移动管理对齐） */
.stat-summary-card:nth-child(3),
.stat-summary-card:nth-child(4) {
  transform: translateY(30px);
}

.stat-summary-card .stat-number {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
}

.stat-summary-card .stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

/* 右侧 - 核心功能（横向一列排开，每个功能框内部竖向排列） */
.features-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}

.feature-item-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  border-top: 4px solid #0066cc;
  width: 100%;
  max-width: 260px;
  height: 320px !important;
}

.feature-item-1:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%);
  border-left-color: #0066cc;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}

/* 第二个功能项 - 最低位置（竖向排列，内容上下分布） */
.feature-item-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 6px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  border-top: 4px solid #66b3ff;
  width: 100%;
  max-width: 260px;
  height: 320px !important;
  transform: translateY(30px);
}

.feature-item-2:hover {
  background: #E8F4FF;
  border-left-color: #0066cc;
  transform: translateY(27px);
  box-shadow: 0 3px 10px rgba(0, 102, 204, 0.1);
}

/* 第三个功能项 - 中等位置（竖向排列，内容上下分布） */
.feature-item-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 6px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  border-top: 4px solid #99ccff;
  width: 100%;
  max-width: 260px;
  height: 320px !important;
  transform: translateY(15px);
}

.feature-item-3:hover {
  background: #E8F4FF;
  border-left-color: #0066cc;
  transform: translateY(12px);
  box-shadow: 0 3px 8px rgba(0, 102, 204, 0.1);
}

.feature-icon-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.feature-content {
  width: 100%;
}

.feature-content h3 {
  font-size: 18px;
  color: #000000;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.feature-content p {
  font-size: 14px;
  color: #333333;
  margin: 0;
  line-height: 1.5;
}

/* CTA 区域 - 紧凑设计 */
.cta-section {
  background: var(--bg-secondary);
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px 20px;
  transition: background-color 0.3s ease;
}

.cta-section h2 {
  font-size: 28px;
  color: var(--text-primary);
  margin: 0 0 10px 0;
  transition: color 0.3s ease;
}

/* 深色模式下，CTA 标题保持深色（因为背景是浅色） */
html.dark-mode .cta-section h2 {
  color: #333333;
}

html.dark-mode .cta-section p {
  color: #666666;
}

.cta-section p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
  transition: color 0.3s ease;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .intro-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .slide-content h1 {
    font-size: 36px;
  }
  
  .slide-content p {
    font-size: 18px;
  }
  
  .scroll-arrow {
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
  
  .slide-bg {
    background-position: center 50%;
  }
  
  .intro-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .cta-btn.secondary {
    margin-left: 0;
    margin-top: 16px;
  }
}

/* 行业要闻样式（参考北大要闻设计） */
.industry-news-section {
  background: var(--bg-secondary);
  min-height: 750px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 15px 20px 40px 20px;
  transition: background-color 0.3s ease;
}

.news-grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
  max-width: 1100px;
  width: 100%;
}

/* 重点新闻卡片（大图） */
.featured-news-card.large {
  position: relative;
  height: 280px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

/* 左上大图 */
.featured-news-card.large:first-child {
  grid-column: 1;
  grid-row: 1;
}

/* 右下大图 */
.featured-news-card.large:last-child {
  grid-column: 2;
  grid-row: 2;
}

.featured-news-card.large:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 右上 4 个小卡片网格 */
.top-right-grid {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}

/* 左下 4 个小卡片网格 */
.bottom-left-grid {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}

.news-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-news-card.large:hover .news-image {
  transform: scale(1.05);
}

.news-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%);
  padding: 20px;
  color: white;
}

.news-overlay .news-title {
  font-size: 18px;
  margin: 0 0 6px 0;
  line-height: 1.4;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-overlay .news-summary {
  font-size: 13px;
  margin: 0 0 10px 0;
  line-height: 1.5;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  opacity: 0.85;
}

/* 新闻卡片样式 */

.news-card-item {
  background: var(--card-bg);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px var(--shadow-color);
  border: 1px solid var(--border-color);
  border-bottom: 3px solid transparent;
  display: flex;
  flex-direction: column;
}

.news-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px var(--shadow-color);
  border-bottom-color: #0066cc;
}

.news-card-content {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-card-title {
  font-size: 14px;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

/* 深色模式下，新闻卡片标题保持深色（因为背景是浅色） */
html.dark-mode .news-card-title {
  color: #333333;
}

.news-card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 8px;
  transition: color 0.3s ease;
}

/* 加载状态 */
.loading-news {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg-tertiary);
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .news-grid-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .featured-news-card.large {
    grid-row: auto !important;
    height: 240px;
  }
  
  .right-news-column {
    grid-column: 1;
    grid-row: auto;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .news-card-item {
    height: 120px;
  }
}

/* 响应式设计 - 行内要闻 */
@media (max-width: 992px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .two-column-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .news-section {
    padding: 60px 16px;
  }
  
  .news-card {
    padding: 24px;
  }
  
  .data-features-section {
    padding: 60px 16px;
  }
  
  .left-column,
  .right-column {
    padding: 20px;
  }
}
</style>
