/**
 * 关于我们页统一判定规则的回归校验（无第三方依赖）：
 *   node scripts/test-about-normalize.mjs
 */
import assert from 'node:assert/strict'
import {
  normalizeList,
  identityKey,
  yearKey,
  FALLBACK_TEXT,
  DISPLAY_LIMITS
} from '../src/utils/normalize.js'

let passed = 0
const test = (name, fn) => {
  fn()
  passed += 1
  console.log(`  ✓ ${name}`)
}

console.log('发展历程（时间判定）')

test('乱序录入按年份升序展示，时间与页面排列一致', () => {
  const timeline = normalizeList(
    [
      { year: '2022', title: 'b' },
      { year: '2018', title: 'a' },
      { year: '2020', title: 'c' }
    ],
    {
      keyOf: (i) => yearKey(i.year),
      isValid: (i) => Number.isFinite(yearKey(i.year)),
      compare: (a, b) => yearKey(a.year) - yearKey(b.year)
    }
  )
  assert.deepEqual(timeline.map((i) => i.year), ['2018', '2020', '2022'])
})

test('重复年份节点去重，保留首次出现', () => {
  const timeline = normalizeList(
    [
      { year: '2018', title: '公司成立' },
      { year: '2018', title: '重复录入' }
    ],
    {
      keyOf: (i) => yearKey(i.year),
      isValid: (i) => Number.isFinite(yearKey(i.year)),
      compare: (a, b) => yearKey(a.year) - yearKey(b.year)
    }
  )
  assert.equal(timeline.length, 1)
  assert.equal(timeline[0].title, '公司成立')
})

test('非法/缺项年份丢弃，超过上限按明确上限截断', () => {
  const timeline = normalizeList(
    [
      { year: 'abcd', title: 'x' },
      { year: '', title: 'y' },
      ...['2018', '2019', '2020', '2021', '2022', '2023', '2024'].map((year) => ({
        year,
        title: year
      }))
    ],
    {
      keyOf: (i) => yearKey(i.year),
      isValid: (i) => Number.isFinite(yearKey(i.year)),
      compare: (a, b) => yearKey(a.year) - yearKey(b.year),
      max: DISPLAY_LIMITS.timelineMax
    }
  )
  assert.equal(timeline.length, DISPLAY_LIMITS.timelineMax)
  assert.deepEqual(timeline.map((i) => i.year), ['2018', '2019', '2020', '2021', '2022', '2023'])
})

test('缺项时按回退池补齐，回退节点也受去重与上限约束', () => {
  const timeline = normalizeList([{ year: '2020', title: '保留' }], {
    keyOf: (i) => yearKey(i.year),
    isValid: (i) => Number.isFinite(yearKey(i.year)),
    compare: (a, b) => yearKey(a.year) - yearKey(b.year),
    max: 3,
    fallback: [
      { year: '2020', title: '重复不补' },
      { year: '2018', title: '回退一' },
      { year: '2019', title: '回退二' },
      { year: '2017', title: '超限不补' }
    ]
  })
  assert.deepEqual(timeline.map((i) => i.year), ['2018', '2019', '2020'])
})

test('原始录入为空时仍由回退池兜底，区块不空白', () => {
  const timeline = normalizeList([], {
    keyOf: (i) => yearKey(i.year),
    isValid: (i) => Number.isFinite(yearKey(i.year)),
    compare: (a, b) => yearKey(a.year) - yearKey(b.year),
    max: 2,
    fallback: [{ year: '2018', title: '起点' }]
  })
  assert.deepEqual(timeline.map((i) => i.year), ['2018'])
})

console.log('企业文化（文案判定与切换回退）')

const cultureOptions = {
  keyOf: (i) => i.key,
  isValid: (i) => i.key !== '',
  max: DISPLAY_LIMITS.cultureMax
}

test('文案 key 去重，上限 4 条', () => {
  const cultures = normalizeList(
    [
      { key: 'a' },
      { key: 'a' },
      { key: 'b' },
      { key: 'c' },
      { key: 'd' },
      { key: 'e' }
    ],
    cultureOptions
  )
  assert.deepEqual(cultures.map((i) => i.key), ['a', 'b', 'c', 'd'])
})

test('切换判定：非法 key、空值一律回退首项，前进后退结果一致', () => {
  const cultures = normalizeList(
    [{ key: 'mission' }, { key: 'vision' }],
    cultureOptions
  )
  const resolve = (raw) => {
    const key = identityKey(raw)
    return cultures.some((i) => i.key === key) ? key : cultures[0].key
  }
  assert.equal(resolve('vision'), 'vision')
  assert.equal(resolve('unknown'), 'mission')
  assert.equal(resolve(''), 'mission')
  assert.equal(resolve(undefined), 'mission')
})

test('文案缺字段回退统一占位文案', () => {
  const [item] = normalizeList([{ key: 'x', title: '', description: '' }], {
    keyOf: (i) => i.key,
    isValid: (i) => i.key !== '',
    sanitize: (i) => ({
      key: i.key,
      title: i.title || FALLBACK_TEXT,
      description: i.description || FALLBACK_TEXT
    })
  })
  assert.equal(item.title, FALLBACK_TEXT)
  assert.equal(item.description, FALLBACK_TEXT)
})

console.log('核心团队（组织关系判定 & 与公司简介条目去重）')

const memberOptions = {
  keyOf: (i) => identityKey(i.name),
  isValid: (i) => i.name !== '',
  max: DISPLAY_LIMITS.teamMax,
  fallback: [
    { name: '张总', title: 'CEO' },
    { name: '李总', title: 'CTO' },
    { name: '王总', title: 'COO' },
    { name: '陈总', title: '产品VP' }
  ]
}

test('姓名身份键去重（忽略空白与大小写），保留首次出现', () => {
  const team = normalizeList(
    [
      { name: '张总', title: 'CEO' },
      { name: ' 张总 ', title: '重复' },
      { name: '李总', title: 'CTO' }
    ],
    memberOptions
  )
  assert.deepEqual(team.map((i) => i.name), ['张总', '李总', '王总', '陈总'])
  assert.equal(team[0].title, 'CEO')
})

test('缺姓名的无效节点丢弃并由回退池补齐到上限', () => {
  const team = normalizeList(
    [{ title: '无名' }, { name: '赵总', title: '顾问' }],
    memberOptions
  )
  assert.equal(team.length, DISPLAY_LIMITS.teamMax)
  assert.ok(!team.some((i) => i.name === ''))
})

test('公司简介已收录条目不在团队区重复展示；回退池无更多现有资料时不虚构新人', () => {
  const team = normalizeList(
    [
      { name: '张总', title: 'CEO' },
      { name: '李总', title: 'CTO' },
      { name: '王总', title: 'COO' },
      { name: '陈总', title: '产品VP' }
    ],
    { ...memberOptions, exclude: ['张总'] }
  )
  assert.ok(team.length <= DISPLAY_LIMITS.teamMax, '不超过展示上限')
  assert.ok(!team.some((i) => i.name === '张总'), '简介条目不得重复出现在团队区')
  // 张总仍保留在公司简介；团队区只能用现有资料补位，池中再无他人，故为 3 人且不重复
  assert.deepEqual(team.map((i) => i.name), ['李总', '王总', '陈总'])
})

test('上限是硬约束：回退池用尽也不超过上限', () => {
  const team = normalizeList(
    Array.from({ length: 10 }, (_, i) => ({ name: `人${i}` })),
    memberOptions
  )
  assert.equal(team.length, DISPLAY_LIMITS.teamMax)
})

console.log(`\n全部 ${passed} 项校验通过 ✅`)
