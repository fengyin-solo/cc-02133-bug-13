<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">关于我们</h1>
        <p class="page-subtitle">专注智慧物流，赋能企业数字化转型</p>
      </div>
    </section>
    
    <!-- 公司简介 -->
    <section class="section section-light">
      <div class="container">
        <div class="about-intro">
          <div class="intro-content">
            <SectionTitle title="公司简介" />
            <p class="intro-text">
              广州知运信息技术有限公司成立于2018年，是一家专注于智慧物流系统研发与服务的高新技术企业。
              公司总部位于广州市天河区科技园，拥有一支由资深物流专家和技术精英组成的核心团队。
            </p>
            <p class="intro-text">
              我们致力于为企业提供全方位的智慧物流解决方案，涵盖仓储管理、运输调度、配送优化、
              数据分析等核心业务领域。通过先进的人工智能、大数据、物联网等技术，
              帮助客户实现物流运营的数字化、智能化升级。
            </p>
            <div class="intro-stats">
              <div class="stat-item">
                <span class="value">6+</span>
                <span class="label">年行业经验</span>
              </div>
              <div class="stat-item">
                <span class="value">500+</span>
                <span class="label">服务客户</span>
              </div>
              <div class="stat-item">
                <span class="value">50+</span>
                <span class="label">技术专利</span>
              </div>
            </div>
          </div>
          <div class="intro-image">
            <div class="image-placeholder">
              <el-icon :size="80"><OfficeBuilding /></el-icon>
              <span>公司大楼</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 发展历程 -->
    <section class="section section-gray">
      <div class="container">
        <SectionTitle 
          title="发展历程" 
          subtitle="砥砺前行，不断突破"
        />
        <div class="timeline">
          <div class="timeline-item" v-for="item in timeline" :key="item.year">
            <div class="timeline-year">{{ item.year }}</div>
            <div class="timeline-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 企业文化 -->
    <section class="section section-light">
      <div class="container">
        <SectionTitle 
          title="企业文化" 
          subtitle="以客户为中心，以创新为驱动"
        />
        <div class="culture-grid">
          <button
            v-for="culture in cultures"
            :key="culture.key"
            type="button"
            class="culture-card"
            :class="{ active: activeCultureKey === culture.key }"
            @click="switchCulture(culture.key)"
          >
            <div class="culture-icon">
              <el-icon :size="36">
                <component :is="culture.icon" />
              </el-icon>
            </div>
            <h3>{{ culture.title }}</h3>
            <p>{{ culture.description }}</p>
          </button>
        </div>
        <!-- 详情区按 key 整体重建：切换后不会残留上一段内容 -->
        <transition name="culture-fade" mode="out-in">
          <div :key="activeCulture.key" class="culture-detail">
            <div class="culture-detail-icon">
              <el-icon :size="28">
                <component :is="activeCulture.icon" />
              </el-icon>
            </div>
            <div class="culture-detail-text">
              <h3>{{ activeCulture.title }}</h3>
              <p>{{ activeCulture.detail }}</p>
            </div>
          </div>
        </transition>
      </div>
    </section>
    
    <!-- 团队风采 -->
    <section class="section section-gray">
      <div class="container">
        <SectionTitle 
          title="核心团队" 
          subtitle="汇聚行业精英，打造专业团队"
        />
        <div class="team-grid">
          <div class="team-card" v-for="member in team" :key="member.name">
            <div class="member-avatar">
              <el-icon :size="48"><User /></el-icon>
            </div>
            <h4 class="member-name">{{ member.name }}</h4>
            <p class="member-title">{{ member.title }}</p>
            <p class="member-desc">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionTitle from '@/components/SectionTitle.vue'
import {
  buildTimeline,
  buildCultures,
  buildTeam,
  resolveCultureKey
} from '@/utils/aboutData'

const route = useRoute()
const router = useRouter()

// 时间、组织关系、文案均经统一判定规则规范化，不直接使用原始录入
const timeline = buildTimeline()
const cultures = buildCultures()
const team = buildTeam()

// 文化切换状态由路由 query 派生：前进/后退/刷新/手输 URL 结果一致
const activeCultureKey = ref(resolveCultureKey(route.query.culture, cultures))

const activeCulture = computed(
  () => cultures.find((item) => item.key === activeCultureKey.value) || cultures[0]
)

