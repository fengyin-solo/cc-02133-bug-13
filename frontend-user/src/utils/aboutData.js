/**
 * 关于我们页展示数据构建
 *
 * 时间、组织关系、文案遵循同一判定规则（utils/normalize.js）：
 * 字段缺项回退、身份键去重、按明确上限截断、不足由回退池补齐。
 * 视图层只消费这里的结果，不直接使用原始录入。
 */
import { normalizeList, identityKey, yearKey, FALLBACK_TEXT, DISPLAY_LIMITS } from '@/utils/normalize'
import {
  rawTimeline,
  fallbackTimeline,
  rawCultures,
  rawTeam,
  fallbackTeam,
  introMemberKeys
} from '@/data/about'

/* -------- 发展历程：时间判定（年份升序，同年去重，最多 timelineMax 条） -------- */

const sanitizeTimeline = (item) => ({
  year: String(item.year ?? '').trim(),
  title: String(item.title ?? '').trim() || FALLBACK_TEXT,
  description: String(item.description ?? '').trim() || FALLBACK_TEXT
})

export function buildTimeline() {
  return normalizeList(rawTimeline, {
    keyOf: (item) => yearKey(item.year),
    isValid: (item) => Number.isFinite(yearKey(item.year)),
    sanitize: sanitizeTimeline,
    compare: (a, b) => yearKey(a.year) - yearKey(b.year),
    max: DISPLAY_LIMITS.timelineMax,
    fallback: fallbackTimeline.map(sanitizeTimeline)
  })
}

/* -------- 企业文化：文案判定（key 唯一，最多 cultureMax 条） -------- */

const sanitizeCulture = (item) => ({
  key: identityKey(item.key),
  icon: String(item.icon ?? 'Star').trim() || 'Star',
  title: String(item.title ?? '').trim() || FALLBACK_TEXT,
  description: String(item.description ?? '').trim() || FALLBACK_TEXT,
  detail: String(item.detail ?? '').trim() || FALLBACK_TEXT
})

export function buildCultures() {
  return normalizeList(rawCultures, {
    keyOf: (item) => item.key,
    isValid: (item) => item.key !== '',
    sanitize: sanitizeCulture,
    max: DISPLAY_LIMITS.cultureMax
  })
}

/**
 * 文化切换的统一判定：非法/缺项（含切换后残留的旧 key）一律回退到第一项，
 * 保证前进、后退、刷新、手输 URL 的结果一致。
 */
export function resolveCultureKey(rawKey, cultures) {
  const key = identityKey(rawKey)
  return cultures.some((item) => item.key === key) ? key : cultures[0].key
}

/* -------- 核心团队：组织关系判定（姓名身份唯一，先排除公司简介已收录条目，最多 teamMax 条） -------- */

const sanitizeMember = (item) => ({
  name: String(item.name ?? '').trim(),
  title: String(item.title ?? '').trim() || FALLBACK_TEXT,
  description: String(item.description ?? '').trim() || FALLBACK_TEXT
})

export function buildTeam() {
  // 与公司简介条目的去重口径：同一身份键即视为重复，简介条目保留在简介、团队区不再重复展示；
  // 排除后低于上限时由回退池按同一规则补齐。
  return normalizeList(rawTeam, {
    keyOf: (item) => identityKey(item.name),
    isValid: (item) => item.name !== '',
    sanitize: sanitizeMember,
    max: DISPLAY_LIMITS.teamMax,
    fallback: fallbackTeam.map(sanitizeMember),
    exclude: introMemberKeys
  })
}
