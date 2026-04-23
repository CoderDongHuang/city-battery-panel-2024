import axios from 'axios'
import crypto from 'crypto-js'

/**
 * 钉钉机器人通知服务
 * 用于发送消息到钉钉群聊
 */
export const dingtalkService = {
  /**
   * 生成加签时间戳
   * @param {string} secret - 加签密钥
   * @returns {Object} { timestamp, sign }
   */
  generateSignature(secret) {
    const timestamp = Date.now().toString()
    const stringToSign = `${timestamp}\n${secret}`
    const sign = crypto.HmacSHA256(stringToSign, secret).toString(crypto.enc.Base64)
    return {
      timestamp: encodeURIComponent(timestamp),
      sign: encodeURIComponent(sign)
    }
  },

  /**
   * 发送钉钉消息
   * @param {Object} options - 消息选项
   * @param {string} options.webhook - 钉钉机器人 webhook URL
   * @param {string} options.secret - 加签密钥（可选）
   * @param {Object} options.message - 消息对象
   */
  async sendMessage(options) {
    try {
      const { webhook, secret, message } = options
      
      // 构建完整的 webhook URL（带加签参数）
      let finalWebhook = webhook
      if (secret) {
        const { timestamp, sign } = this.generateSignature(secret)
        finalWebhook = `${webhook}&timestamp=${timestamp}&sign=${sign}`
      }
      
      const payload = {
        msgtype: 'markdown',
        markdown: {
          title: message.title,
          text: this.generateMarkdown(message)
        },
        at: {
          isAtAll: true
        }
      }

      // 通过后端代理发送，避免 CORS 问题
      const response = await axios.post('/api/notification/dingtalk/send', {
        webhook: finalWebhook,
        payload: payload
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })

      return response.data
    } catch (error) {
      console.error('发送钉钉消息失败:', error)
      throw error
    }
  },

  /**
   * 生成钉钉 Markdown 消息
   * @param {Object} message - 消息对象
   * @returns {string} Markdown 格式文本
   */
  generateMarkdown(message) {
    const categoryEmojis = {
      system: '⚙️',
      swap: '🔋',
      alert: '⚠️',
      activity: '🎉'
    }

    const categoryNames = {
      system: '系统通知',
      swap: '换电提醒',
      alert: '报警通知',
      activity: '活动公告'
    }

    const emoji = categoryEmojis[message.category] || '📧'
    const categoryName = categoryNames[message.category] || '消息通知'

    let markdown = `## ${emoji} ${message.title}

> **分类：** ${categoryName}  
> **时间：** ${this.formatTime(message.createTime)}

---

${message.content}
`

    // 添加高亮信息
    if (message.displayData?.highlights) {
      markdown += '\n---\n\n**详细信息：**\n\n'
      message.displayData.highlights.forEach(h => {
        markdown += `- **${h.label}:** ${h.value}\n`
      })
    }

    // 添加操作按钮（钉钉支持在消息中添加链接）
    markdown += `\n---\n\n[查看消息详情](${window.location.origin}/messages)`

    return markdown
  },

  /**
   * 发送文本消息
   * @param {Object} options - 消息选项
   * @param {string} options.webhook - 钉钉机器人 webhook URL
   * @param {string} options.content - 文本内容
   */
  async sendTextMessage(options) {
    try {
      const { webhook, content } = options
      
      const payload = {
        msgtype: 'text',
        text: {
          content: content
        },
        at: {
          isAtAll: true
        }
      }

      const response = await axios.post(webhook, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (error) {
      console.error('发送钉钉文本消息失败:', error)
      throw error
    }
  },

  /**
   * 发送链接消息
   * @param {Object} options - 消息选项
   * @param {string} options.webhook - 钉钉机器人 webhook URL
   * @param {Object} options.link - 链接消息内容
   */
  async sendLinkMessage(options) {
    try {
      const { webhook, link } = options
      
      const payload = {
        msgtype: 'link',
        link: {
          title: link.title,
          text: link.text,
          picUrl: link.picUrl,
          messageUrl: link.messageUrl
        }
      }

      const response = await axios.post(webhook, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (error) {
      console.error('发送钉钉链接消息失败:', error)
      throw error
    }
  },

  /**
   * 格式化时间
   * @param {string} time - 时间字符串
   * @returns {string} 格式化后的时间
   */
  formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export default dingtalkService