const switchCulture = (key) => {
  const next = resolveCultureKey(key, cultures)
  if (next === activeCultureKey.value) return
  // 使用 push 产生历史记录，浏览器前进/后退均可恢复
  router.push({ query: { ...route.query, culture: next } })
}

// 浏览器前进/后退或外部改 URL 时，按同一判定规则同步，非法值回退首项
watch(
  () => route.query.culture,
  (rawKey) => {
    activeCultureKey.value = resolveCultureKey(rawKey, cultures)
  }
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.page-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: $spacing-xxl 0;
  text-align: center;
  color: #fff;
}

.page-title {
  font-size: $font-size-xxxl;
  font-weight: 700;
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  font-size: $font-size-lg;
  opacity: 0.75;
}

.about-intro {
  display: flex;
  gap: $spacing-xxl;
  align-items: center;
}

.intro-content {
  flex: 1;
}

.intro-text {
  font-size: $font-size-base;
  color: $text-regular;
  line-height: $line-height-loose;
  margin-bottom: $spacing-md;
}

.intro-stats {
  display: flex;
  gap: $spacing-xl;
  margin-top: $spacing-xl;
}

.intro-stats .stat-item {
  text-align: center;
  
  .value {
    display: block;
    font-size: 36px;
    font-weight: 700;
    color: $primary-color;
  }
  
  .label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.intro-image {
  flex: 0 0 400px;
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba($primary-light, 0.1));
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  color: $primary-color;
  
  span {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.timeline {
  position: relative;
  padding-left: 120px;
  
  &::before {
    content: '';
    position: absolute;
    left: 100px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $border-color;
  }
}

.timeline-item {
  position: relative;
  padding-bottom: $spacing-xl;
  
  &::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 8px;
    width: 12px;
    height: 12px;
    background: $primary-color;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
  }
}

.timeline-year {
  position: absolute;
  left: -120px;
  top: 0;
  font-size: $font-size-lg;
  font-weight: 700;
  color: $primary-color;
}

.timeline-content {
  background: $bg-white;
  padding: $spacing-lg;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  
  h4 {
    font-size: $font-size-lg;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }
  
  p {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.culture-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.culture-card {
  background: $bg-white;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  text-align: center;
  box-shadow: $shadow-md;
  border: 2px solid transparent;
  font: inherit;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }

  &.active {
    border-color: $primary-color;
  }
}

.culture-icon {
  width: 72px;
  height: 72px;
  background: rgba($primary-color, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-md;
  color: $primary-color;
}

.culture-card h3 {
  font-size: $font-size-lg;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.culture-card p {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: $line-height-loose;
}

.culture-detail {
  display: flex;
  align-items: flex-start;
  gap: $spacing-lg;
  margin-top: $spacing-lg;
  padding: $spacing-lg $spacing-xl;
  background: $bg-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.culture-detail-icon {
  flex: 0 0 56px;
  width: 56px;
  height: 56px;
  background: rgba($primary-color, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
}

.culture-detail-text {
  h3 {
    font-size: $font-size-lg;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }

  p {
    font-size: $font-size-sm;
    color: $text-regular;
    line-height: $line-height-loose;
  }
}

.culture-fade-enter-active,
.culture-fade-leave-active {
  transition: opacity 0.2s ease;
}

.culture-fade-enter-from,
.culture-fade-leave-to {
  opacity: 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.team-card {
  background: $bg-white;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  text-align: center;
  box-shadow: $shadow-md;
}

.member-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-md;
  color: #fff;
}

.member-name {
  font-size: $font-size-lg;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.member-title {
  font-size: $font-size-sm;
  color: $primary-color;
  margin-bottom: $spacing-sm;
}

.member-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
}

@media (max-width: $breakpoint-lg) {
  .about-intro {
    flex-direction: column;
  }
  
  .intro-image {
    flex: none;
    width: 100%;
  }
  
  .culture-grid,
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: $breakpoint-md) {
  .page-title {
    font-size: $font-size-xxl;
  }
  
  .timeline {
    padding-left: 30px;
    
    &::before {
      left: 10px;
    }
  }
  
  .timeline-year {
    position: static;
    margin-bottom: $spacing-xs;
  }
  
  .timeline-item::before {
    left: -24px;
  }
  
  .culture-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .culture-detail {
    flex-direction: column;
    gap: $spacing-md;
  }

  .intro-stats {
    flex-wrap: wrap;
  }
}
</style>
