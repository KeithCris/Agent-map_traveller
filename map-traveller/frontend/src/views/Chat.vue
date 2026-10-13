<template>
  <div class="h-screen bg-[#0f0f0f] relative flex overflow-hidden">
    <!-- Grid + orbs -->
    <div class="fixed inset-0 bg-grid pointer-events-none z-0" />
    <div class="fixed top-20 left-10 w-[600px] h-[600px] bg-gray-500/[0.04] rounded-full blur-[120px] pointer-events-none z-0" />
    <div class="fixed bottom-20 right-10 w-[500px] h-[500px] bg-gray-400/[0.03] rounded-full blur-[100px] pointer-events-none z-0" />

    <!-- Mobile sidebar toggle -->
    <input type="checkbox" id="sidebar-toggle" class="sr-only peer/sidebar" />
    <label for="sidebar-toggle" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 hidden peer-checked/sidebar:block lg:hidden transition-opacity duration-300" />

    <!-- ===== SIDEBAR ===== -->
    <aside class="fixed lg:static z-30 h-full w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.06] flex flex-col -translate-x-full lg:translate-x-0 peer-checked/sidebar:translate-x-0 transition-transform duration-300 ease-out shadow-2xl lg:shadow-none flex-shrink-0">
      <div class="px-5 pt-6 pb-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xl shadow-lg shadow-gray-500/25 flex-shrink-0">M</div>
        <div class="min-w-0">
          <h1 class="text-lg font-bold text-slate-100 leading-tight truncate">Map Traveller</h1>
          <p class="text-[11px] text-slate-500">AI 旅行规划助手</p>
        </div>
      </div>

      <div class="mx-5 border-t border-white/[0.06]" />

      <div v-if="tripStore.sessionId" class="px-5 py-4">
        <h4 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">当前行程</h4>
        <div class="bg-white/[0.03] rounded-xl p-3.5 border border-white/[0.06] space-y-2">
          <div v-if="currentCity" class="flex items-center gap-2.5">
            <span class="text-base flex-shrink-0">📍</span>
            <span class="text-sm font-medium text-slate-300 truncate">{{ currentCity }}</span>
          </div>
          <div v-if="currentDates" class="flex items-center gap-2.5">
            <span class="text-base flex-shrink-0">📅</span>
            <span class="text-xs text-slate-400 truncate">{{ currentDates }}</span>
          </div>
          <div class="flex items-center gap-2.5">
            <span class="text-base flex-shrink-0">🤖</span>
            <span class="text-xs text-slate-400">{{ llmProvider === 'deepseek' ? 'DeepSeek' : '阿里云百炼' }}</span>
          </div>
        </div>
      </div>

      <div class="mx-5 border-t border-white/[0.06]" />

      <div class="px-5 py-4 flex-1 overflow-auto">
        <h4 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">快捷指令</h4>
        <div class="space-y-0.5">
          <div v-for="cmd in quickCommands" :key="cmd.label" class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.06] group" @click="handleQuickCommand(cmd.text)">
            <span class="text-base flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{{ cmd.label.split(' ')[0] }}</span>
            <span class="text-sm text-slate-400 group-hover:text-slate-200 transition-colors truncate">{{ cmd.label.split(' ').slice(1).join(' ') }}</span>
          </div>
        </div>
      </div>

      <div class="px-5 py-4 border-t border-white/[0.06] space-y-1">
        <button class="flex items-center gap-2.5 w-full text-sm text-slate-400 hover:text-gray-300 transition-colors px-3 py-2 rounded-xl hover:bg-white/[0.04]" @click="handleNewChat">
          <span class="text-base flex-shrink-0">✨</span>
          <span>新对话</span>
        </button>
        <button class="flex items-center gap-2.5 w-full text-sm text-slate-400 hover:text-gray-300 transition-colors px-3 py-2 rounded-xl hover:bg-white/[0.04]" @click="$router.push('/')">
          <span class="text-base flex-shrink-0">📝</span>
          <span>切换到表单模式</span>
        </button>
      </div>
    </aside>

    <!-- Mobile toggle button -->
    <label for="sidebar-toggle" class="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] shadow-xl flex items-center justify-center cursor-pointer lg:hidden hover:scale-105 active:scale-95 transition-all duration-200">
      <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </label>

    <!-- ===== MAIN CHAT ===== -->
    <div class="flex-1 flex flex-col relative z-10 min-w-0">
      <div ref="messageListRef" class="flex-1 overflow-y-auto px-4 py-6">

        <!-- Welcome screen -->
        <div v-if="!chatStore.hasMessages" class="flex flex-col items-center justify-center h-full text-center px-4">
          <div class="relative mb-6">
            <div class="text-7xl animate-bounce">🌍</div>
            <div class="absolute -top-2 -right-3 text-3xl animate-pulse">✨</div>
          </div>
          <h2 class="text-3xl font-bold text-slate-100 mb-2 tracking-tight">Where to next?</h2>
          <p class="text-slate-400 mb-8 max-w-md leading-relaxed">告诉我您的旅行心愿，AI 为您量身打造专属行程</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
            <div v-for="(card, idx) in exampleCards" :key="idx" class="group relative glass-card p-4 cursor-pointer hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 text-left" @click="handleQuickCommand(card.text)">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-lg mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300" :class="card.gradient">
                {{ card.emoji }}
              </div>
              <h3 class="text-sm font-semibold text-slate-200 mb-1">{{ card.title }}</h3>
              <p class="text-xs text-slate-500 line-clamp-2">{{ card.subtitle }}</p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-for="(msg, index) in chatStore.messages" :key="index" :class="['flex mb-5 animate-fade-in-up', msg.role === 'user' ? 'justify-end' : 'justify-start']">
          <template v-if="msg.role === 'assistant'">
            <div class="flex items-start gap-3 max-w-[80%]">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm flex-shrink-0 shadow-lg shadow-gray-500/25">AI</div>
              <div class="min-w-0">
                <div class="glass-card rounded-2xl rounded-tl-sm px-4 py-3 !border-l-[3px] !border-l-gray-500">
                  <div class="text-sm leading-relaxed text-slate-300" v-html="renderMarkdown(msg.content)" />
                </div>
                <div class="text-[11px] text-slate-600 mt-1 ml-1">{{ formatTime(msg.timestamp) }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="max-w-[75%]">
              <div class="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg shadow-gray-500/25">
                <div class="text-sm leading-relaxed" v-html="renderMarkdown(msg.content)" />
              </div>
              <div class="text-[11px] text-slate-600 mt-1 mr-1 text-right">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </template>
        </div>

        <!-- Loading -->
        <div v-if="chatStore.isLoading" class="flex items-start gap-3 mb-5 animate-fade-in-up">
          <div class="relative flex-shrink-0">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm shadow-lg shadow-gray-500/25">AI</div>
          </div>
          <div class="glass-card rounded-2xl rounded-tl-sm px-4 py-3 !border-l-[3px] !border-l-gray-500 flex items-center gap-3">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s" />
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s" />
            </div>
            <span class="text-sm text-slate-400">Map Traveller 正在思考...</span>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="px-4 pb-5 pt-2">
        <div class="max-w-3xl mx-auto">
          <div class="flex justify-center mb-3 gap-1.5">
            <button :class="['px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border', llmProvider === 'deepseek' ? 'bg-gray-500/15 text-gray-300 border-gray-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]']" @click="llmProvider = 'deepseek'">🧠 DeepSeek</button>
            <button :class="['px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border', llmProvider === 'aliyun' ? 'bg-gray-500/15 text-gray-300 border-gray-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]']" @click="llmProvider = 'aliyun'">☁️ 阿里云百炼</button>
          </div>

          <div class="relative glass-card !rounded-3xl focus-within:!border-gray-500/50 focus-within:!ring-4 focus-within:!ring-gray-500/10 flex items-end gap-2 p-2.5 mx-2">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="2"
              :disabled="chatStore.isLoading"
              placeholder="描述您的旅行心愿..."
              class="!border-0 !shadow-none !bg-transparent [&_.el-textarea__inner]:!border-0 [&_.el-textarea__inner]:!shadow-none [&_.el-textarea__inner]:!bg-transparent [&_.el-textarea__inner]:!resize-none [&_.el-textarea__inner]:placeholder:text-slate-600 [&_.el-textarea__inner]:!text-sm [&_.el-textarea__inner]:!text-slate-200"
              @keydown.enter.ctrl="handleSend"
            />
            <button
              :disabled="!inputMessage.trim() || chatStore.isLoading"
              class="rounded-full bg-gradient-to-r from-gray-500 to-gray-600 border-0 shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 hover:scale-105 active:scale-95 transition-all duration-200 h-11 w-11 p-0 flex items-center justify-center text-white disabled:opacity-30 disabled:shadow-none disabled:hover:scale-100 flex-shrink-0"
              @click="handleSend"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <div class="text-[11px] text-slate-600 mt-2.5 text-center">
            按 <kbd class="px-1.5 py-0.5 bg-white/[0.06] rounded text-[10px] font-mono text-slate-500 border border-white/[0.08]">Ctrl + Enter</kbd> 发送消息
          </div>
        </div>
      </div>
    </div>

    <!-- Trip result drawer -->
    <el-drawer v-model="showTripDrawer" direction="rtl" size="40%" :with-header="false">
      <div v-if="tripStore.tripPlan" class="h-full flex flex-col">
        <div class="text-center pt-8 pb-5 px-6 bg-gradient-to-b from-amber-500/[0.05] to-transparent">
          <div class="text-5xl mb-3 animate-bounce">🎉</div>
          <h2 class="text-2xl font-bold text-slate-100 mb-1 tracking-tight">行程已就绪！</h2>
          <p class="text-sm text-slate-400">AI 已为您精心规划了旅行方案</p>
        </div>

        <div class="px-6 flex-1 flex flex-col">
          <div class="glass-card p-5 mb-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xl shadow-lg shadow-gray-500/25 flex-shrink-0">✈️</div>
              <div class="min-w-0">
                <h3 class="text-lg font-bold text-slate-100 truncate">{{ tripStore.tripPlan.city }}</h3>
                <p class="text-sm text-slate-400">{{ tripStore.tripPlan.travel_days }} 天行程</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
                <div class="text-xl font-bold text-gray-300">{{ tripStore.tripPlan.travel_days }}</div>
                <div class="text-xs text-slate-500 mt-0.5">旅行天数</div>
              </div>
              <div class="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.06]">
                <div class="text-xl font-bold text-gray-300">📍</div>
                <div class="text-xs text-slate-500 mt-0.5 truncate">{{ tripStore.tripPlan.city }}</div>
              </div>
            </div>
          </div>

          <button class="btn-neon w-full" @click="handleViewDetail">查看完整行程 →</button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/stores/chat'
import { useTripStore } from '@/stores/trip'
import { sendChatMessage } from '@/services/api'

const router = useRouter()
const chatStore = useChatStore()
const tripStore = useTripStore()

const inputMessage = ref('')
const llmProvider = ref<'deepseek' | 'aliyun'>('deepseek')
const messageListRef = ref<HTMLElement>()
const showTripDrawer = ref(false)

const quickCommands = [
  { label: '🏛️ 历史文化', text: '我对历史文化景点感兴趣' },
  { label: '🏞️ 自然风光', text: '我想看自然风光' },
  { label: '🍜 美食之旅', text: '帮我规划一个美食之旅' },
  { label: '💰 省钱攻略', text: '帮我规划一个经济实惠的行程' }
]

const examples = [
  '帮我规划一个北京三日游，想看故宫和长城',
  '我想去成都玩，喜欢美食和熊猫',
  '上海两日游，预算2000元以内',
  '杭州西湖一日游，自驾出行'
]

const exampleCards = [
  { emoji: '🏛️', title: '历史文化', subtitle: '北京三日游，探访故宫与长城', gradient: 'from-amber-400 to-orange-500', text: examples[0] },
  { emoji: '🐼', title: '美食自然', subtitle: '成都逛吃看熊猫，巴适得板', gradient: 'from-emerald-400 to-teal-500', text: examples[1] },
  { emoji: '💰', title: '城市精算', subtitle: '上海两日游，预算2000以内', gradient: 'from-violet-400 to-purple-500', text: examples[2] },
  { emoji: '🚗', title: '自驾漫游', subtitle: '杭州西湖一日游，随心自驾', gradient: 'from-cyan-400 to-blue-500', text: examples[3] }
]

const currentCity = computed(() => tripStore.tripPlan?.city || '')
const currentDates = computed(() => {
  if (tripStore.tripPlan?.start_date && tripStore.tripPlan?.end_date) {
    return `${tripStore.tripPlan.start_date} ~ ${tripStore.tripPlan.end_date}`
  }
  return ''
})

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  })
}

