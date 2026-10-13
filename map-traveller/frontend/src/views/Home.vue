<template>
  <div class="min-h-screen bg-[#0f0f0f] relative overflow-hidden">
    <!-- Grid pattern overlay -->
    <div class="fixed inset-0 bg-grid pointer-events-none z-0" />

    <!-- Decorative silver orbs -->
    <div class="fixed top-20 left-10 w-[600px] h-[600px] bg-gray-500/[0.04] rounded-full blur-[120px] pointer-events-none z-0" />
    <div class="fixed bottom-20 right-10 w-[500px] h-[500px] bg-gray-400/[0.04] rounded-full blur-[100px] pointer-events-none z-0" />
    <div class="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-gray-500/[0.03] rounded-full blur-[100px] pointer-events-none z-0" />

    <!-- ===== HERO SECTION ===== -->
    <div class="relative z-10">
      <div class="bg-gradient-to-br from-[#1a1a1a] via-[#242424] to-[#1a1a1a] pt-12 pb-20 md:pt-20 md:pb-28 px-4 border-b border-white/[0.04]">
        <div class="max-w-5xl mx-auto text-center">
          <!-- Logo badge -->
          <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 shadow-xl shadow-gray-500/25 mb-6 animate-float">
            <span class="text-2xl md:text-3xl font-black text-white tracking-tight">M</span>
          </div>

          <!-- Animated gradient title -->
          <h1 class="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span class="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Map Traveller
            </span>
          </h1>

          <p class="text-lg md:text-xl text-gray-400/60 mb-10 font-medium tracking-wider">
            AI 智能旅行规划
          </p>

          <!-- Floating stat cards -->
          <div class="flex flex-wrap justify-center gap-4 md:gap-6">
            <div class="glass-card px-6 py-4 text-left min-w-[170px] hover:bg-white/[0.06] transition-all duration-300 hover:scale-105 animate-fade-in-up" style="animation-delay:0.1s">
              <div class="text-2xl mb-1">🤖</div>
              <div class="text-white font-bold text-sm">多 Agent 协作</div>
              <div class="text-gray-300 text-2xl font-black">3+</div>
              <div class="text-gray-400/40 text-xs">Agents</div>
            </div>
            <div class="glass-card px-6 py-4 text-left min-w-[170px] hover:bg-white/[0.06] transition-all duration-300 hover:scale-105 animate-fade-in-up" style="animation-delay:0.2s">
              <div class="text-2xl mb-1">⚡</div>
              <div class="text-white font-bold text-sm">实时流式响应</div>
              <div class="text-gray-300 text-2xl font-black">&lt;1s</div>
              <div class="text-gray-400/40 text-xs">延迟</div>
            </div>
            <div class="glass-card px-6 py-4 text-left min-w-[170px] hover:bg-white/[0.06] transition-all duration-300 hover:scale-105 animate-fade-in-up" style="animation-delay:0.3s">
              <div class="text-2xl mb-1">🗺️</div>
              <div class="text-white font-bold text-sm">地图可视化</div>
              <div class="text-gray-300 text-2xl font-black">2D/3D</div>
              <div class="text-gray-400/40 text-xs">渲染</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 -mt-6 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- ===== LEFT: STEP-BY-STEP WIZARD ===== -->
        <div class="space-y-5 animate-fade-in-up" style="animation-delay:0.1s">

          <el-form :model="formData" label-position="top" @submit.prevent="handleSubmit" class="space-y-5">

            <!-- Step 1: Destination & Dates -->
            <div class="step-card glass-card p-5 md:p-7 relative overflow-hidden transition-all duration-300 hover:bg-white/[0.05]">
              <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gray-400 to-gray-500 rounded-r-full" />
              <div class="flex items-center gap-3 mb-5">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-gray-500/25 flex-shrink-0">1</div>
                <h3 class="text-lg font-bold text-slate-100">目的地 & 日期</h3>
              </div>

              <el-form-item label="目的地城市" required>
                <el-input v-model="formData.city" placeholder="例如：北京、上海、成都" class="input-glass" size="large">
                  <template #prefix><el-icon><Location /></el-icon></template>
                </el-input>
              </el-form-item>

              <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="出发日期" required>
                    <el-date-picker v-model="formData.start_date" type="date" placeholder="选择日期" style="width: 100%" value-format="YYYY-MM-DD" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="返回日期" required>
                    <el-date-picker v-model="formData.end_date" type="date" placeholder="选择日期" style="width: 100%" value-format="YYYY-MM-DD" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-alert v-if="travelDays > 0" :title="`共 ${travelDays} 天行程`" type="info" :closable="false" show-icon class="!rounded-xl !mt-1" />
            </div>

            <!-- Step 2: Preferences -->
            <div class="step-card glass-card p-5 md:p-7 relative overflow-hidden transition-all duration-300 hover:bg-white/[0.05]">
              <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gray-500 to-gray-600 rounded-r-full" />
              <div class="flex items-center gap-3 mb-5">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-gray-500/25 flex-shrink-0">2</div>
                <h3 class="text-lg font-bold text-slate-100">偏好设置</h3>
              </div>

              <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="交通方式">
                    <el-select v-model="formData.transportation" style="width: 100%" size="large">
                      <el-option label="🚇 公共交通" value="公共交通" />
                      <el-option label="🚗 自驾" value="自驾" />
                      <el-option label="🚶 步行" value="步行" />
                      <el-option label="🔀 混合" value="混合" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="住宿偏好">
                    <el-select v-model="formData.accommodation" style="width: 100%" size="large">
                      <el-option label="💰 经济型酒店" value="经济型酒店" />
                      <el-option label="🏨 舒适型酒店" value="舒适型酒店" />
                      <el-option label="⭐ 豪华酒店" value="豪华酒店" />
                      <el-option label="🏡 民宿" value="民宿" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="旅行偏好" class="mt-1">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    v-for="pref in [{ e: '🏛️', l: '历史文化', v: '历史文化' }, { e: '🏞️', l: '自然风光', v: '自然风光' }, { e: '🍜', l: '美食', v: '美食' }, { e: '🛍️', l: '购物', v: '购物' }, { e: '🎨', l: '艺术', v: '艺术' }, { e: '☕', l: '休闲', v: '休闲' }]"
                    :key="pref.v"
                    :class="[
                      'pref-card rounded-xl px-4 py-3 text-center cursor-pointer select-none transition-all duration-200 border-2',
                      formData.preferences.includes(pref.v)
                        ? 'border-gray-400 bg-gray-500/10 shadow-lg shadow-gray-500/10'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                    ]"
                    @click="formData.preferences.includes(pref.v)
                      ? formData.preferences = formData.preferences.filter(p => p !== pref.v)
                      : formData.preferences.push(pref.v)"
                  >
                    <div class="text-2xl mb-1">{{ pref.e }}</div>
                    <div :class="['text-xs font-semibold transition-colors', formData.preferences.includes(pref.v) ? 'text-gray-300' : 'text-slate-400']">{{ pref.l }}</div>
                    <div v-if="formData.preferences.includes(pref.v)" class="mt-1.5">
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-500 text-white text-[10px] leading-none">&#10003;</span>
                    </div>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="额外要求">
                <el-input v-model="formData.free_text_input" type="textarea" :rows="3" placeholder="请输入您的额外要求，例如：想去看升旗、需要无障碍设施..." class="input-glass" />
              </el-form-item>
            </div>

            <!-- Step 3: Budget & Model -->
            <div class="step-card glass-card p-5 md:p-7 relative overflow-hidden transition-all duration-300 hover:bg-white/[0.05]">
              <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-r-full" />
              <div class="flex items-center gap-3 mb-5">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-zinc-500/25 flex-shrink-0">3</div>
                <h3 class="text-lg font-bold text-slate-100">预算 & 模型</h3>
              </div>

              <el-form-item label="预算范围">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">经济</span>
                  <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">奢华</span>
                </div>
                <el-slider v-model="formData.budget" range :min="500" :max="10000" :step="100" :format-tooltip="(val: number) => `¥${val}`" class="budget-slider" />
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[11px] text-slate-500">最低</span>
                    <span class="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">¥{{ formData.budget[0] }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-[11px] text-slate-500">最高</span>
                    <span class="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">¥{{ formData.budget[1] }}</span>
                  </div>
                </div>
                <div class="text-center mt-2">
                  <span
                    :class="[
                      'inline-block text-[11px] font-bold px-3 py-1 rounded-full tracking-wide border',
                      budgetLevel === '经济出行' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                      budgetLevel === '舒适旅行' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                      budgetLevel === '品质游玩' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                      budgetLevel === '高端体验' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                      'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    ]"
                  >{{ budgetLevel }}</span>
                </div>
              </el-form-item>

              <el-form-item label="AI 模型">
                <el-radio-group v-model="formData.llm_provider" class="llm-radio-group">
                  <el-radio label="deepseek">DeepSeek</el-radio>
                  <el-radio label="aliyun">阿里云百炼</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item class="!mb-0">
                <button v-if="!isLoading" class="btn-neon w-full" @click="handleSubmit">
                  <el-icon class="text-xl"><Promotion /></el-icon>
                  <span>开始规划行程</span>
                </button>
                <button v-else class="h-14 px-8 text-lg font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/25 hover:scale-105 hover:shadow-xl transition-all duration-300 w-full" @click="handleStop">
                  <el-icon><Close /></el-icon>
                  终止规划
                </button>
              </el-form-item>
            </div>

          </el-form>
        </div>

        <!-- ===== RIGHT: PROGRESS PANEL ===== -->
        <div v-if="isLoading || steps.length > 0" class="animate-fade-in-up lg:sticky lg:top-8 self-start" style="animation-delay:0.2s">
          <div class="glass-card p-5 md:p-7 relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.08] rounded-full blur-2xl opacity-70 pointer-events-none" />

            <div class="relative">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                  <el-icon class="text-white"><Loading /></el-icon>
                </div>
                <h3 class="text-lg font-bold text-slate-100">Agent 执行进度</h3>
              </div>

              <div class="space-y-0">
                <div v-for="(step, index) in steps" :key="index" class="relative flex gap-4 pb-6">
                  <div v-if="index < steps.length - 1" :class="['absolute left-[15px] top-8 w-0.5 transition-colors duration-500', index < steps.length - 1 && steps[index + 1] && step.status === 'completed' ? 'bg-emerald-500/30' : 'bg-white/[0.06]']" :style="{ height: 'calc(100% - 4px)' }" />

                  <div class="relative z-10 flex-shrink-0 mt-0.5">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300', step.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : step.status === 'running' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 step-pulse' : step.status === 'failed' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-white/[0.06] text-slate-500']">
                      <template v-if="step.status === 'completed'"><span class="text-xs">&#10003;</span></template>
                      <template v-else-if="step.status === 'running'"><el-icon class="is-loading text-xs"><Loading /></el-icon></template>
                      <template v-else-if="step.status === 'failed'"><span class="text-xs">&#10005;</span></template>
                      <template v-else><span class="text-[11px]">{{ index + 1 }}</span></template>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0 pt-0.5">
                    <div class="flex justify-between items-start gap-2">
                      <span :class="['font-semibold text-sm transition-colors', step.status === 'completed' ? 'text-emerald-300' : step.status === 'running' ? 'text-blue-300' : step.status === 'failed' ? 'text-red-300' : 'text-slate-500']">{{ getNodeName(step.node) }}</span>
                      <span :class="['text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap leading-none border', step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : step.status === 'running' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : step.status === 'failed' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-white/[0.04] text-slate-500 border-white/[0.06]']">
                        {{ step.status === 'running' ? '执行中' : step.status === 'completed' ? '完成' : step.status === 'failed' ? '失败' : '等待' }}
                      </span>
                    </div>
                    <div v-if="step.message" class="text-slate-400 text-xs mt-1 line-clamp-2">{{ step.message }}</div>
                    <div v-if="step.error" class="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <el-icon class="text-xs"><WarningFilled /></el-icon>{{ step.error }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="isLoading && currentMessage" class="flex items-center gap-2 p-3 bg-gray-500/10 rounded-xl text-gray-300 text-sm mt-1 border border-gray-500/20">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span class="text-xs">{{ currentMessage }}</span>
              </div>

              <div class="mt-5">
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="text-slate-500">总体进度</span>
                  <span class="font-bold text-slate-300">{{ progress }}%</span>
                </div>
                <div class="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full transition-all duration-500 ease-out', progress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : progress >= 80 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-gray-400 to-zinc-500']" :style="{ width: progress + '%' }" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="text-center mt-8 animate-fade-in-up" style="animation-delay:0.3s">
        <el-button class="!rounded-xl !border !border-white/[0.1] !text-slate-400 hover:!bg-gray-500/10 hover:!text-gray-300 hover:!border-gray-500/30 !transition-all !px-6 !py-2 !font-medium" text @click="$router.push('/chat')">
          <el-icon><ChatDotRound /></el-icon>
          切换到对话模式
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, Promotion, Loading, WarningFilled, ChatDotRound, Close } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useTripStore } from '@/stores/trip'
import type { TripRequest, AgentStep } from '@/types'

