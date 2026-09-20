/**
 * 统一列表判定规则
 *
 * 发展历程（时间）、核心团队（组织关系）、企业文化（文案）共用同一套判定口径：
 *   1. 缺项回退：缺少判定键的节点直接丢弃
 *   2. 重复回退：判定键重复的节点仅保留首次出现（与模板 :key 口径一致）
 *   3. 排序：可选比较器，保证数据顺序与页面排列一致
 *   4. 上限回退：结果按明确上限截断
 *
 * @param {Array} list 原始列表
 * @param {Object} options
 * @param {string} options.key 判定键（同时作为渲染 :key）
 * @param {number} [options.max] 展示上限
 * @param {(a: Object, b: Object) => number} [options.sortBy] 排序比较器
 * @returns {Array} 归一化后的新数组（不修改原数组）
 */
export function normalizeList(list, { key, max, sortBy } = {}) {
  if (!Array.isArray(list)) return []

  const seen = new Set()
  const deduped = []
  for (const item of list) {
    const value = item?.[key]
    // 缺项回退：判定键缺失的节点不参与展示
    if (value === undefined || value === null || value === '') continue
    // 重复节点回退：同一判定键只保留首次出现
    if (seen.has(value)) continue
    seen.add(value)
    deduped.push(item)
  }

  if (typeof sortBy === 'function') {
    deduped.sort(sortBy)
  }

  // 明确上限回退
  return typeof max === 'number' ? deduped.slice(0, max) : deduped
}