async function handleSend() {
  const message = inputMessage.value.trim()
  if (!message || chatStore.isLoading) return

  inputMessage.value = ''
  chatStore.addMessage('user', message)
  chatStore.setLoading(true)
  scrollToBottom()

  try {
    if (!chatStore.sessionId) {
      const sessionId = `chat_${Date.now()}`
      chatStore.setSessionId(sessionId)
      tripStore.setSessionId(sessionId)
    }
    const response = await sendChatMessage({ session_id: chatStore.sessionId, message, llm_provider: llmProvider.value })
    chatStore.addMessage('assistant', response.response)
    scrollToBottom()
    if (response.trip_plan) { tripStore.setTripPlan(response.trip_plan as any); showTripDrawer.value = true }
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
    chatStore.addMessage('assistant', '抱歉，我遇到了一些问题，请稍后再试。')
  } finally { chatStore.setLoading(false) }
}

function handleQuickCommand(text: string) { inputMessage.value = text; handleSend() }
function handleNewChat() { chatStore.reset(); tripStore.reset(); ElMessage.success('已开始新对话') }
function handleViewDetail() { showTripDrawer.value = false; router.push('/result') }

watch(() => chatStore.messages.length, () => scrollToBottom())
onMounted(() => scrollToBottom())
</script>

<style scoped>
:deep(.el-textarea__inner) {
  border: 0 !important; box-shadow: none !important;
  background: transparent !important; resize: none !important;
}
</style>