const router = useRouter()
const tripStore = useTripStore()

const formData = ref<TripRequest>({
  city: '',
  start_date: '',
  end_date: '',
  travel_days: 1,
  transportation: '公共交通',
  accommodation: '经济型酒店',
  preferences: [],
  free_text_input: '',
  llm_provider: 'deepseek',
  budget: [1000, 3000] as [number, number]
})

const isLoading = ref(false)
const isStopped = ref(false)
const steps = ref<AgentStep[]>([])
const progress = ref(0)
const currentStep = ref('')
const currentMessage = ref('')
const abortController = ref<AbortController | null>(null)

const travelDays = computed(() => {
  if (formData.value.start_date && formData.value.end_date) {
    const start = dayjs(formData.value.start_date)
    const end = dayjs(formData.value.end_date)
    const days = end.diff(start, 'day') + 1
    return days > 0 ? days : 0
  }
  return 0
})

const budgetLevel = computed(() => {
  const max = formData.value.budget[1]
  if (max <= 1500) return '经济出行'
  if (max <= 3000) return '舒适旅行'
  if (max <= 5000) return '品质游玩'
  if (max <= 8000) return '高端体验'
  return '奢华之旅'
})

watch(travelDays, (days) => { formData.value.travel_days = days })

function getNodeName(node: string): string {
  const names: Record<string, string> = {
    'init': '🚀 初始化', 'poi_search': '🔍 景点搜索', 'weather': '🌤️ 天气查询',
    'hotel': '🏨 酒店推荐', 'planner': '📋 行程规划', 'human_review': '👤 等待审核',
    'complete': '✅ 完成', 'stopped': '⏹️ 已终止', 'error': '❌ 错误'
  }
  return names[node] || node
}

