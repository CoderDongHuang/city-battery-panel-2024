<template>
  <div class="ai-assistant-container">
    <!-- AI 助手主界面 -->
    <transition name="slide-fade">
      <div v-if="isExpanded" class="ai-main-panel" ref="aiPanel">
        <!-- 头部 -->
        <div class="ai-header">
          <div class="ai-header-content">
            <div class="ai-avatar-large">🤖</div>
            <div class="ai-title-section">
              <h3 class="ai-title-large">CitySwap 助手</h3>
              <p class="ai-subtitle-large">懂您所需，CitySwap 助手时刻相伴</p>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div class="ai-window-controls">
            <button class="ai-close-btn" @click="toggleAssistant" title="关闭">
              <span>✕</span>
            </button>
          </div>
        </div>

        <!-- 推荐问题卡片 -->
        <div v-if="messages.length === 0" class="ai-recommend-section">
          <div class="ai-recommend-card">
            <div class="ai-recommend-header">
              <span class="recommend-icon">⚡</span>
              <span class="recommend-title">常见问题</span>
            </div>
            <div class="ai-recommend-items">
              <div 
                v-for="(item, index) in recommendQuestions" 
                :key="index"
                class="ai-recommend-item"
                @click="sendQuestion(item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div v-else class="ai-chat-container">
          <div class="ai-messages">
            <div 
              v-for="(msg, index) in messages" 
              :key="index"
              :class="['ai-message', msg.role]"
            >
              <div v-if="msg.role === 'assistant'" class="ai-message-avatar">🤖</div>
              <div class="ai-message-content">
                <div class="ai-message-text">
                  <span v-if="msg.role === 'user'">{{ msg.content }}</span>
                  <span v-else>
                    {{ formatTypingText(msg.content, msg.typing) }}
                    <span v-if="msg.typing" class="typing-cursor"></span>
                  </span>
                </div>
              </div>
            </div>
            <div v-if="isLoading" class="ai-message assistant">
              <div class="ai-message-avatar">🤖</div>
              <div class="ai-message-content">
                <div class="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="ai-input-section">
          <div class="ai-input-wrapper">
            <textarea
              v-model="userInput"
              :placeholder="inputPlaceholder"
              :disabled="isLoading"
              @keydown.enter.exact.prevent="sendMessage"
              rows="2"
            ></textarea>
            <div class="ai-input-footer">
              <div class="ai-mode-selector">
                <span class="mode-icon">💡</span>
                <span class="mode-text">深度思考·自动</span>
              </div>
              <div class="ai-input-actions">
                <span class="char-count">{{ userInput.length }}/2000</span>
                <button 
                  class="ai-send-btn" 
                  :disabled="!userInput.trim() || isLoading"
                  @click="sendMessage"
                >
                  <span>发送</span>
                  <span class="send-icon">➤</span>
                </button>
              </div>
            </div>
          </div>
          <div class="ai-disclaimer">内容由 AI 生成，仅供参考 服务声明</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'

const isExpanded = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const inputPlaceholder = ref('请您描述问题或输入@选择技能')
const aiPanel = ref(null)

// 推荐问题
const recommendQuestions = ref([
  '电池安全如何保障？',
  '换电流程是怎样的？',
  '如何支付换电费用？',
  '会员有哪些专属福利？'
])

// 消息列表
const messages = reactive([])

// 打字机效果控制
const typingSpeed = 30 // 每个字符的显示间隔（毫秒）
const formatTypingText = (content, isTyping = false) => {
  if (!isTyping) return content
  return content
}

// DeepSeek API 配置
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 切换助手显示/隐藏
const toggleAssistant = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      // 聚焦到输入框
      const textarea = document.querySelector('.ai-input-section textarea')
      if (textarea) {
        textarea.focus()
      }
    })
  }
}

