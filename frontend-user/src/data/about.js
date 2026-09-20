/**
 * 公司资料（关于我们页）
 *
 * 现有公司资料原样保留，仅集中到数据层管理。
 * raw* 为原始录入，可能存在乱序、重复、缺项；展示时统一经 utils/normalize.js 判定，
 * 不在视图层直接使用原始录入。fallback* 为缺项/去重后的回退池。
 */

/* ---------------- 发展历程 ---------------- */

// 原始录入：保留乱序与重复录入的故障形态，规范化后按年份升序、同年去重
export const rawTimeline = [
  {
    year: '2024',
    title: '行业领先',
    description: '成为智慧物流领域领先服务商，服务客户超过500家'
  },
  {
    year: '2018',
    title: '公司成立',
    description: '广州知运信息技术有限公司在广州正式成立，开启智慧物流创业之路'
  },
  {
    year: '2018', // 重复节点（同年同身份），去重时保留首次出现的有效文案
    title: '',
    description: ''
  },
  {
    year: '2020',
    title: '业务拓展',
    description: '推出运输管理系统，服务客户突破100家'
  },
  {
    year: '2019',
    title: '产品发布',
    description: '首款智慧仓储系统正式发布，获得首批客户认可'
  },
  {
    year: '2022',
    title: '规模扩张',
    description: '团队规模突破200人，服务客户超过300家'
  },
  {
    year: '2021',
    title: '技术突破',
    description: '获得多项技术专利，被认定为高新技术企业'
  }
]

// 缺项回退池：历程被过滤到不足上限时按顺序补位
export const fallbackTimeline = [
  {
    year: '2018',
    title: '公司成立',
    description: '广州知运信息技术有限公司在广州正式成立，开启智慧物流创业之路'
  }
]

/* ---------------- 企业文化 ---------------- */

export const rawCultures = [
  {
    key: 'mission',
    icon: 'Aim',
    title: '使命',
    description: '用科技让物流更简单，助力企业降本增效',
    detail:
      '围绕仓储、运输、配送全链路场景，以人工智能、大数据与物联网技术帮助客户实现物流运营的数字化、智能化升级，持续为企业降本增效。'
  },
  {
    key: 'vision',
    icon: 'View',
    title: '愿景',
    description: '成为中国最值得信赖的智慧物流服务商',
    detail:
      '以稳定可靠的产品与专业服务积累客户信任，长期深耕智慧物流领域，与客户、伙伴共同成长，成为行业内值得长期托付的服务商。'
  },
  {
    key: 'values',
    icon: 'Star',
    title: '价值观',
    description: '客户第一、创新驱动、诚信务实、合作共赢',
    detail:
      '坚持客户第一，以创新驱动产品与服务持续进步；对内诚信务实，对外合作共赢，让每一次协作都建立在透明与互信之上。'
  },
  {
    key: 'spirit',
    icon: 'Promotion',
    title: '精神',
    description: '追求卓越、永不止步、勇于担当、团队协作',
    detail:
      '以追求卓越的标准打磨产品，以永不止步的态度面对变化；面对挑战勇于担当，依靠团队协作攻克复杂业务难题。'
  }
]

/* ---------------- 核心团队 ---------------- */

// 公司简介中已出现的人员条目（按姓名身份口径）；团队风采与其重复时以简介为准，不在团队区重复展示。
// 现有简介正文无具名条目，故为空；简介新增具名条目时，把对应身份键加入此集合即可生效。
export const introMemberKeys = []

// 原始录入：保留重复与缺项形态，规范化后按现有公司资料顺序呈现
export const rawTeam = [
  {
    name: '张总',
    title: 'CEO / 创始人',
    description: '20年物流行业经验，曾任知名物流企业高管'
  },
  {
    name: '张总', // 与上一条重复：身份键相同，去重时保留首次出现
    title: '',
    description: ''
  },
  {
    name: '李总',
    title: 'CTO / 联合创始人',
    description: '15年技术研发经验，前互联网大厂技术总监'
  },
  {
    year: '王总', // 缺项节点：缺少姓名，按无效节点丢弃，由回退池补齐
    title: 'COO',
    description: '10年运营管理经验，精通供应链管理'
  },
  {
    name: '王总',
    title: 'COO',
    description: '10年运营管理经验，精通供应链管理'
  },
  {
    name: '陈总',
    title: '产品VP',
    description: '12年产品经验，深耕物流行业产品设计'
  }
]

// 缺项回退池：去重后不足展示上限时，按现有公司资料顺序补位（不虚构新人员）
export const fallbackTeam = [
  {
    name: '张总',
    title: 'CEO / 创始人',
    description: '20年物流行业经验，曾任知名物流企业高管'
  },
  {
    name: '李总',
    title: 'CTO / 联合创始人',
    description: '15年技术研发经验，前互联网大厂技术总监'
  },
  {
    name: '王总',
    title: 'COO',
    description: '10年运营管理经验，精通供应链管理'
  },
  {
    name: '陈总',
    title: '产品VP',
    description: '12年产品经验，深耕物流行业产品设计'
  }
]