async function handleSubmit() {
  if (!formData.value.city || !formData.value.start_date || !formData.value.end_date) {
    ElMessage.warning('请填写完整信息')
    return
  }

  isLoading.value = true; isStopped.value = false
  steps.value = []; progress.value = 0
  currentStep.value = '正在准备...'; currentMessage.value = '正在初始化...'

  const sessionId = `session_${Date.now()}`
  tripStore.setSessionId(sessionId)
  abortController.value = new AbortController()

  try {
    const baseUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')
    const response = await fetch(`${baseUrl}/api/trip/plan/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData.value, session_id: sessionId }),
      signal: abortController.value.signal
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('无法读取响应流')

    const decoder = new TextDecoder(); let buffer = ''

    while (true) {
      if (isStopped.value) { reader.cancel(); break }
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n'); buffer = lines.pop() || ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try { const data = JSON.parse(line.slice(6)); handleStreamEvent(data) } catch (e) {}
        }
      }
    }
    if (buffer.startsWith('data: ')) {
      try { const data = JSON.parse(buffer.slice(6)); handleStreamEvent(data) } catch (e) {}
    }
  } catch (error: any) {
    if (error.name === 'AbortError') { ElMessage.info('已终止规划'); steps.value.push({ node: 'stopped', status: 'failed', message: '用户终止' }) }
    else { ElMessage.error(error.message || '请求失败'); tripStore.addError(error.message); steps.value.push({ node: 'error', status: 'failed', error: error.message }) }
  } finally { isLoading.value = false; abortController.value = null }
}

function handleStreamEvent(data: any) {
  if (data.message) currentMessage.value = data.message
  if (data.step) progress.value = Math.min(data.step * 10, 90)
  if (data.node) {
    const existingIndex = steps.value.findIndex(s => s.node === data.node)
    const step: AgentStep = { node: data.node, status: data.status, message: data.message, data: data.data }
    if (existingIndex >= 0) steps.value[existingIndex] = step
    else steps.value.push(step)
  }
  if (data.node === 'complete' && data.status === 'completed') {
    progress.value = 100
    if (data.data?.itinerary) {
      tripStore.setTripPlan(data.data.itinerary as any)
      tripStore.setStatus('completed')
      tripStore.setNeedHumanReview(false)
      ElMessage.success('行程规划完成！')
      setTimeout(() => router.push('/result'), 500)
    }
  }
  if (data.status === 'failed' || data.node === 'error') ElMessage.error(data.message || '规划失败')
}

function handleStop() {
  if (abortController.value) { isStopped.value = true; abortController.value.abort() }
}
</script>

<style scoped>
.step-card { transition: box-shadow 0.3s ease, transform 0.2s ease; }
.pref-card:active { transform: scale(0.96); }
.llm-radio-group { display: flex; gap: 12px; }

.llm-radio-group :deep(.el-radio) {
  flex: 1; margin-right: 0; padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px;
  transition: all 0.2s ease; height: auto; display: flex; align-items: center;
  background: rgba(255, 255, 255, 0.02);
}
.llm-radio-group :deep(.el-radio.is-checked) {
  border-color: #a0a0a0; background: rgba(160, 160, 160, 0.12);
}
.llm-radio-group :deep(.el-radio__label) { font-weight: 600; font-size: 14px; }

@media (max-width: 1023px) {
  .lg\:sticky { position: relative; top: auto; }
}
</style>
