<template>
  <div class="help-page">
    <!-- 顶部横幅区域 -->
    <div class="help-banner">
      <div class="banner-content">
        <h1 class="banner-title">帮助中心</h1>
        <p class="banner-description">
          CitySwap 官方帮助文档，为您提供全面的产品使用指南、详细的操作步骤说明、常见问题解答以及专业的技术支持服务，让您轻松掌握换电服务的每一个环节。
        </p>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索帮助文档、常见问题..."
              class="search-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="help-main-container">
      <div class="help-content-wrapper">
        <!-- 快速导航 -->
        <div class="content-box">
          <div class="quick-nav-section">
            <h2 class="section-main-title">快速导航</h2>
            <div class="quick-nav-grid">
              <div class="quick-nav-card" @click="scrollToSection('guide')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>使用指南</h3>
                  <p>快速上手指南</p>
                </div>
              </div>
              
              <div class="quick-nav-card" @click="scrollToSection('faq')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>常见问题</h3>
                  <p>常见问题解答</p>
                </div>
              </div>
              
              <div class="quick-nav-card" @click="scrollToSection('contact')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>联系我们</h3>
                  <p>获取帮助支持</p>
                </div>
              </div>
              
              <div class="quick-nav-card" @click="goToPage('dashboard')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>用户仪表盘</h3>
                  <p>查看账户信息</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 使用指南 -->
        <div class="content-box">
          <div id="guide" class="guide-section">
            <h2 class="section-main-title">使用指南</h2>
            <div class="guide-cards">
              <div class="guide-card" @click="toggleGuide('register')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>注册账号</h3>
                  <p>快速注册 CitySwap 账号，开启便捷换电之旅</p>
                </div>
              </div>
              
              <div class="guide-card" @click="toggleGuide('swap')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>首次换电</h3>
                  <p>3 分钟了解完整换电流程，快速上手</p>
                </div>
              </div>
              
              <div class="guide-card" @click="toggleGuide('payment')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>支付指南</h3>
                  <p>支持多种支付方式，安全便捷</p>
                </div>
              </div>
              
              <div class="guide-card" @click="toggleGuide('membership')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>会员服务</h3>
                  <p>开通会员，享受专属折扣和优先服务</p>
                </div>
              </div>
              
              <div class="guide-card" @click="toggleGuide('stations')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>服务网点</h3>
                  <p>查找附近换电站，预约换电服务</p>
                </div>
              </div>
              
              <div class="guide-card" @click="toggleGuide('batteries')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                    <line x1="6" y1="7" x2="6" y2="17"></line>
                    <line x1="10" y1="7" x2="10" y2="17"></line>
                    <line x1="14" y1="7" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>电池管理</h3>
                  <p>电池状态监控、健康度检测</p>
                </div>
              </div>
            </div>
            
            <!-- 使用指南详细内容区域 - 手风琴效果 -->
            <div class="guide-detail-sections">
              <!-- 注册账号 -->
              <div v-show="activeGuide === 'register'" class="guide-detail-card" :class="{ 'guide-detail-active': activeGuide === 'register' }">
                <div class="guide-detail-header">
                  <svg class="guide-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  <h3 class="guide-detail-title">注册账号</h3>
                </div>
                <div class="guide-detail-content">
                  <div class="guide-steps">
                    <div class="step-item">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h4>下载 CitySwap APP</h4>
                        <p>在应用商店搜索"CitySwap"下载安装，或访问官网下载页面</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h4>点击注册按钮</h4>
                        <p>打开 APP，点击首页右下角"我的"，选择"注册账号"</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h4>填写手机号码</h4>
                        <p>输入您的手机号码，点击"获取验证码"，输入收到的短信验证码</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">4</div>
                      <div class="step-content">
                        <h4>设置登录密码</h4>
                        <p>设置 6-20 位登录密码（字母 + 数字组合），点击"完成注册"</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">5</div>
                      <div class="step-content">
                        <h4>完善个人信息</h4>
                        <p>可选：上传头像、设置昵称、绑定邮箱等</p>
                      </div>
                    </div>
                  </div>
                  <div class="guide-tips">
                    <strong>💡 温馨提示：</strong>
                    <ul>
                      <li>注册过程仅需 1-2 分钟</li>
                      <li>验证码 5 分钟内有效</li>
                      <li>密码请妥善保管，建议包含字母和数字</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 首次换电 -->
              <div v-show="activeGuide === 'swap'" class="guide-detail-card" :class="{ 'guide-detail-active': activeGuide === 'swap' }">
                <div class="guide-detail-header">
                  <svg class="guide-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <h3 class="guide-detail-title">首次换电</h3>
                </div>
                <div class="guide-detail-content">
                  <div class="guide-steps">
                    <div class="step-item">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h4>查找附近换电站</h4>
                        <p>打开 APP，点击首页"换电站"，查看附近换电站位置和实时电池库存</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h4>预约换电服务</h4>
                        <p>选择目标换电站，点击"预约换电"，系统保留电池 30 分钟</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h4>到达换电站</h4>
                        <p>按导航到达换电站，在 APP 点击"我已到达"</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">4</div>
                      <div class="step-content">
                        <h4>扫描设备二维码</h4>
                        <p>使用 APP 扫描换电柜上的二维码，柜门自动打开</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">5</div>
                      <div class="step-content">
                        <h4>放入旧电池</h4>
                        <p>将旧电池放入空位，关好柜门，系统自动检测电池</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">6</div>
                      <div class="step-content">
                        <h4>取出新电池</h4>
                        <p>系统分配满电电池，对应柜门打开，取出电池并确认</p>
                      </div>
                    </div>
                  </div>
                  <div class="guide-tips">
                    <strong>💡 温馨提示：</strong>
                    <ul>
                      <li>首次换电免费体验</li>
                      <li>整个过程仅需 3-5 分钟</li>
                      <li>24 小时均可换电</li>
                      <li>如遇问题，点击 APP 内"在线客服"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 支付指南 -->
              <div v-show="activeGuide === 'payment'" class="guide-detail-card" :class="{ 'guide-detail-active': activeGuide === 'payment' }">
                <div class="guide-detail-header">
                  <svg class="guide-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <h3 class="guide-detail-title">支付指南</h3>
                </div>
                <div class="guide-detail-content">
                  <div class="payment-methods">
                    <div class="method-card">
                      <div class="method-icon">💳</div>
                      <h4>微信支付</h4>
                      <p>支持微信钱包、信用卡支付</p>
                    </div>
                    <div class="method-card">
                      <div class="method-icon">💰</div>
                      <h4>支付宝</h4>
                      <p>支持余额、余额宝、信用卡</p>
                    </div>
                    <div class="method-card">
                      <div class="method-icon">🏦</div>
                      <h4>银联卡</h4>
                      <p>支持各大银行储蓄卡和信用卡</p>
                    </div>
                    <div class="method-card">
                      <div class="method-icon">🎫</div>
                      <h4>余额支付</h4>
                      <p>使用 CitySwap 账户余额</p>
                    </div>
                  </div>
                  <div class="guide-tips">
                    <strong>💡 温馨提示：</strong>
                    <ul>
                      <li>换电完成后自动扣费</li>
                      <li>可在"我的 - 支付设置"中设置默认支付方式</li>
                      <li>会员用户享受专属折扣</li>
                      <li>支持开具电子发票</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 会员服务 -->
              <div v-show="activeGuide === 'membership'" class="guide-detail-card" :class="{ 'guide-detail-active': activeGuide === 'membership' }">
                <div class="guide-detail-header">
                  <svg class="guide-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <h3 class="guide-detail-title">会员服务</h3>
                </div>
                <div class="guide-detail-content">
                  <div class="membership-levels">
                    <div class="level-card">
                      <div class="level-badge level-silver">白银会员</div>
                      <div class="level-price">¥19/月</div>
                      <ul class="level-benefits">
                        <li>✅ 换电 9 折优惠</li>
                        <li>✅ 每月 2 张优惠券</li>
                        <li>✅ 积分 1.2 倍</li>
                      </ul>
                    </div>
                    <div class="level-card">
                      <div class="level-badge level-gold">黄金会员</div>
                      <div class="level-price">¥49/月</div>
                      <ul class="level-benefits">
                        <li>✅ 换电 8 折优惠</li>
                        <li>✅ 每月 5 张优惠券</li>
                        <li>✅ 积分 1.5 倍</li>
                        <li>✅ 优先预约</li>
                      </ul>
                    </div>
                    <div class="level-card">
                      <div class="level-badge level-platinum">铂金会员</div>
                      <div class="level-price">¥99/月</div>
                      <ul class="level-benefits">
                        <li>✅ 换电 7 折优惠</li>
                        <li>✅ 无限次优惠券</li>
                        <li>✅ 积分 2 倍</li>
                        <li>✅ 优先预约</li>
                        <li>✅ 免费电池检测</li>
                        <li>✅ 专属客服</li>
                      </ul>
                    </div>
                  </div>
                  <div class="guide-tips">
                    <strong>💡 温馨提示：</strong>
                    <ul>
                      <li>首次开通会员享 7 天免费试用</li>
                      <li>连续包月更优惠</li>
                      <li>会员等级可累积升级</li>
                      <li>会员权益不可转让</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 服务网点 -->
              <div v-show="activeGuide === 'stations'" class="guide-detail-card" :class="{ 'guide-detail-active': activeGuide === 'stations' }">
                <div class="guide-detail-header">
                  <svg class="guide-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <h3 class="guide-detail-title">服务网点</h3>
                </div>
                <div class="guide-detail-content">
                  <div class="station-features">
                    <div class="feature-item">
                      <div class="feature-icon">📍</div>
                      <h4>智能定位</h4>
                      <p>APP 自动定位您的位置，推荐最近换电站</p>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">📊</div>
                      <h4>实时库存</h4>
                      <p>显示各换电站电池数量和型号</p>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">⏰</div>
                      <h4>营业时间</h4>
                      <p>大部分换电站 24 小时营业</p>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">🚗</div>
                      <h4>导航服务</h4>
                      <p>一键导航至换电站，支持多种交通方式</p>
                    </div>
                  </div>
                  <div class="guide-tips">
                    <strong>💡 温馨提示：</strong>
                    <ul>
                      <li>建议提前查看电池库存再前往</li>
                      <li>高峰期可预约保留电池</li>
                      <li>部分商圈换电站可能收费不同</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 电池管理 -->
              <div v-show="activeGuide === 'batteries'" class="guide-detail-card" :class="{ 'guide-detail-active': activeGuide === 'batteries' }">
                <div class="guide-detail-header">
                  <svg class="guide-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                    <line x1="6" y1="7" x2="6" y2="17"></line>
                    <line x1="10" y1="7" x2="10" y2="17"></line>
                    <line x1="14" y1="7" x2="14" y2="17"></line>
                  </svg>
                  <h3 class="guide-detail-title">电池管理</h3>
                </div>
                <div class="guide-detail-content">
                  <div class="battery-features">
                    <div class="feature-item">
                      <div class="feature-icon">🔋</div>
                      <h4>状态监控</h4>
                      <p>实时查看电池电量、健康度、温度等信息</p>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">🛡️</div>
                      <h4>安全保障</h4>
                      <p>智能 BMS 系统，过充过放保护</p>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">📈</div>
                      <h4>健康检测</h4>
                      <p>每次换电自动检测电池健康状态</p>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">🔔</div>
                      <h4>异常提醒</h4>
                      <p>电池异常时 APP 实时推送通知</p>
                    </div>
                  </div>
                  <div class="guide-tips">
                    <strong>💡 温馨提示：</strong>
                    <ul>
                      <li>建议使用官方认证电池</li>
                      <li>定期查看电池健康报告</li>
                      <li>发现异常及时联系客服</li>
                      <li>电池质保期 12 个月</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见问题和新手专区 - 左右布局 6:4，两个独立框框 -->
        <div class="faq-newbie-container">
          <!-- 常见问题 -->
          <div class="content-box faq-content-box">
            <div class="faq-section">
              <h2 class="section-main-title">常见问题</h2>
              <div class="faq-list">
                <div 
                  v-for="(item, index) in faqItems" 
                  :key="index"
                  :class="['faq-item', { active: activeFaq === index }]"
                >
                  <div class="faq-question" @click="toggleFaq(index)">
                    <span>{{ item.question }}</span>
                    <span class="toggle-icon">{{ activeFaq === index ? '−' : '+' }}</span>
                  </div>
                  <div v-show="activeFaq === index" class="faq-answer">
                    {{ item.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 新手专区 -->
          <div class="content-box newbie-content-box">
            <div class="newbie-section">
              <h2 class="section-main-title">新手专区</h2>
              <div class="newbie-cards">
                <div class="newbie-card" @click="toggleGuide('register')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>新手入门</h3>
                    <p>快速了解 CitySwap 基本功能</p>
                  </div>
                </div>
                
                <div class="newbie-card" @click="toggleGuide('swap')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>首次换电</h3>
                    <p>3 分钟学会完整换电流程</p>
                  </div>
                </div>
                
                <div class="newbie-card" @click="toggleGuide('payment')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>支付指南</h3>
                    <p>多种支付方式任你选</p>
                  </div>
                </div>
                
                <div class="newbie-card" @click="toggleGuide('membership')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>会员福利</h3>
                    <p>开通会员享受专属优惠</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="content-box">
          <div class="contact-section" id="contact">
            <h2 class="section-main-title">联系我们</h2>
            <div class="contact-methods">
              <div class="contact-item">
                <div class="contact-icon">📞</div>
                <div class="contact-info">
                  <h3>电话咨询</h3>
                  <p>400-888-8888</p>
                  <span>工作日 9:00-18:00</span>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">💬</div>
                <div class="contact-info">
                  <h3>在线客服</h3>
                  <p>实时智能客服</p>
                  <span>7×24 小时服务</span>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">✉️</div>
                <div class="contact-info">
                  <h3>邮件支持</h3>
                  <p>support@cityswap.com</p>
                  <span>24 小时内回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧悬浮客服 -->
    <div class="floating-service-container">
      <div class="floating-service">
        <!-- AI 智能助手按钮 -->
        <div class="floating-btn-wrapper" @click="toggleAiAssistant">
          <div class="floating-btn floating-btn-ai" title="AI 智能助手">
            <span style="font-size: 22px;">🤖</span>
          </div>
        </div>
        
        <!-- 评价按钮 - 鼠标悬停显示 -->
        <div class="floating-btn-wrapper" @mouseenter="showRateMenuOnly" @mouseleave="handleRateMouseLeave">
          <div 
            class="floating-btn floating-btn-rate"
          >
            <svg class="floating-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div v-show="showRateMenu" class="floating-menu floating-menu-rate" @mouseenter="keepRateMenuOpen" @mouseleave="handleRateMouseLeave">
            <div class="floating-menu-header">
              <div class="header-title-wrapper">
                <h4>您对此文档页面的整体评价？</h4>
                <span v-if="rating !== null" class="rating-emoji happy">
                  😊
                </span>
              </div>
              <span class="close-btn" @click="closeAllMenus">✕</span>
            </div>
            <div class="floating-menu-content rating-form-content">
              <!-- 评分部分 -->
              <div class="rating-section">
                <div class="rating-numbers">
                  <span 
                    v-for="num in 11" 
                    :key="num - 1"
                    :class="['rating-number', { selected: rating === num - 1 }]"
                    @click="setRating(num - 1)"
                  >
                    {{ num - 1 }}
                  </span>
                </div>
                <div class="rating-labels">
                  <span>非常不满意</span>
                  <span>非常满意</span>
                </div>
              </div>

              <!-- 满意原因选择 -->
              <div class="rating-reasons" v-if="rating >= 6">
                <div class="reasons-title"><span class="required">*</span> 您感到满意的原因是？（最多选三项）</div>
                <div class="reasons-grid">
                  <label class="reason-checkbox" v-for="(reason, index) in reasons" :key="index">
                    <input 
                      type="checkbox" 
                      v-model="selectedReasons" 
                      :value="reason"
                      :disabled="selectedReasons.length >= 3 && !selectedReasons.includes(reason)"
                    >
                    <span class="checkbox-text">{{ reason }}</span>
                  </label>
                </div>
              </div>

              <!-- 不满意原因选择 -->
              <div class="rating-reasons" v-if="rating < 6">
                <div class="reasons-title"><span class="required">*</span> 您感到不满意的原因是？（最多选三项）</div>
                <div class="reasons-grid">
                  <label class="reason-checkbox" v-for="(reason, index) in dissatisfactionReasons" :key="index">
                    <input 
                      type="checkbox" 
                      v-model="selectedReasons" 
                      :value="reason"
                      :disabled="selectedReasons.length >= 3 && !selectedReasons.includes(reason)"
                    >
                    <span class="checkbox-text">{{ reason }}</span>
                  </label>
                </div>
              </div>

              <!-- 文本反馈 -->
              <div class="rating-feedback">
                <div class="feedback-title">请针对您所遇到的问题给出具体的反馈</div>
                <textarea 
                  v-model="feedbackText"
                  maxlength="200"
                  placeholder="请输入内容"
                  rows="4"
                ></textarea>
                <div class="feedback-count">{{ feedbackText.length }}/200</div>
              </div>

              <!-- 提交按钮 -->
              <div class="rating-actions">
                <button class="action-btn action-btn-submit" @click="submitRating" :disabled="!canSubmit">提交</button>
                <button class="action-btn action-btn-cancel" @click="cancelRating">取消</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 联系电话按钮 - 鼠标悬停显示 -->
        <div class="floating-btn-wrapper" @mouseenter="showPhoneMenuOnly" @mouseleave="handlePhoneMouseLeave">
          <div 
            class="floating-btn floating-btn-phone"
          >
            <svg class="floating-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div v-show="showPhoneMenu" class="floating-menu floating-menu-phone" @mouseenter="keepPhoneMenuOpen" @mouseleave="handlePhoneMouseLeave">
            <div class="floating-menu-header">
              <h4>联系我们</h4>
              <span class="close-btn" @click="closeAllMenus">✕</span>
            </div>
            <div class="floating-menu-content">
              <div class="contact-item-floating">
                <div class="contact-icon-floating no-color">📞</div>
                <div class="contact-info-floating">
                  <h3>联系销售</h3>
                  <p>950808 转 1</p>
                </div>
              </div>
              
              <div class="contact-item-floating">
                <div class="contact-icon-floating no-color">🤖</div>
                <div class="contact-info-floating">
                  <h3>智能客服（已升级为云宝助手）</h3>
                  <p>点击右侧 🤖，直达 AI 助手</p>
                </div>
              </div>
              
              <div class="contact-item-floating">
                <div class="contact-icon-floating no-color">📝</div>
                <div class="contact-info-floating">
                  <h3>建议反馈</h3>
                  <p>您的每一条建议声音，我们都认真对待</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
    
    <!-- AI 智能助手 -->
    <AiAssistant ref="aiAssistantRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import AiAssistant from '../components/AiAssistant.vue'
import { ref as vueRef } from 'vue'

const router = useRouter()
const searchQuery = ref('')
const activeFaq = ref(null)
const activeGuide = ref(null) // 使用指南当前展开的项
const showRateMenu = ref(false)
const showPhoneMenu = ref(false)
const rating = ref(null)
const selectedReasons = ref([])
const feedbackText = ref('')

// AI 助手控制
const aiAssistantRef = vueRef(null)
const toggleAiAssistant = () => {
  if (aiAssistantRef.value) {
    aiAssistantRef.value.toggleAssistant()
  }
}

// 使用指南手风琴效果
const toggleGuide = (guideId) => {
  activeGuide.value = activeGuide.value === guideId ? null : guideId
}

onMounted(() => {
  console.log('=== Help Component Mounted ===')
  // AI 助手已独立为组件，无需在此初始化
})

watch(rating, (newVal) => {
  console.log('Rating changed to:', newVal)
  console.log('Emoji should appear:', newVal !== null)
})

const reasons = ref([
  '内容与产品页面一致',
  '内容易理解',
  '示例代码齐全',
  '步骤可操作',
  '想要的内容易搜到',
  '最佳实践丰富'
])

const dissatisfactionReasons = ref([
  '内容与产品页面不一致',
  '内容难以理解',
  '缺少示例代码',
  '步骤不可操作',
  '想要的内容难搜到',
  '缺乏最佳实践'
])

const faqItems = ref([
  {
    question: '如何注册 CitySwap 账号？',
    answer: '您可以通过 CitySwap APP 或官网进行注册。点击"注册"按钮，输入手机号码获取验证码，设置密码后即可完成注册。注册过程仅需 1-2 分钟。'
  },
  {
    question: '换电流程是怎样的？',
    answer: '换电流程非常简单：1. 通过 APP 查找附近换电站并预约；2. 到达换电站后扫描设备二维码；3. 取出旧电池放入换电柜；4. 从换电柜取出满电电池；5. 在 APP 确认完成换电。整个过程仅需 3-5 分钟。'
  },
  {
    question: '如何支付换电费用？',
    answer: 'CitySwap 支持多种支付方式，包括微信支付、支付宝、银联卡等。您可以在 APP 中绑定 preferred 支付方式，换电完成后系统会自动扣费。会员用户还可享受专属折扣。'
  },
  {
    question: '电池安全如何保障？',
    answer: 'CitySwap 所有电池均经过严格质量检测，并配备智能 BMS 电池管理系统。系统实时监控电池状态，包括温度、电压、电流等参数，确保使用安全。每次换电前都会进行自动检测。'
  },
  {
    question: '会员有哪些专属福利？',
    answer: 'CitySwap 会员可享受多重福利：1. 换电费用专属折扣；2. 优先预约换电；3. 免费电池检测；4. 生日礼包；5. 积分翻倍等。会员分为白银、黄金、铂金三个等级，等级越高福利越多。'
  }
])

const goToPage = (page) => {
  const routes = {
    'register': '/user/register',
    'first-swap': '/user/guide',
    'payment': '/user/payment',
    'membership': '/user/membership',
    'stations': '/user/stations',
    'batteries': '/user/batteries',
    'dashboard': '/user/dashboard'
  }
  if (routes[page]) {
    router.push(routes[page])
  }
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const toggleRateMenu = () => {
  showRateMenu.value = !showRateMenu.value
  showPhoneMenu.value = false
}

const showRateMenuOnly = () => {
  if (rateMenuTimeout.value) {
    clearTimeout(rateMenuTimeout.value)
    rateMenuTimeout.value = null
  }
  showRateMenu.value = true
  showPhoneMenu.value = false
}

const keepRateMenuOpen = () => {
  // 保持菜单打开
  if (rateMenuTimeout.value) {
    clearTimeout(rateMenuTimeout.value)
    rateMenuTimeout.value = null
  }
}

const rateMenuTimeout = ref(null)

const handleRateMouseLeave = () => {
  rateMenuTimeout.value = setTimeout(() => {
    showRateMenu.value = false
  }, 200)
}

const togglePhoneMenu = () => {
  showPhoneMenu.value = !showPhoneMenu.value
  showRateMenu.value = false
}

const showPhoneMenuOnly = () => {
  if (phoneMenuTimeout.value) {
    clearTimeout(phoneMenuTimeout.value)
    phoneMenuTimeout.value = null
  }
  showPhoneMenu.value = true
  showRateMenu.value = false
}

const keepPhoneMenuOpen = () => {
  // 保持菜单打开
  if (phoneMenuTimeout.value) {
    clearTimeout(phoneMenuTimeout.value)
    phoneMenuTimeout.value = null
  }
}

const phoneMenuTimeout = ref(null)

const handlePhoneMouseLeave = () => {
  phoneMenuTimeout.value = setTimeout(() => {
    showPhoneMenu.value = false
  }, 200)
}

const closeAllMenus = () => {
  showRateMenu.value = false
  showPhoneMenu.value = false
}

const setRating = (value) => {
  rating.value = value
  selectedReasons.value = []
  feedbackText.value = ''
}

const canSubmit = computed(() => {
  // 必须选择评分
  if (rating.value === null) return false
  // 必须选择至少一个原因
  if (selectedReasons.value.length === 0) return false
  return true
})

const cancelRating = () => {
  closeAllMenus()
  rating.value = null
  selectedReasons.value = []
  feedbackText.value = ''
}

const submitRating = () => {
  if (!canSubmit.value) {
    alert('请完成必填项')
    return
  }
  
  alert(`感谢您的评价！
评分：${rating.value}分
原因：${selectedReasons.value.join(', ')}
反馈：${feedbackText.value || '无'}`)
  
  closeAllMenus()
  rating.value = null
  selectedReasons.value = []
  feedbackText.value = ''
}

const startAiChat = () => {
  alert('AI 智能客服功能即将上线，敬请期待！')
}
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
}

.help-banner {
  padding: 80px 20px 60px;
  text-align: center;
  position: relative;
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
}

.banner-title {
  font-size: 56px;
  color: var(--text-primary);
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  transition: color 0.3s ease;
}

.banner-description {
  font-size: 15px;
  color: var(--text-secondary);
  margin-top: 48px;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
  text-align: center;
  transition: color 0.3s ease;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  background: var(--card-bg);
  border-radius: 50px;
  padding: 14px 20px 14px 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 32px var(--shadow-color);
  transition: all 0.3s ease;
  border: none;
}

.search-box:hover {
  box-shadow: 0 12px 40px var(--shadow-color);
  transform: translateY(-2px);
}

.search-icon {
  width: 24px;
  height: 24px;
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--text-primary);
  background: transparent;
  transition: color 0.3s ease;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

/* 主内容容器 - 全宽布局 */
.help-main-container {
  max-width: 1700px;
  margin: 0 auto;
  padding: 20px 80px 60px;
}

.help-content-wrapper {
  width: 100%;
}

/* 内容区块容器 - 白色背景 */
.content-box {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px 80px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  margin-bottom: 48px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.content-box:last-child {
  margin-bottom: 0;
}

/* 常见问题和新手专区的框框在容器内无底部间距 */
.faq-content-box,
.newbie-content-box {
  margin-bottom: 0;
}

/* 章节通用样式 */
.quick-nav-section,
.guide-section,
.faq-section,
.newbie-section,
.contact-section {
  margin-bottom: 0;
}

.section-main-title {
  font-size: 40px;
  color: var(--text-primary);
  margin-bottom: 48px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
}

/* 快速导航 */
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.quick-nav-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.quick-nav-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.quick-nav-icon {
  width: 32px;
  height: 32px;
  color: white;
  flex-shrink: 0;
}

.quick-nav-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-nav-card:nth-child(2) .quick-nav-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.quick-nav-card:nth-child(3) .quick-nav-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.quick-nav-card:nth-child(4) .quick-nav-icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.quick-nav-card-content {
  flex: 1;
  min-width: 0;
}

.quick-nav-card h3 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.quick-nav-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  transition: color 0.3s ease;
}

/* 使用指南 */
.guide-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.guide-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.guide-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.guide-card-icon {
  width: 32px;
  height: 32px;
  color: white;
  flex-shrink: 0;
}

.guide-card-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-card:nth-child(2) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.guide-card:nth-child(3) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.guide-card:nth-child(4) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.guide-card:nth-child(5) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.guide-card:nth-child(6) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.guide-card-content {
  flex: 1;
  min-width: 0;
}

.guide-card h3 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.guide-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  transition: color 0.3s ease;
}

/* 常见问题和新手专区容器 - 6:4 布局 */
.faq-newbie-container {
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 40px;
  margin-bottom: 48px;
}

.faq-content-box,
.newbie-content-box {
  min-width: 0;
}

/* 常见问题 */
.faq-section {
  margin-bottom: 0;
}

.faq-section .section-main-title {
  text-align: center;
  margin-bottom: 40px;
}

.faq-list {
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px var(--shadow-color);
}

.faq-question {
  padding: 20px 24px;
  font-size: 16px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  transition: color 0.3s ease;
}

.toggle-icon {
  font-size: 24px;
  color: var(--text-tertiary);
  transition: transform 0.3s ease, color 0.3s ease;
}

.faq-item.active .toggle-icon {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 24px 20px;
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  border-top: 1px solid var(--border-color);
  margin-top: 0;
  padding-top: 16px;
  transition: color 0.3s ease, border-color 0.3s ease;
}

/* 新手专区 */
.newbie-section {
  margin-bottom: 0;
}

.newbie-section .section-main-title {
  text-align: center;
  margin-bottom: 40px;
}

.newbie-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.newbie-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.newbie-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.newbie-card-icon {
  width: 40px;
  height: 40px;
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.newbie-card-content {
  flex: 1;
  min-width: 0;
}

.newbie-card h3 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.newbie-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  transition: color 0.3s ease;
}

/* 联系我们 */
.contact-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.contact-item {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 20px var(--shadow-color);
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.contact-info h3 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-info p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.contact-info span {
  font-size: 13px;
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

/* 右侧悬浮客服 */
.floating-service-container {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.floating-service {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 12px 8px;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.floating-btn-wrapper {
  position: relative;
}

.floating-btn {
  width: 50px;
  height: 50px;
  background: var(--card-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
  box-shadow: 0 2px 12px var(--shadow-color);
}

.floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.floating-btn.floating-btn-ai {
  background: var(--card-bg);
}

.floating-btn.floating-btn-rate {
  background: var(--card-bg);
}

.floating-btn.floating-btn-rate:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.floating-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
  flex-shrink: 0;
  transition: color 0.3s ease;
}

/* 悬浮菜单 - 通用样式 */
.floating-menu {
  position: absolute;
  right: 64px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 24px var(--shadow-color);
  border: none;
  overflow: hidden;
  animation: slideIn 0.3s ease;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* AI 客服菜单 - 紧凑型 */
.floating-menu-ai {
  min-width: 400px;
  max-width: 400px;
}

/* 评价菜单 - 宽大型 */
.floating-menu-rate {
  min-width: 680px;
  max-width: 680px;
}

/* 电话/联系菜单 - 中等型 */
.floating-menu-phone {
  min-width: 500px;
  max-width: 500px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* AI 客服菜单 - 带渐变头部 */
.floating-menu-ai .floating-menu-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
}

.floating-menu-ai .floating-menu-header h4 {
  font-size: 16px;
  color: white;
  font-weight: 600;
  margin: 0;
}

.floating-menu-ai .close-btn {
  color: rgba(255, 255, 255, 0.8);
}

.floating-menu-ai .close-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.floating-menu-ai .floating-menu-content {
  padding: 24px;
}

.floating-menu-header h4 {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
  transition: color 0.3s ease;
}

/* 评价菜单 - 白色头部 */
.floating-menu-rate .floating-menu-header {
  padding: 20px 32px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.floating-menu-rate .floating-menu-header h4 {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
  transition: color 0.3s ease;
}

.floating-menu-rate .close-btn {
  font-size: 22px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.floating-menu-rate .close-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.floating-menu-rate .floating-menu-content {
  padding: 24px 32px 28px 32px;
}

/* 评价菜单标题包装器 */
.floating-menu-rate .header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.floating-menu-rate .rating-emoji {
  font-size: 24px;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 电话菜单 - 简洁白色 */
.floating-menu-phone .floating-menu-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.floating-menu-phone .floating-menu-header h4 {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
  transition: color 0.3s ease;
}

.floating-menu-phone .floating-menu-content {
  padding: 20px 24px;
}

/* AI 客服菜单 */
.ai-service-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.ai-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar-large.no-color {
  background: transparent;
  border: 1px solid var(--border-color);
}

.ai-avatar-large svg {
  width: 28px;
  height: 28px;
  color: white;
}

.ai-avatar-large.no-color svg {
  color: var(--text-secondary);
}

.ai-info h3 {
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.ai-info p {
  font-size: 13px;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
}

.ai-start-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 评价菜单 */
.rating-section {
  margin-bottom: 24px;
}

.rating-numbers {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}

.rating-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-primary);
}

.rating-number:hover {
  border-color: #52c41a;
  color: #52c41a;
}

.rating-number.selected {
  background: #52c41a;
  color: white;
  border-color: #52c41a;
}

.rating-emoji-score {
  font-size: 20px;
}

.rating-emoji-score.selected {
  background: #52c41a;
  border-color: #52c41a;
  animation: popIn 0.3s ease;
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: 10px;
  transition: color 0.3s ease;
}

/* 评价表单样式 */
.rating-form-content {
  min-width: 680px;
  max-width: 680px;
  padding: 0;
}

.rating-section {
  margin-bottom: 32px;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.reasons-title {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 20px;
  margin-bottom: 24px;
}

.reason-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.3s ease;
  padding: 0;
  background: transparent;
}

.reason-checkbox:hover {
  color: var(--text-secondary);
}

.reason-checkbox:hover input[type="checkbox"] {
  border-color: var(--text-primary);
}

.reason-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--bg-primary);
  transition: all 0.2s ease;
  position: relative;
}

.reason-checkbox input[type="checkbox"]:checked {
  background: var(--text-primary);
  border-color: var(--text-primary);
}

.reason-checkbox input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: var(--bg-primary);
  font-size: 14px;
  font-weight: bold;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.reason-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox-text {
  line-height: 1.6;
  user-select: none;
}

.rating-feedback {
  margin-bottom: 24px;
}

.feedback-title {
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-weight: 500;
}

.rating-feedback textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  color: var(--text-primary);
  resize: none;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 100px;
  background: var(--bg-primary);
}

.rating-feedback textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.rating-feedback textarea::placeholder {
  color: var(--text-tertiary);
}

.feedback-count {
  text-align: right;
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
  transition: color 0.3s ease;
}

.rating-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  margin-top: 28px;
  padding-top: 0;
  border-top: none;
}

.action-btn {
  padding: 10px 32px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  min-width: 100px;
  flex: 0 0 auto;
  color: var(--text-primary);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: var(--text-primary);
}

.action-btn-cancel {
  color: var(--text-secondary);
  border-color: var(--border-color);
  background: var(--card-bg);
}

.action-btn-cancel:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.action-btn-submit {
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
}

.action-btn-submit:hover:not(:disabled) {
  background: var(--text-secondary);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.action-btn-submit:disabled {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  border: 1px solid var(--border-color);
}

.submit-rating-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-rating-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* 电话菜单 */
.contact-item-floating {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: background 0.3s ease;
}

.contact-item-floating:hover {
  background: var(--bg-secondary);
}

.contact-icon-floating {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.contact-icon-floating.no-color {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  font-size: 18px;
}

.contact-icon-floating svg {
  width: 22px;
  height: 22px;
  color: white;
}

.contact-icon-floating.no-color svg {
  color: var(--text-secondary);
}

.contact-info-floating {
  flex: 1;
  min-width: 0;
}

.contact-info-floating h3 {
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-info-floating p {
  font-size: 13px;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .quick-nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .guide-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-methods {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .faq-newbie-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .faq-content-box,
  .newbie-content-box {
    margin-bottom: 0;
  }
  
  .faq-section {
    padding-right: 0;
  }
  
  .newbie-section {
    padding-left: 0;
  }
  
  .help-main-container {
    padding: 20px 40px 40px;
  }
  
  .content-box {
    padding: 40px 48px;
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 36px;
  }
  
  .banner-description {
    font-size: 14px;
  }
  
  .section-main-title {
    font-size: 28px;
  }
  
  .quick-nav-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-cards {
    grid-template-columns: 1fr;
  }
  
  .help-main-container {
    padding: 20px 20px 30px;
  }
  
  .content-box {
    padding: 32px 24px;
  }
  
  .floating-service {
    right: 16px;
  }
  
  .floating-btn {
    width: 48px;
    height: 48px;
  }
}

/* 使用指南详细内容区域 */
.guide-detail-sections {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.guide-detail-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid var(--border-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(-20px);
}

.guide-detail-card.guide-detail-active {
  max-height: 2000px;
  opacity: 1;
  transform: translateY(0);
  box-shadow: 0 8px 32px var(--shadow-color);
  border-color: var(--primary-color);
}

.guide-detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.guide-detail-icon {
  width: 48px;
  height: 48px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.guide-detail-title {
  font-size: 28px;
  color: var(--text-primary);
  font-weight: 700;
  margin: 0;
  transition: color 0.3s ease;
}

.guide-detail-content {
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

/* 步骤样式 */
.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.step-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6496c8 0%, #a8c8e8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(100, 150, 200, 0.3);
}

.step-content {
  flex: 1;
  padding-top: 4px;
}

.step-content h4 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.step-content p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
  transition: color 0.3s ease;
}

/* 温馨提示 */
.guide-tips {
  background: linear-gradient(135deg, rgba(255, 250, 230, 0.8) 0%, rgba(255, 245, 220, 0.6) 100%);
  border-left: 4px solid #ffb140;
  border-radius: 12px;
  padding: 20px 24px;
  margin-top: 32px;
}

.guide-tips strong {
  font-size: 16px;
  color: var(--text-primary);
  display: block;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.guide-tips ul {
  margin: 0;
  padding-left: 20px;
}

.guide-tips li {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 6px;
  transition: color 0.3s ease;
}

/* 支付方式 */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.method-card {
  background: linear-gradient(135deg, rgba(240, 248, 255, 0.6) 0%, rgba(230, 240, 255, 0.4) 100%);
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.method-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 20px var(--shadow-color);
}

.method-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.method-card h4 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.method-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;
}

/* 会员等级 */
.membership-levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.level-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 28px 24px;
  border: 2px solid var(--border-color);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.level-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px var(--shadow-color);
}

.level-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
}

.level-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
}

.level-card:nth-child(1)::before {
  background: linear-gradient(90deg, #c0c0c0, #e8e8e8);
}

.level-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffe066 100%);
}

.level-card:nth-child(2)::before {
  background: linear-gradient(90deg, #ffd700, #ffe066);
}

.level-platinum {
  background: linear-gradient(135deg, #e5e4e2 0%, #f0f0f0 100%);
}

.level-card:nth-child(3)::before {
  background: linear-gradient(90deg, #e5e4e2, #f0f0f0);
}

.level-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.level-price {
  font-size: 24px;
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}

.level-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.level-benefits li {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 2;
  padding: 4px 0;
  transition: color 0.3s ease;
}

/* 服务网点功能 */
.station-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.feature-item {
  background: linear-gradient(135deg, rgba(245, 250, 255, 0.6) 0%, rgba(240, 248, 255, 0.4) 100%);
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 20px var(--shadow-color);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.feature-item h4 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.feature-item p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;
}

/* 电池管理功能 */
.battery-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .payment-methods,
  .station-features,
  .battery-features {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .membership-levels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .guide-detail-card {
    padding: 28px 20px;
  }
  
  .guide-detail-header {
    flex-direction: column;
    text-align: center;
  }
  
  .guide-detail-icon {
    width: 40px;
    height: 40px;
  }
  
  .guide-detail-title {
    font-size: 22px;
  }
  
  .guide-steps {
    gap: 16px;
  }
  
  .step-number {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .step-content h4 {
    font-size: 16px;
  }
  
  .step-content p {
    font-size: 14px;
  }
  
  .payment-methods,
  .station-features,
  .battery-features {
    grid-template-columns: 1fr;
  }
  
  .method-card,
  .feature-item {
    padding: 20px 16px;
  }
}

/* 深色模式下，帮助中心横幅文字变成黑色（因为背景是浅色） */
html.dark-mode .banner-title {
  color: #333333 !important;
}

html.dark-mode .banner-description {
  color: #333333 !important;
}

html.dark-mode .section-main-title {
  color: #ffffff !important;
}

html.dark-mode .section-sub-title {
  color: #ffffff !important;
}

html.dark-mode .quick-nav-card h3 {
  color: #ffffff !important;
}

html.dark-mode .quick-nav-card p {
  color: #ffffff !important;
}

html.dark-mode .guide-card h3 {
  color: #ffffff !important;
}

html.dark-mode .guide-card p {
  color: #ffffff !important;
}
</style>
