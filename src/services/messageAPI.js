import request from '../utils/request.js'

/**
 * 消息管理 API
 */
export const messageAPI = {
  /**
   * 获取用户消息列表
   * @param {Object} params - 请求参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页数量
   * @param {string} params.category - 消息分类
   * @param {string} params.source - 消息来源
   * @param {boolean} params.isRead - 是否已读
   * @param {string} params.sort - 排序字段
   */
  getUserMessages(params) {
    return request({
      url: '/user/messages',
      method: 'get',
      params
    })
  },

  /**
   * 获取未读消息数
   */
  getUnreadCount() {
    return request({
      url: '/user/messages/unread-count',
      method: 'get'
    })
  },

  /**
   * 获取消息详情
   * @param {number} id - 消息 ID
   */
  getMessageDetail(id) {
    return request({
      url: `/user/messages/${id}`,
      method: 'get'
    })
  },

  /**
   * 标记消息为已读
   * @param {number} id - 消息 ID
   */
  markAsRead(id) {
    return request({
      url: `/user/messages/${id}/read`,
      method: 'put'
    })
  },

  /**
   * 批量标记已读
   * @param {number[]} messageIds - 消息 ID 数组
   */
  markBatchAsRead(messageIds) {
    return request({
      url: '/user/messages/read-batch',
      method: 'put',
      data: { messageIds }
    })
  },

  /**
   * 删除消息
   * @param {number} id - 消息 ID
   */
  deleteMessage(id) {
    return request({
      url: `/user/messages/${id}`,
      method: 'delete'
    })
  },

  /**
   * 批量删除消息
   * @param {number[]} messageIds - 消息 ID 数组
   */
  deleteBatchMessages(messageIds) {
    return request({
      url: '/user/messages/batch',
      method: 'delete',
      data: { messageIds }
    })
  },

  /**
   * 获取管理端消息列表
   * @param {Object} params - 请求参数
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页数量
   * @param {string} params.category - 消息分类
   * @param {string} params.source - 消息来源
   * @param {string} params.sendStatus - 发送状态
   * @param {string} params.keyword - 搜索关键词
   */
  getAdminMessages(params) {
    return request({
      url: '/admin/messages',
      method: 'get',
      params
    })
  },

  /**
   * 获取管理端消息详情
   * @param {number} id - 消息 ID
   */
  getAdminMessageDetail(id) {
    return request({
      url: `/admin/messages/${id}`,
      method: 'get'
    })
  },

  /**
   * 发送消息
   * @param {Object} data - 请求数据
   * @param {string} data.title - 标题
   * @param {string} data.content - 内容
   * @param {string} data.category - 分类
   * @param {string} data.targetType - 目标类型
   * @param {number[]} data.targetIds - 目标 ID 数组
   * @param {number} data.priority - 优先级
   * @param {string} data.scheduledTime - 定时发送时间
   * @param {Object} data.extraData - 扩展数据
   */
  sendMessage(data) {
    return request({
      url: '/admin/messages/send',
      method: 'post',
      data
    })
  },

  /**
   * 取消发送定时消息
   * @param {number} id - 消息 ID
   */
  cancelMessage(id) {
    return request({
      url: `/admin/messages/${id}/cancel`,
      method: 'put'
    })
  },

  /**
   * 重新发送消息
   * @param {number} id - 消息 ID
   */
  resendMessage(id) {
    return request({
      url: `/admin/messages/${id}/resend`,
      method: 'post'
    })
  }
}

export default messageAPI
