/**
 * 公司资料数据
 *
 * 现有公司资料原样保留，仅为企业文化补充稳定 id，
 * 作为切换与统一判定规则（去重 / 排序 / 上限）的判定键。
 */

// 发展历程（时间）
export const timelineData = [
  {
    year: '2018',
    title: '公司成立',
    description: '广州知运信息技术有限公司在广州正式成立，开启智慧物流创业之路'
  },
  {
    year: '2019',
    title: '产品发布',
    description: '首款智慧仓储系统正式发布，获得首批客户认可'
  },
  {
    year: '2020',
    title: '业务拓展',
    description: '推出运输管理系统，服务客户突破100家'
  },
  {
    year: '2021',
    title: '技术突破',
    description: '获得多项技术专利，被认定为高新技术企业'
  },
  {
    year: '2022',
    title: '规模扩张',
    description: '团队规模突破200人，服务客户超过300家'
  },
  {
    year: '2024',
    title: '行业领先',
    description: '成为智慧物流领域领先服务商，服务客户超过500家'
  }
]

// 企业文化（文案）
export const cultureData = [
  {
    id: 'mission',
    icon: 'Aim',
    title: '使命',
    description: '用科技让物流更简单，助力企业降本增效'
  },
  {
    id: 'vision',
    icon: 'View',
    title: '愿景',
    description: '成为中国最值得信赖的智慧物流服务商'
  },
  {
    id: 'values',
    icon: 'Star',
    title: '价值观',
    description: '客户第一、创新驱动、诚信务实、合作共赢'
  },
  {
    id: 'spirit',
    icon: 'Promotion',
    title: '精神',
    description: '追求卓越、永不止步、勇于担当、团队协作'
  }
]

// 核心团队（组织关系）
export const teamData = [
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

// 各区域展示上限：缺项或重复节点按此明确上限回退
export const TIMELINE_MAX = 6
export const CULTURE_MAX = 4
export const TEAM_MAX = 4
