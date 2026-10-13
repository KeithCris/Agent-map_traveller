<template>
  <div class="min-h-screen bg-[#0f0f0f] relative">
    <!-- Grid + orbs -->
    <div class="fixed inset-0 bg-grid pointer-events-none z-0" />
    <div class="fixed top-20 left-10 w-[600px] h-[600px] bg-gray-500/[0.04] rounded-full blur-[120px] pointer-events-none z-0" />
    <div class="fixed bottom-20 right-10 w-[500px] h-[500px] bg-gray-400/[0.03] rounded-full blur-[100px] pointer-events-none z-0" />

    <!-- ===== HEADER ===== -->
    <header class="sticky top-0 z-40 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <el-button class="!rounded-xl !border !border-white/[0.1] !text-slate-400 hover:!bg-gray-500/10 hover:!text-gray-300 hover:!border-gray-500/30 !transition-all !px-4" text @click="$router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="flex flex-col">
          <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.2em]">Trip to</span>
          <h1 class="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <el-icon class="text-gray-400 !text-2xl"><MapLocation /></el-icon>
            {{ tripPlan.city }}
          </h1>
        </div>
      </div>
      <div class="flex gap-3">
        <el-button class="!rounded-xl !border !border-white/[0.1] !text-slate-400 hover:!bg-indigo-500/10 hover:!text-indigo-300 hover:!border-indigo-500/30 !transition-all !px-5" @click="handleExportPDF">
          <el-icon><Download /></el-icon>
          导出PDF
        </el-button>
        <el-button class="!rounded-xl" type="primary" @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重新规划
        </el-button>
      </div>
    </header>

    <div class="relative z-10 max-w-7xl mx-auto px-4 py-6">
      <!-- Empty state -->
      <div v-if="!tripPlan" class="flex justify-center items-center min-h-[400px]">
        <el-empty description="暂无行程数据">
          <el-button type="primary" class="!rounded-xl" @click="$router.push('/')">开始规划</el-button>
        </el-empty>
      </div>

      <div v-else>
        <!-- ===== KPI CARDS ===== -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="glass-card p-5 flex items-center gap-4 animate-fade-in-up" style="animation-delay:0.05s">
            <div class="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center shrink-0 border border-gray-500/20">
              <el-icon class="text-gray-400 text-xl"><Calendar /></el-icon>
            </div>
            <div class="min-w-0">
              <p class="text-xs text-slate-500 font-medium truncate">行程天数</p>
              <p class="text-2xl font-extrabold text-slate-100">{{ tripPlan.days?.length || 0 }}<span class="text-sm font-normal text-slate-500 ml-0.5">天</span></p>
            </div>
          </div>
          <div class="glass-card p-5 flex items-center gap-4 animate-fade-in-up" style="animation-delay:0.1s">
            <div class="w-12 h-12 rounded-xl bg-zinc-500/10 flex items-center justify-center shrink-0 border border-zinc-500/20">
              <el-icon class="text-zinc-400 text-xl"><Location /></el-icon>
            </div>
            <div class="min-w-0">
              <p class="text-xs text-slate-500 font-medium truncate">目的地</p>
              <p class="text-xl font-extrabold text-slate-100 truncate">{{ tripPlan.city }}</p>
            </div>
          </div>
          <div class="glass-card p-5 flex items-center gap-4 animate-fade-in-up" style="animation-delay:0.15s">
            <div class="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center shrink-0 border border-gray-500/20">
              <el-icon class="text-gray-400 text-xl"><Clock /></el-icon>
            </div>
            <div class="min-w-0">
              <p class="text-xs text-slate-500 font-medium truncate">出行日期</p>
              <p class="text-sm font-bold text-slate-300 truncate">{{ tripPlan.start_date }} — {{ tripPlan.end_date }}</p>
            </div>
          </div>
          <div class="glass-card p-5 flex items-center gap-4 animate-fade-in-up" style="animation-delay:0.2s">
            <div class="w-12 h-12 rounded-xl bg-zinc-500/10 flex items-center justify-center shrink-0 border border-zinc-500/20">
              <el-icon class="text-zinc-400 text-xl"><Sunny /></el-icon>
            </div>
            <div class="min-w-0">
              <p class="text-xs text-slate-500 font-medium truncate">出行天气</p>
              <p class="text-sm font-bold text-slate-300 truncate">{{ tripPlan.weather || '适宜出行' }}</p>
            </div>
          </div>
        </div>

        <!-- ===== TWO COLUMN LAYOUT ===== -->
        <div class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
          <!-- LEFT -->
          <div class="space-y-5">
            <!-- Map -->
            <div class="glass-card overflow-hidden animate-fade-in-up" style="animation-delay:0.05s">
              <div class="flex items-center gap-2 px-6 pt-5 pb-3">
                <el-icon class="text-gray-400 text-lg"><MapLocation /></el-icon>
                <h3 class="text-base font-bold text-slate-100">景点地图</h3>
              </div>
              <div id="map-container" class="w-full h-[500px] bg-white/[0.02]" />
            </div>

            <!-- Itinerary Days -->
            <div v-for="(day, index) in tripPlan.days" :key="index" :id="'day-'+index" class="glass-card overflow-hidden animate-fade-in-up" :style="'animation-delay:' + (0.1 + index * 0.05) + 's'">
              <div class="relative px-6 pt-5 pb-4 border-b border-white/[0.06]">
                <div class="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-r-full" />
                <div class="pl-4">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-extrabold text-white bg-gradient-to-r from-gray-400 to-gray-600 px-2.5 py-0.5 rounded-lg">Day {{ day.day_index + 1 }}</span>
                    <span class="text-sm text-slate-400">{{ day.date }}</span>
                  </div>
                  <h3 class="text-lg font-extrabold text-slate-100">{{ day.description }}</h3>
                </div>
              </div>

              <div class="px-6 py-5 space-y-6">
                <!-- Attractions -->
                <div v-if="day.attractions && day.attractions.length > 0">
                  <h4 class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    <el-icon class="text-indigo-400"><MapLocation /></el-icon>景点路线
                  </h4>
                  <div class="space-y-3">
                    <div v-for="(attraction, attrIndex) in day.attractions" :key="attrIndex" class="group flex gap-4">
                      <div class="flex flex-col items-center shrink-0">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center text-xs font-extrabold shadow-lg shadow-gray-500/25 group-hover:scale-110 transition-transform duration-300">{{ attrIndex + 1 }}</div>
                        <div v-if="attrIndex < day.attractions.length - 1" class="w-0.5 flex-1 bg-gradient-to-b from-gray-500/20 to-transparent mt-1 min-h-[12px]" />
                      </div>
                      <div class="flex-1 pb-4">
                        <div class="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-gray-500/30 transition-all duration-300 relative overflow-hidden">
                          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                          <div class="flex justify-between items-start mb-2">
                            <h5 class="font-bold text-slate-100">{{ attraction.name }}</h5>
                            <el-tag v-if="attraction.category" size="small" effect="plain" class="!rounded-lg">{{ attraction.category }}</el-tag>
                          </div>
                          <p v-if="attraction.description" class="text-slate-400 text-sm mb-3 leading-relaxed">{{ attraction.description }}</p>
                          <div class="flex flex-wrap gap-3 text-slate-500 text-xs">
                            <span v-if="attraction.visit_duration" class="flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06]">
                              <el-icon><Clock /></el-icon>约{{ attraction.visit_duration }}分钟
                            </span>
                            <span v-if="attraction.ticket_price" class="flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06]">
                              <el-icon><Ticket /></el-icon>¥{{ attraction.ticket_price }}
                            </span>
                          </div>
                          <div class="flex items-center gap-1.5 text-slate-500 text-xs mt-2.5">
                            <el-icon class="text-sm"><Location /></el-icon>
                            <span class="truncate">{{ attraction.address }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Meals -->
                <div v-if="day.meals && day.meals.length > 0" class="pt-1">
                  <h4 class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    <el-icon class="text-gray-400"><Food /></el-icon>餐饮推荐
                  </h4>
                  <div class="grid grid-cols-3 gap-3">
                    <div v-for="(meal, mealIndex) in day.meals" :key="mealIndex" class="rounded-2xl border border-gray-500/10 bg-gray-500/[0.03] px-3 py-4 text-center hover:border-gray-500/30 hover:bg-gray-500/[0.06] transition-all duration-300 group cursor-default">
                      <div class="w-8 h-8 mx-auto rounded-full bg-gray-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 border border-gray-500/20">
                        <el-icon class="text-gray-400 text-sm"><Food /></el-icon>
                      </div>
                      <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{{ meal.type === 'breakfast' ? '早餐' : meal.type === 'lunch' ? '午餐' : '晚餐' }}</div>
                      <div class="font-bold text-slate-200 text-sm mt-1 leading-tight">{{ meal.name }}</div>
                      <div class="text-xs text-slate-500 mt-0.5 leading-tight">{{ meal.description }}</div>
                      <div v-if="meal.estimated_cost" class="text-xs text-gray-300 font-bold mt-2">¥{{ meal.estimated_cost }}</div>
                    </div>
                  </div>
                </div>

                <!-- Hotel -->
                <div v-if="day.hotel" class="pt-1">
                  <h4 class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    <el-icon class="text-gray-400"><House /></el-icon>住宿安排
                  </h4>
                  <div class="rounded-2xl bg-gradient-to-br from-gray-500/[0.04] to-zinc-500/[0.02] border border-gray-500/10 p-5 relative overflow-hidden">
                    <div class="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gray-500/[0.05]" />
                    <div class="relative">
                      <div class="flex items-start justify-between mb-3">
                        <div class="font-extrabold text-slate-100 text-lg">{{ day.hotel.name }}</div>
                        <span v-if="day.hotel.rating" class="flex items-center gap-1 bg-amber-500/10 text-amber-300 text-xs font-bold px-2 py-1 rounded-lg border border-amber-500/20 shrink-0">
                          <el-icon class="text-sm"><Star /></el-icon>{{ day.hotel.rating }}
                        </span>
                      </div>
                      <div class="flex flex-wrap gap-2 text-xs mb-3">
                        <span v-if="day.hotel.type" class="bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06] text-slate-400">{{ day.hotel.type }}</span>
                        <span v-if="day.hotel.price_range" class="bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06] text-slate-400">{{ day.hotel.price_range }}</span>
                      </div>
                      <div v-if="day.hotel.address" class="flex items-center gap-1.5 text-slate-400 text-sm">
                        <el-icon class="text-gray-500"><Location /></el-icon>{{ day.hotel.address }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="hidden lg:block">
            <div class="sticky top-24 space-y-5">
              <!-- Day nav -->
              <div v-if="tripPlan.days && tripPlan.days.length > 0" class="glass-card p-5 animate-fade-in-up" style="animation-delay:0.05s">
                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <el-icon class="text-gray-400"><Calendar /></el-icon>行程导航
                </h3>
                <div class="space-y-2">
                  <button v-for="(day, index) in tripPlan.days" :key="index" @click="activeDays = [index]; document.getElementById('day-'+index)?.scrollIntoView({behavior:'smooth', block:'start'})" class="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 group" :class="activeDays[0] === index ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25' : 'text-slate-400 hover:bg-white/[0.04]'">
                    <span class="text-lg font-extrabold w-7 text-center shrink-0" :class="activeDays[0] === index ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'">{{ day.day_index + 1 }}</span>
                    <div class="min-w-0">
                      <p class="font-bold text-sm truncate">Day {{ day.day_index + 1 }}</p>
                      <p class="text-xs truncate" :class="activeDays[0] === index ? 'text-blue-100' : 'text-slate-500'">{{ day.date }}</p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Budget -->
              <div v-if="tripPlan.budget" class="glass-card p-5 animate-fade-in-up" style="animation-delay:0.1s">
                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <el-icon class="text-gray-400"><Wallet /></el-icon>预算估算
                </h3>
                <div class="space-y-4">
                  <div>
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-slate-500 font-medium flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-gray-400 inline-block" />景点门票
                      </span>
                      <span class="text-slate-300 font-bold">¥{{ tripPlan.budget.total_attractions?.toLocaleString() }}</span>
                    </div>
                    <div class="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-700" :style="{ width: pct(tripPlan.budget.total_attractions, tripPlan.budget.total) + '%' }" />
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-slate-500 font-medium flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-zinc-400 inline-block" />住宿费用
                      </span>
                      <span class="text-slate-300 font-bold">¥{{ tripPlan.budget.total_hotels?.toLocaleString() }}</span>
                    </div>
                    <div class="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-zinc-400 to-zinc-500 rounded-full transition-all duration-700" :style="{ width: pct(tripPlan.budget.total_hotels, tripPlan.budget.total) + '%' }" />
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-slate-500 font-medium flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-gray-500 inline-block" />餐饮费用
                      </span>
                      <span class="text-slate-300 font-bold">¥{{ tripPlan.budget.total_meals?.toLocaleString() }}</span>
                    </div>
                    <div class="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-700" :style="{ width: pct(tripPlan.budget.total_meals, tripPlan.budget.total) + '%' }" />
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-slate-500 font-medium flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-zinc-500 inline-block" />交通费用
                      </span>
                      <span class="text-slate-300 font-bold">¥{{ tripPlan.budget.total_transportation?.toLocaleString() }}</span>
                    </div>
                    <div class="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-zinc-400 to-zinc-500 rounded-full transition-all duration-700" :style="{ width: pct(tripPlan.budget.total_transportation, tripPlan.budget.total) + '%' }" />
                    </div>
                  </div>
                </div>
                <div class="mt-5 pt-5 border-t border-white/[0.06] text-center">
                  <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.2em] mb-1">Total Budget</p>
                  <p class="text-4xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">¥{{ tripPlan.budget.total?.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div v-if="tripPlan.overall_suggestions" class="mt-6 glass-card p-6 animate-fade-in-up" style="animation-delay:0.3s">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-gray-500/20">
              <el-icon class="text-gray-400 text-lg"><Warning /></el-icon>
            </div>
            <div>
              <h3 class="text-sm font-extrabold text-slate-200 mb-2 uppercase tracking-wide">旅行建议</h3>
              <p class="leading-relaxed text-slate-400 text-sm">{{ tripPlan.overall_suggestions }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Dialog -->
    <el-dialog v-model="showReviewDialog" width="540px" :close-on-click-modal="false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center border border-gray-500/20">
            <el-icon class="text-gray-400 text-lg"><Ticket /></el-icon>
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-slate-100 leading-tight">确认您的行程</h3>
            <p class="text-xs text-slate-400 mt-0.5">请仔细核对后确认预订</p>
          </div>
        </div>
      </template>

      <div class="space-y-5 py-2">
        <div class="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
          <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.2em] mb-3">行程概要</p>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500/10 text-gray-300 rounded-xl text-sm font-bold border border-gray-500/20">
              <el-icon class="text-sm"><Location /></el-icon>{{ tripPlan.city }}
            </span>
            <span class="text-slate-600 hidden sm:inline">|</span>
            <span class="text-sm text-slate-400 font-medium">{{ tripPlan.days?.length || 0 }} 天行程</span>
            <span class="text-slate-600 hidden sm:inline">|</span>
            <span class="text-sm text-slate-400">{{ tripPlan.start_date }} — {{ tripPlan.end_date }}</span>
          </div>
        </div>

        <el-alert title="请确认您的行程安排" type="info" description="AI已为您生成行程规划，请仔细核对后确认。" :closable="false" show-icon class="!rounded-2xl !border !border-gray-500/20 !bg-gray-500/[0.06]" />

        <div>
          <p class="text-xs text-slate-400 font-medium mb-2">修改意见（选填）</p>
          <el-input v-model="reviewComment" type="textarea" :rows="3" placeholder="如有修改意见，请在此输入..." />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between gap-3">
          <el-button class="!rounded-xl !border !border-white/[0.1] !text-slate-400 hover:!bg-red-500/10 hover:!text-red-300 hover:!border-red-500/30 !transition-all !px-5" @click="handleReject">
            <el-icon><Refresh /></el-icon>重新规划
          </el-button>
          <button class="h-11 px-7 text-sm font-bold rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-2" @click="handleApprove">
            <el-icon><Ticket /></el-icon>确认预订
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download, Refresh, Location, MapLocation, Calendar, Clock, Ticket, Star, Food, House, Wallet, Warning, Sunny } from '@element-plus/icons-vue'
import { useTripStore } from '@/stores/trip'
import { approveTripPlan, rejectTripPlan } from '@/services/api'

const router = useRouter()
const tripStore = useTripStore()

const tripPlan = ref(tripStore.tripPlan)
const activeDays = ref<number[]>([0])
const showReviewDialog = ref(false)
const reviewComment = ref('')

function pct(num: number | undefined, total: number | undefined): number {
  if (!num || !total || total === 0) return 0
  return Math.min((num / total) * 100, 100)
}

function initMap() {
  if (!tripPlan.value?.city) return
  nextTick(() => {
    const container = document.getElementById('map-container')
    if (!container) return
    const amapKey = import.meta.env.VITE_AMAP_KEY
    if (!amapKey) return

    function create() {
      if (!tripPlan.value) return
      const AMap = (window as any).AMap
      if (!AMap) return
      const geocoder = new AMap.Geocoder()
      geocoder.getLocation(tripPlan.value.city, (status: string, result: any) => {
        let center = [116.397428, 39.90923]
        if (status === 'complete' && result.geocodes?.length) {
          const loc = result.geocodes[0].location
          center = [loc.lng, loc.lat]
        }
        const map = new AMap.Map('map-container', { resizeEnable: true, zoom: 12, center })
        AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
          map.addControl(new AMap.Scale())
          map.addControl(new AMap.ToolBar())
        })
        const markers: any[] = []
        const all: any[] = []
        tripPlan.value.days?.forEach((d: any) => { d.attractions?.forEach((a: any) => all.push(a)) })
        let done = 0
        function addMarker(attr: any, lng: number, lat: number) {
          const m = new AMap.Marker({ position: [lng, lat], title: attr.name })
          m.on('click', () => new AMap.InfoWindow({ content: `<div style="padding:8px;color:#e2e8f0"><strong>${attr.name}</strong></div>`, offset: new AMap.Pixel(0, -30) }).open(map, m.getPosition()))
          markers.push(m); map.add(m)
          done++
          if (done >= all.length && markers.length > 0) map.setFitView(markers)
        }
        all.forEach((attr: any) => {
          const lng = attr.location?.longitude || attr.location?.lng
          const lat = attr.location?.latitude || attr.location?.lat
          if (lng && lat && lng !== 0 && lat !== 0) { addMarker(attr, lng, lat) }
          else {
            geocoder.getLocation(attr.address || attr.name, (s: string, r: any) => {
              if (s === 'complete' && r.geocodes?.length) { const loc = r.geocodes[0].location; addMarker(attr, loc.lng, loc.lat) }
              else { done++; if (done >= all.length && markers.length > 0) map.setFitView(markers) }
            })
          }
        })
        setTimeout(() => { if (markers.length > 0) map.setFitView(markers) }, 3000)
      })
    }

    if (!(window as any).AMap) {
      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${amapKey}&plugin=AMap.Geocoder,AMap.Scale,AMap.ToolBar`
      script.onload = () => setTimeout(create, 100)
      script.onerror = () => { console.error('AMap script 加载失败'); ElMessage.error('地图加载失败，请检查网络') }
      document.head.appendChild(script)
    } else { create() }
  })
}

async function handleExportPDF() {
  ElMessage.info('正在生成PDF...')
  try {
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')
    const element = document.querySelector('.space-y-5') as HTMLElement
    if (!element) return
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false })
    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width)
    pdf.save(`${tripPlan.value?.city}旅行计划.pdf`)
    ElMessage.success('PDF导出成功')
  } catch { ElMessage.error('PDF导出失败') }
}

function handleReset() { tripStore.reset(); router.push('/') }

async function handleApprove() {
  if (!tripStore.sessionId) return
  try { await approveTripPlan(tripStore.sessionId, reviewComment.value); ElMessage.success('行程已确认'); showReviewDialog.value = false } catch { ElMessage.error('确认失败') }
}

async function handleReject() {
  if (!tripStore.sessionId) return
  try { await rejectTripPlan(tripStore.sessionId, reviewComment.value); ElMessage.info('正在重新规划...'); showReviewDialog.value = false; router.push('/') } catch { ElMessage.error('操作失败') }
}

onMounted(() => {
  if (tripStore.needHumanReview) showReviewDialog.value = true
  if (tripPlan.value) setTimeout(initMap, 300)
})
</script>

<style scoped>
#map-container { min-height: 500px; }
html { scroll-behavior: smooth; }
</style>