// 发送推荐问题
const sendQuestion = (question) => {
  userInput.value = question
  sendMessage()
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  
  // 构建消息历史（只包含 user 和 assistant 角色）
  const messageHistory = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }))
  
  // 添加当前用户消息
  messageHistory.push({
    role: 'user',
    content: userMessage
  })

  userInput.value = ''
  isLoading.value = true

  try {
    // 构建请求体
    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是 CitySwap 智能客服助手，专门解答关于电池换电、会员制度、费用支付等问题。请友好、专业地回答用户问题。'
        },
        ...messageHistory
      ],
      max_tokens: 1024,
      temperature: 0.7
    }
    
    console.log('发送请求:', {
      url: API_URL,
      apiKey: API_KEY ? `已配置 (${API_KEY.substring(0, 10)}...)` : '未配置',
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      messages: requestBody.messages.map((msg, idx) => ({
        index: idx,
        role: msg.role,
        contentLength: msg.content?.length,
        content: msg.content
      })),
      max_tokens: requestBody.max_tokens,
      temperature: requestBody.temperature
    })

    // 调用 DeepSeek AI API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('API 响应状态:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('DeepSeek API 错误详情:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      })
      throw new Error(`API 请求失败：${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'

    // 添加用户消息
    messages.push({
      role: 'user',
      content: userMessage
    })
    
    // 添加 AI 消息（初始为空，用于打字机效果）
    const aiMessageIndex = messages.length
    messages.push({
      role: 'assistant',
      content: '',
      typing: true
    })
    
    // 打字机效果显示
    let charIndex = 0
    const typeWriter = () => {
      if (charIndex < aiResponse.length) {
        messages[aiMessageIndex].content += aiResponse[charIndex]
        charIndex++
        setTimeout(typeWriter, typingSpeed)
      } else {
        messages[aiMessageIndex].typing = false
      }
    }
    
    // 开始打字机效果
    typeWriter()

  } catch (error) {
    console.error('AI 请求错误:', error)
    messages.push({
      role: 'assistant',
      content: '抱歉，网络开小差了，请稍后重试。'
    })
  } finally {
    isLoading.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  toggleAssistant
})
</script>

<style scoped>
.ai-assistant-container {
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 9999;
}

/* 主面板 */
.ai-main-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 480px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 头部 */
.ai-header {
  padding: 24px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
}

.ai-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar-large {
  font-size: 48px;
  line-height: 1;
}

.ai-title-large {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.ai-subtitle-large {
  font-size: 16px;
  color: #666;
  margin: 8px 0 0 0;
  text-align: left;
}

/* 窗口控制按钮 */
.ai-window-controls {
  position: absolute;
  top: 20px;
  right: 20px;
}

/* 关闭按钮 */
.ai-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #666;
  font-size: 18px;
  font-weight: bold;
}

.ai-close-btn:hover {
  background: #ffebee;
  border-color: #ef9a9a;
  color: #ff4444;
}

.ai-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
  border: 2px solid #fff;
}

.ai-title-section {
  flex: 1;
}

.ai-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.ai-subtitle {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* 推荐问题区域 */
.ai-recommend-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.ai-recommend-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(255, 152, 0, 0.15);
}

.ai-recommend-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.recommend-icon {
  font-size: 20px;
}

.recommend-title {
  font-size: 16px;
  font-weight: 600;
  color: #e65100;
}

.ai-recommend-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-recommend-item {
  padding: 14px 18px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.ai-recommend-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff8e1;
}

/* 聊天区域 */
.ai-chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
}

.ai-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ai-message.user {
  flex-direction: row-reverse;
}

.ai-message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.4);
  border: 2px solid #fff;
}

.ai-message-content {
  max-width: 320px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.ai-message.assistant .ai-message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ai-message.user .ai-message-content {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.4);
}

/* 打字动画 */
.ai-typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.ai-typing-indicator span {
  width: 8px;
  height: 8px;
  background: #ff6b9d;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.ai-typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 输入区域 */
.ai-input-section {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.ai-input-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px;
  background: #fafafa;
  transition: border-color 0.2s ease;
}

.ai-input-wrapper:focus-within {
  border-color: #4CAF50;
  background: white;
}

.ai-input-wrapper textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  font-family: inherit;
  color: #333;
}

.ai-input-wrapper textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.ai-mode-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f5f5f5;
  transition: all 0.2s ease;
}

.ai-mode-selector:hover {
  background: #fce4ec;
  color: #ff6b9d;
}

.mode-icon {
  font-size: 14px;
}

.ai-input-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.ai-send-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.5);
}

.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.send-icon {
  font-size: 16px;
}

.ai-disclaimer {
  text-align: center;
  font-size: 11px;
  color: #999;
  margin-top: 8px;
}

/* 动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* 打字机光标效果 */
.typing-cursor::after {
  content: '|';
  animation: blink 1s infinite;
  color: #4CAF50;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
