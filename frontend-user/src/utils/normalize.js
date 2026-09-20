/**
 * 公司简介页统一判定规则
 *
 * 时间（发展历程）、组织关系（核心团队）、文案（企业文化）共用同一条规范化管线：
 *   缺项回退 -> 身份去重（保留首次出现）-> 排序 -> 上限截断 -> 缺项按上限回退补齐
 * 任何区块都不直接渲染原始录入，必须经过 normalizeList，保证前进/后退、刷新后展示口径一致。
 */

// 各区块明确展示上限：超过截断，不足时从回退池补齐到该上限
export const DISPLAY_LIMITS = Object.freeze({
  timelineMax: 6,
  cultureMax: 4,
  teamMax: 4
})

// 文案缺项时的统一回退文案
export const FALLBACK_TEXT = '资料完善中'

/**
 * 统一身份键：压缩全部空白并转小写。
 * 时间节点、人员条目、文化条目均以此口径判定"是否同一个节点"。
 */
export const identityKey = (value) =>
  String(value ?? '').replace(/\s+/g, '').toLowerCase()

/**
 * 年份键：仅接受 4 位数字年份，非法年份返回 NaN（按缺项/无效节点处理）。
 */
export const yearKey = (value) => {
  const text = String(value ?? '').trim()
  if (!/^\d{4}$/.test(text)) return NaN
  const year = Number.parseInt(text, 10)
  return Number.isFinite(year) ? year : NaN
}

const isInvalidKey = (key) =>
  key === '' || key == null || (typeof key === 'number' && Number.isNaN(key))

/**
 * 列表规范化管线
 * @param {Array} rawList 原始录入
 * @param {Object} options
 * @param {(item: object) => string|number} options.keyOf 身份键提取（时间/组织/文案同一口径）
 * @param {(item: object) => boolean} [options.isValid] 节点有效性校验，无效按缺项丢弃
 * @param {(item: object) => object} [options.sanitize] 字段级缺项回退
 * @param {(a: object, b: object) => number} [options.compare] 排序规则（如按年份升序）
 * @param {number} [options.max] 展示上限，超出截断
 * @param {Array} [options.fallback] 缺项回退池，去重后不足上限时按顺序补位（同样受去重/上限约束）
 * @param {Set|Array} [options.exclude] 预占身份集合：键已在其它区块出现的节点直接判为重复，由回退池补齐
 */
export function normalizeList(rawList, options = {}) {
  const {
    keyOf,
    isValid = () => true,
    sanitize = (item) => item,
    compare = null,
    max = Number.POSITIVE_INFINITY,
    fallback = [],
    exclude = []
  } = options

  // 已在其它区块（如公司简介条目）出现的身份键预先占坑，实现跨区块同一口径去重
  const seen = new Set((exclude instanceof Set ? exclude : [...exclude]).map(identityKey))

  // 单个节点：缺项回退 -> 有效性 -> 身份去重（重复节点保留首次出现）
  const accept = (raw) => {
    if (raw == null) return null
    const item = sanitize(raw)
    if (!isValid(item)) return null
    const key = keyOf(item)
    if (isInvalidKey(key) || seen.has(key)) return null
    seen.add(key)
    return item
  }

  const deduped = []
  for (const raw of rawList ?? []) {
    const item = accept(raw)
    if (item) deduped.push(item)
  }

  // 先排序再按上限截断，避免乱序录入时误删应保留的节点
  if (compare) deduped.sort(compare)
  const result = deduped.slice(0, max)

  // 去重/截断后缺项：按回退池顺序补齐，回退节点仍受同一身份口径与上限约束
  for (const raw of fallback) {
    if (result.length >= max) break
    const item = accept(raw)
    if (item) result.push(item)
  }
  if (compare) result.sort(compare)

  return result
}
