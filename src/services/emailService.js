import axios from 'axios'

/**
 * 邮件发送服务
 * 用于发送系统通知邮件
 */
export const emailService = {
  /**
   * 发送邮件通知
   * @param {Object} options - 邮件选项
   * @param {string} options.to - 收件人邮箱
   * @param {string} options.subject - 邮件主题
   * @param {string} options.content - 邮件内容（HTML 格式）
   * @param {string} options.category - 消息分类（用于邮件模板）
   */
  async sendEmail(options) {
    try {
      const response = await axios.post('/api/notification/email/send', {
        to: options.to,
        subject: options.subject,
        content: options.content,
        category: options.category
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('发送邮件失败:', error)
      throw error
    }
  },

  /**
   * 批量发送邮件
   * @param {Object} options - 邮件选项
   * @param {string[]} options.to - 收件人邮箱列表
   * @param {string} options.subject - 邮件主题
   * @param {string} options.content - 邮件内容
   * @param {string} options.category - 消息分类
   */
  async sendBatchEmail(options) {
    try {
      const response = await axios.post('/api/notification/email/batch', {
        to: options.to,
        subject: options.subject,
        content: options.content,
        category: options.category
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('批量发送邮件失败:', error)
      throw error
    }
  },

  /**
   * 生成邮件内容 HTML
   * @param {Object} message - 消息对象
   * @returns {string} HTML 内容
   */
  generateEmailHTML(message) {
    const categoryColors = {
      system: '#1890ff',
      swap: '#52c41a',
      alert: '#fa8c16',
      activity: '#f5222d'
    }

    const categoryNames = {
      system: '系统通知',
      swap: '换电提醒',
      alert: '报警通知',
      activity: '活动公告'
    }

    const color = categoryColors[message.category] || '#667eea'
    const categoryName = categoryNames[message.category] || '消息通知'

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, ${color} 0%, ${this.adjustColor(color, -20)} 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-header .category {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
    }
    .email-body {
      padding: 30px 20px;
    }
    .email-body h2 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #1a1a1a;
    }
    .email-body .content {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid ${color};
      margin: 20px 0;
    }
    .email-body .content p {
      margin: 0;
      color: #555;
    }
    .email-footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #e0e0e0;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: ${color};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 20px;
      font-weight: 500;
    }
    .highlights {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
    .highlight-item {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
    }
    .highlight-label {
      font-weight: 600;
      color: #666;
    }
    .highlight-value {
      color: ${color};
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>CitySwap 消息通知</h1>
      <span class="category">${categoryName}</span>
    </div>
    
    <div class="email-body">
      <h2>${message.title}</h2>
      
      <div class="content">
        <p>${message.content}</p>
      </div>
      
      ${this.generateHighlightsHTML(message.displayData)}
      
      <div style="text-align: center;">
        <a href="${window.location.origin}/messages" class="btn">查看消息详情</a>
      </div>
    </div>
    
    <div class="email-footer">
      <p>此邮件由 CitySwap 系统自动发送，请勿直接回复</p>
      <p>&copy; ${new Date().getFullYear()} CitySwap. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  },

  /**
   * 生成高亮信息 HTML
   * @param {Array} highlights - 高亮信息数组
   * @returns {string} HTML 内容
   */
  generateHighlightsHTML(highlights) {
    if (!highlights || highlights.length === 0) return ''

    return `
      <div class="highlights">
        ${highlights.map(h => `
          <div class="highlight-item" style="color: ${h.color}">
            <span class="highlight-label">${h.label}:</span>
            <span class="highlight-value">${h.value}</span>
          </div>
        `).join('')}
      </div>
    `
  },

  /**
   * 调整颜色亮度
   * @param {string} color - 十六进制颜色
   * @param {number} percent - 调整百分比
   * @returns {string} 调整后的颜色
   */
  adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = ((num >> 8) & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)
  }
}

export default emailService
