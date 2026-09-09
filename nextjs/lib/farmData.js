export const OS_STAGES = [
  { key: 'plan',       label: 'Farm & Plan',   short: 'Plan',   icon: '🌱', desc: 'Farm setup, crop & plot',        href: '/farm' },
  { key: 'soil',       label: 'Soil Intelligence', short: 'Soil', icon: '🧪', desc: 'Test, amend & fertilise',      href: '/farm/soil' },
  { key: 'ai',         label: 'ChimaAI',       short: 'AI',     icon: '🤖', desc: 'Context-aware farm advisor',     href: null },
  { key: 'inputs',     label: 'Inputs',        short: 'Inputs', icon: '🛒', desc: 'Seed, fertiliser & protectants', href: '/farm/inputs' },
  { key: 'irrigation', label: 'Irrigation',    short: 'Water',  icon: '💧', desc: 'Stage-smart watering',          href: '/farm/irrigation' },
  { key: 'machinery',  label: 'Machinery',     short: 'Mach.',  icon: '🚜', desc: 'Rent the right machine',        href: '/farm/machinery' },
  { key: 'crop',       label: 'Production',    short: 'Crop',   icon: '🌾', desc: 'Grow, monitor & harvest',       href: '/farm/crop' },
  { key: 'produce',    label: 'Marketplace',   short: 'Market', icon: '🏪', desc: 'Sell at the best price',        href: '/farm/produce' },
  { key: 'economics',  label: 'Farm Economics',short: 'Econ',   icon: '📊', desc: 'Cost, revenue & profit',       href: '/farm/economics' }
];

export const OS_ORDER = OS_STAGES.map(s => s.key);

export const PHASES = [
  { key: 'nursery',    label: 'Nursery',        icon: '🌱', range: [-42, -1],   daysLabel: 'wk -6 to 0',  critical: false,
    desc: 'Sow in raised seedbeds, grow 5–6 weeks to pencil-thick seedlings.',
    tasks: [
      'Prepare raised seedbeds (1m wide, fine tilth)',
      'Mix seedbed with compost & limed soil',
      'Sow seed ~2-3g/m² in rows 10cm apart',
      'Water the nursery daily in the morning',
      'Mulch lightly to keep moisture until germinated',
      'Harden off seedlings 1 week before transplanting'
    ] },
  { key: 'transplant', label: 'Transplanting', icon: '🌿', range: [0, 7],       daysLabel: 'Day 0–7',     critical: false,
    desc: 'Move 15cm seedlings to the field at 10×15cm spacing.',
    tasks: [
      'Irrigate the field one day before transplanting',
      'Transplant at 10cm spacing, 2-3cm deep',
      'Irrigate immediately after transplanting',
      'Replace any dead seedlings within 1 week (gap-filling)',
      'Scout daily for cutworms in the first week'
    ] },
  { key: 'vegetative', label: 'Vegetative',    icon: '🍃', range: [8, 40],      daysLabel: 'Day 8–40',    critical: false,
    desc: 'Fast leaf growth. Feed nitrogen, keep weeds out, watch thrips.',
    tasks: [
      'Top-dress nitrogen at week 2–3 (side-dress CAN/urea)',
      'Hoe or hand weed every 14 days',
      'Scout for onion thrips — silver streaks, distorted tips',
      'Irrigate every 5-6 days, 35-45mm per week',
      'Mulch between rows to hold moisture (optional)'
    ] },
  { key: 'bulbInit',   label: 'Bulb Formation',icon: '🧅', range: [41, 65],     daysLabel: 'Day 41–65',   critical: true,
    desc: 'Pivot from leaves to bulbs. Stop adding nitrogen now.',
    tasks: [
      'STOP nitrogen — excess N gives soft, keep-failing bulbs',
      'Maintain phosphorus & potassium for bulb fill',
      'Steady water — do not let plants wilt between irrigations',
      'Spray for thrips if scouting threshold reached',
      'Scout purple blotch & downy mildew after dew/rain'
    ] },
  { key: 'bulbSwell',  label: 'Bulb Swelling', icon: '🧅', range: [66, 100],    daysLabel: 'Day 66–100',  critical: true,
    desc: 'Bulbs bulk up fast. Keep soil evenly moist — stress splits bulbs.',
    tasks: [
      'Irrigate regularly — stress cracks bulbs',
      'Stop irrigation completely 2 weeks before expected harvest',
      'Control weeds that compete in the final fill',
      'Monitor downy mildew in cool weather',
      'Watch market prices — plan your harvest window'
    ] },
  { key: 'maturity',   label: 'Maturity',      icon: '⏳', range: [101, 115],   daysLabel: 'Day 101–115', critical: false,
    desc: 'Tops bend over. Bulbs are finishing — stop all water.',
    tasks: [
      'Stop watering — field must stay dry',
      'Wait until 50-80% of tops have fallen over',
      'Lift bulbs with a fork without bruising',
      'Cure in the field / shade 7-10 days on racks',
      'Trim roots & tops, grade by size'
    ] },
  { key: 'harvest',    label: 'Harvest',       icon: '🚜', range: [116, 200],   daysLabel: 'Day 116+',    critical: false,
    desc: 'Bag, weigh and move to the best market.',
    tasks: [
      'Grade onion by size (A/B/C) for premium pricing',
      'Bag in 50-70kg nets / crates',
      'Book transport to the target market',
      'Sell through the Marketplace or local aggregators',
      'Record every sale in the Farm Economics ledger'
    ] }
];

export const WATER_PLAN = {
  nursery:    { weeklyMm: 22,  dailyMins: 15, advice: 'Morning watering on seedbeds, keep soil moist not soggy.' },
  transplant: { weeklyMm: 45,  dailyMins: 30, advice: 'Heavy watering after transplanting to settle soil around roots.' },
  vegetative: { weeklyMm: 38,  dailyMins: 20, advice: 'Every 5-6 days. Deep soak promotes deep rooting.' },
  bulbInit:   { weeklyMm: 50,  dailyMins: 30, advice: 'Critical window — never let plants wilt. Consistent moisture builds uniform bulbs.' },
  bulbSwell:  { weeklyMm: 45,  dailyMins: 28, advice: 'Keep soil evenly moist. Reduce weekly during the final 2 weeks, then stop.' },
  maturity:   { weeklyMm: 12,  dailyMins: 8,  advice: 'Winding down — allow soil to dry for curing.' },
  harvest:    { weeklyMm: 0,   dailyMins: 0,  advice: 'Zero irrigation. Dry field for lifting & curing.' }
};

const NUTRIENT_RANGES = {
  ph:   { min: 5.8, max: 6.8, label: 'pH' },
  N:    { min: 0.16, max: 0.30, label: 'Nitrogen %' },
  P:    { min: 15,   max: 40,   label: 'Phosphorus (ppm)' },
  K:    { min: 120,  max: 250,  label: 'Potassium (ppm)' },
  OM:   { min: 2.5,  max: 5.0,  label: 'Organic Matter %' }
};

export function soilGuidance(soil) {
  if (!soil || !soil.done) return { status: 'unknown', nutrients: [], amendments: [] }
  const nutrients = Object.entries(NUTRIENT_RANGES).map(([key, r]) => {
    const v = soil[key]
    const status = v == null ? 'notest' : v < r.min ? 'low' : v > r.max ? 'high' : 'optimal'
    return { key, label: r.label, value: v, range: r, status }
  })
  const amendments = []
  if (soil.ph != null && soil.ph < 5.5)
    amendments.push({ name: 'Agricultural lime', amountKg: Math.ceil(soilAreaFactor(soil.areaHa) * 1200), note: `pH ${soil.ph} is too acid for onion. Apply lime before transplanting to lift pH toward 6.2.` })
  else if (soil.ph != null && soil.ph > 7.4)
    amendments.push({ name: 'Sulphur / gypsum', amountKg: Math.ceil(soilAreaFactor(soil.areaHa) * 300), note: `pH ${soil.ph} is alkaline. Use elemental sulphur or gypsum to lower pH for onion.` })
  if (soil.P != null && soil.P < 15)
    amendments.push({ name: 'TSP (46% P) starter', amountKg: Math.ceil(soilAreaFactor(soil.areaHa) * 90), note: `Phosphorus ${soil.P} ppm is low — onions need P at transplanting for roots.` })
  if (soil.OM != null && soil.OM < 2.5)
    amendments.push({ name: 'Compost / farmyard manure', amountKg: Math.ceil(soilAreaFactor(soil.areaHa) * 8000), note: 'Build organic matter for water retention on sandy soils.' })
  return { status: soil.ph == null ? 'partial' : 'optimal', nutrients, amendments }
}

const soilAreaFactor = (ha) => Math.max(0.05, Number(ha) || 0.25)

export function fertilizerPlan(soil, areaHa) {
  const ha = soilAreaFactor(areaHa)
  const rows = [
    { name: 'Di-Ammonium Phosphate (DAP)',       stage: 'Transplanting (starter)', amount: ha * 55,  unit: 'kg', estPricePerUnit: 2150 },
    { name: 'NPK 17-17-17',                       stage: 'Pre-planting',           amount: ha * 100, unit: 'kg', estPricePerUnit: 2900 },
    { name: 'CAN / Urea top-dress (N)',           stage: 'Vegetative (day 14-21)', amount: ha * 60,  unit: 'kg', estPricePerUnit: 1840 },
    { name: 'Muriate of Potash (K)',              stage: 'Bulb formation',         amount: ha * 40,  unit: 'kg', estPricePerUnit: 1750 }
  ]
  return rows.map(r => ({ ...r, amount: Math.ceil(r.amount), total: Math.ceil(r.amount) * r.estPricePerUnit }))
}

function seeded(seed) {
  let a = seed + 17 & 0x7fffffff; let t = a + (a = ((a % 1000000) * 16807) | 0) * 997; return (t % 1000000) / 1000000
}
export function onionMarket() {
  const seed = [...'ARUSHA'].reduce((a, c) => a + c.charCodeAt(0), 3)
  const drift = (seeded(seed) - 0.5) * 0.5
  const weekAgo = Math.round(820 + seeded(5) * 260)
  const current = Math.round(weekAgo * (1 + drift))
  const changePct = Number(((current - weekAgo) / weekAgo * 100).toFixed(1))
  return { name: 'Vitunguu (Onion)', unit: 'kg', market: 'Arusha Central', pricePerKg: current, weekAgo, changePct }
}

export function marketAdvice(pricePerKg, trendPct) {
  if (trendPct > 5)  return { verdict: 'SELL NOW',  kind: 'sell',  msg: `Prices are up ${trendPct}% this week. Strong window to sell — onion prices usually fall after regional harvests.` }
  if (trendPct < -5) return { verdict: 'HOLD',      kind: 'hold',  msg: `Prices dropped ${Math.abs(trendPct)}%. Hold 1-2 weeks if curing/storage allows, unless you need cash.` }
  return { verdict: 'NEUTRAL', kind: 'neutral', msg: `Prices stable (${trendPct > 0 ? '+' : ''}${trendPct}%). Watch Kariakoo & regional demand before harvest.` }
}

export function yieldForecast(areaHa, health) {
  const ha = soilAreaFactor(areaHa)
  const base = 25 // t/ha (Mbili F1, improved management)
  const hp = Math.max(0.6, 1 - (health.filter(h => h.severity === 'Critical').length * 0.12 + health.filter(h => h.severity === 'High').length * 0.06))
  return Math.round(ha * base * hp * 1000) // kg
}

export const DEMO_FARM = {
  farm: {
    name: 'Shamba la Onion · Juma',
    farmer: 'Juma Mfaume',
    region: 'Arusha (Arumeru)',
    crop: 'onion',
    cropLabel: 'Vitunguu (Onion)',
    variety: 'Mbili F1',
    areaHa: 0.5,
    soilType: 'Sandy loam',
    waterSource: 'Borehole',
    plantingDate: '2026-07-15'
  },
  soilTest: {
    done: true,
    ph: 6.2, N: 0.21, P: 11, K: 148, OM: 2.8,
    testedAt: '2026-06-20', lab: 'SAGCOT Lab · Arusha',
    amendments: []
  },
  inputs: [
    { id: 1, name: 'Onion seed — Mbili F1 (2kg)', type: 'Seed', qty: 2, unit: 'kg', price: 280000, date: '2026-05-28', vendor: 'Chimaguli Agrovet' },
    { id: 2, name: 'Agricultural lime (25kg bags)', type: 'Amendment', qty: 5, unit: '25kg', price: 18000, date: '2026-06-05', vendor: 'Chimaguli Agrovet' },
    { id: 3, name: 'NPK 17-17-17 (50kg)', type: 'Fertilizer', qty: 2, unit: '50kg', price: 145000, date: '2026-06-10', vendor: 'Chimaguli Agrovet' },
    { id: 4, name: 'CAN top-dress (50kg)', type: 'Fertilizer', qty: 1, unit: '50kg', price: 92000, date: '2026-08-02', vendor: 'Chimaguli Agrovet' },
    { id: 5, name: 'Thrips insecticide (1L)', type: 'Protectant', qty: 2, unit: 'L', price: 62000, date: '2026-08-20', vendor: 'Chimaguli Agrovet' },
    { id: 6, name: 'Fungicide — Mancozeb 80% (1kg)', type: 'Protectant', qty: 1, unit: 'kg', price: 85000, date: '2026-08-26', vendor: 'Chimaguli Agrovet' }
  ],
  irrigation: {
    autoMode: true, valveOn: false,
    litersToday: 0, history: [],
    waterCostPerM3: 220
  },
  bookings: [
    { id: 1, name: 'Massey Ferguson 4708 (75 HP)', cat: 'Tractor', startDate: '2026-06-22', endDate: '2026-06-23', days: 2, pricePerDay: 285000, total: 570000, status: 'completed', owner: 'Juma Mfaume', loc: 'Arusha' }
  ],
  transport: [
    { id: 1, driver: 'Grace Mlay', vehicle: 'Isuzu Canter (3-ton)', capacityKg: 3000, commodity: 'Onions', qty: 2500, date: 'Planned at harvest', pickup: 'Arumeru', dest: 'Dodoma (Kibaigwa)', km: 420, total: 504000, status: 'planned' }
  ],
  cropLog: [
    { id: 1,  date: '2026-06-03', stage: 'nursery',    action: 'Sowed seed in 400m² seedbeds',        cost: 0 },
    { id: 2,  date: '2026-06-20', stage: 'nursery',    action: 'Harden-off seedlings begun',          cost: 0 },
    { id: 3,  date: '2026-06-22', stage: 'transplant', action: 'Field tilled & beds formed (tractor)', cost: 570000 },
    { id: 4,  date: '2026-07-15', stage: 'transplant', action: 'Transplanted 32,000 seedlings @ 10cm', cost: 0 },
    { id: 5,  date: '2026-07-25', stage: 'vegetative', action: 'First manual weeding',                cost: 25000 },
    { id: 6,  date: '2026-08-02', stage: 'vegetative', action: 'Side-dressed CAN (nitrogen)',         cost: 92000 },
    { id: 7,  date: '2026-08-14', stage: 'vegetative', action: 'Second weeding & light ridging',      cost: 25000 },
    { id: 8,  date: '2026-08-22', stage: 'bulbInit',   action: 'Thrips scouting weekly begins',        cost: 0 },
    { id: 9,  date: '2026-08-28', stage: 'bulbInit',   action: 'Applied thrips insecticide (2L)',     cost: 124000 }
  ],
  tasksDone: { nursery: [], transplant: [], vegetative: [0, 1, 2], bulbInit: [2, 3] },
  health: [
    { id: 1, date: '2026-09-02', diagnosis: 'Onion Thrips (scouted)', severity: 'Moderate', confidence: 0.82, note: 'Silver streaking on lower leaves, low threshold. Sprayed Imidacloprid.', treatment: ['Re-scout in 7 days', 'Spray at threshold', 'Weed-free edges reduce host plants'] }
  ],
  produce: [],
  sales: [],
  miscCost: [{ id: 1, name: 'Irrigation water (Aug)', category: 'Water', cost: 26000, date: '2026-08-31' }]
};

export function daysInto(plantingDate) {
  const pd = new Date(plantingDate + 'T00:00:00')
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  return Math.round((now - pd) / 86400000)
}

export function getPhase(plantingDate) {
  const d = daysInto(plantingDate)
  const phase = PHASES.find(p => p.range[0] <= d && d <= p.range[1]) || PHASES[0]
  const total = PHASES.length
  const idx = PHASES.indexOf(phase)
  const pct = Math.min(100, Math.max(0, ((d - phase.range[0]) / (phase.range[1] - phase.range[0])) * 100))
  return { ...phase, daysIn: d, index: idx, total, pct, completed: PHASES.slice(0, idx), upcoming: PHASES.slice(idx + 1) }
}

export function waterSchedule(farm) {
  const phase = getPhase(farm.farm.plantingDate)
  const wp = WATER_PLAN[phase.key] || WATER_PLAN.vegetative
  const ha = soilAreaFactor(farm.farm.areaHa)
  const weeklyLiters = Math.round(wp.weeklyMm * ha * 10000)
  const daily = Math.round(weeklyLiters / 7)
  const litersPerMinute = 60 // drip line estimate
  const minutesPerDay = daily > 0 ? Math.max(5, Math.round(daily / litersPerMinute / 10) * 10) : 0
  return { phase, weeklyMm: wp.weeklyMm, weeklyLiters, dailyLiters: daily, minutesPerDay, advice: wp.advice }
}

export function pestAlerts(farm) {
  const phase = getPhase(farm.farm.plantingDate)
  const alerts = []
  if (['vegetative', 'bulbInit', 'bulbSwell'].includes(phase.key)) {
    alerts.push({ pest: 'Onion thrips', risk: phase.key === 'bulbSwell' ? 'medium' : 'high',
      action: 'Scout 10 plants/plot weekly. Spray Emamectin Benzoate or Spinetoram at 5+ thrips/plant. Keep field edges weed-free.' })
  }
  if (['bulbInit', 'bulbSwell'].includes(phase.key)) {
    alerts.push({ pest: 'Purple blotch (Alternaria)', risk: 'medium',
      action: 'After rain/dew apply Chlorothalonil or Mancozeb every 7-10 days. Improve airflow, remove infected leaves.' })
    alerts.push({ pest: 'Downy mildew', risk: 'medium',
      action: 'Cool humid nights favour it. Use copper-based fungicide; avoid evening irrigation.' })
  }
  const hp = farm.health.filter(h => ['Critical', 'High'].includes(h.severity))
  if (hp.length) alerts.push({ pest: 'Logged disease events', risk: hp[0].severity === 'Critical' ? 'high' : 'medium', action: hp[0].treatment.join(' · ') })
  return alerts
}

export function costLedger(farm) {
  const byCat = { Inputs: 0, Machinery: 0, Transport: 0, Water: 0, Labour: 0, Other: 0 }
  farm.inputs.forEach(i => byCat.Inputs += Number(i.qty) * Number(i.price))
  farm.bookings.forEach(b => { if (['completed', 'booked'].includes(b.status)) byCat.Machinery += Number(b.total) })
  farm.transport.forEach(t => { if (t.status === 'booked') byCat.Transport += Number(t.total) })
  byCat.Machinery += farm.cropLog.filter(l => l.stage === 'transplant').reduce((a, l) => a + Number(l.cost || 0), 0)
  byCat.Labour += farm.cropLog.filter(l => !['transplant', 'bulbInit'].includes(l.stage) && l.cost).reduce((a, l) => a + Number(l.cost), 0)
  farm.miscCost.forEach(m => { byCat[m.category || 'Other'] = (byCat[m.category || 'Other'] || 0) + Number(m.cost) })
  const totalCost = Object.values(byCat).reduce((a, b) => a + b, 0)
  return { ...byCat, totalCost }
}

export function revenueModel(farm) {
  const salesRevenue = farm.sales.reduce((a, s) => a + Number(s.revenue), 0)
  const market = onionMarket()
  const projectedKg = yieldForecast(farm.farm.areaHa, farm.health)
  const costs = costLedger(farm)
  const projectedRevenue = Math.round(projectedKg * market.pricePerKg)
  const projectedProfit = projectedRevenue - costs.totalCost
  const marginPct = projectedRevenue ? Math.round(projectedProfit / projectedRevenue * 100) : 0
  const costPerKg = projectedKg ? Number((costs.totalCost / projectedKg).toFixed(0)) : 0
  const breakEvenKg = market.pricePerKg ? Math.ceil(costs.totalCost / market.pricePerKg) : 0
  return { salesRevenue, market, projectedKg, projectedRevenue, projectedProfit, marginPct, costPerKg, breakEvenKg, costs }
}

export function buyList(farm, phaseKey) {
  const soil = farm.soilTest.done ? soilGuidance(farm.soilTest) : null
  const plan = fertilizerPlan(farm.soilTest || { done: false, pH: null }, farm.farm.areaHa)
  const list = []
  const owned = new Set(farm.inputs.map(i => i.name.toLowerCase()))
  const push = (name, type, stage, qty, unit, price, why) => {
    list.push({ name, type, stage, qty, unit, price, total: qty * price, needed: true, why })
  }
  plan.forEach(p => push(p.name, 'Fertilizer', p.stage, p.amount, p.unit, Math.round(p.estPricePerUnit), null))
  if (soil && soil.amendments.length) soil.amendments.forEach(a => push(a.name, a.name.includes('TSP') ? 'Fertilizer' : 'Amendment', 'Pre-planting', a.amountKg, 'kg', 2000, a.note))
  if (['vegetative', 'bulbInit', 'bulbSwell'].includes(phaseKey)) {
    push('Thrips insecticide (1L)', 'Protectant', phaseKey, 1, 'L', 62000, 'Scouted / high pressure in your region')
    push('Chlorothalonil fungicide (1L)', 'Protectant', phaseKey, 1, 'L', 78000, 'Protect bulbs from purple blotch after rain')
  }
  if (['bulbSwell', 'maturity', 'harvest'].includes(phaseKey)) {
    push('Onion harvesting nets (50kg)', 'Other', 'Harvest', Math.ceil((farm.farm.areaHa * 25 * 1000) / 50 / 10) * 10, 'net', 1500, 'For grading & market bags')
  }
  return list
}

const BRIEF = (farm, phase) => {
  const m = onionMarket(), adv = marketAdvice(m.pricePerKg, m.changePct), r = revenueModel(farm)
  return `🌾 ${farm.farm.cropLabel} · Day ${phase.daysIn} — ${phase.label}\n` +
    `Stage: ${phase.desc}\n` +
    `🌡 Market: ${m.market} · ${m.pricePerKg.toLocaleString()} TSh/kg (${m.changePct > 0 ? '+' : ''}${m.changePct}%) → ${adv.verdict}\n` +
    `💰 Spent ${r.costs.totalCost.toLocaleString()} TSh · Projected ${(r.projectedKg / 1000).toFixed(1)} t → ${r.projectedRevenue.toLocaleString()} TSh · ${r.marginPct}% margin`
}

export function assistantReply(q, farm) {
  const ql = (q || '').toLowerCase()
  const phase = getPhase(farm.farm.plantingDate)
  const soil = farm.soilTest.done ? farm.soilTest : null
  const farmCosts = costLedger(farm)
  const m = onionMarket()
  const adv = marketAdvice(m.pricePerKg, m.changePct)
  const econ = revenueModel(farm)
  const water = waterSchedule(farm)
  const alerts = pestAlerts(farm)

  if (/brief|sasa|status|hali|update|summary|taarifa|habari/.test(ql)) return BRIEF(farm, phase)
  if (/mbolea|fertiliz|nutrient|tope|urea|npk|dap/.test(ql)) {
    const plan = fertilizerPlan(farm.soilTest || {}, farm.farm.areaHa)
    const lines = plan.map(p => `→ ${p.name}: ${p.amount} ${p.unit} at ${p.stage} (≈${p.total.toLocaleString()} TSh)`)
    return `🧪 Soil pH ${soil ? soil.ph : '—'} · N ${soil ? soil.N : '—'}%, P ${soil ? soil.P : '—'}ppm, K ${soil ? soil.K : '—'}ppm\nFertiliser plan for ${farm.farm.areaHa} ha:\n` + lines.join('\n')
  }
  if (/maji|umwagilia|water|irrigat|drip/.test(ql)) {
    return `💧 ${water.phase.label}: ${water.weeklyMm}mm/week = ${water.weeklyLiters.toLocaleString()} L drinking this week (~${water.minutesPerDay} min/day drip).\n${water.advice}`
  }
  if (/io|insecticide|magonjwa|dawa|thrips|pest|shina|dodo/.test(ql) || /spray/.test(ql)) {
    if (!alerts.length) return '✅ No active pest alerts for your onion crop right now.'
    return alerts.map(a => `⚠️ ${a.pest} (risk ${a.risk})\n${a.action}`).join('\n\n')
  }
  if (/bei|market|soko|price|profit|faida|ninunue|prices/.test(ql)) {
    return `📈 ${m.name} @ ${m.market}: ${m.pricePerKg.toLocaleString()} TSh/kg (${m.changePct > 0 ? '+' : ''}${m.changePct}% vs last wk) → ${adv.verdict}\n${adv.msg}`
  }
  if (/ekonomia|economics|gharama|cost|bajeti|budget|fedha|money/.test(ql)) {
    return `💰 Cost to date: ${farmCosts.totalCost.toLocaleString()} TSh\n(Yields in Farm Economics). Projected ${(econ.projectedKg / 1000).toFixed(1)} t @ ${m.pricePerKg.toLocaleString()} = ${econ.projectedRevenue.toLocaleString()} TSh → ${econ.marginPct}% margin.\nBreak-even at ${econ.breakEvenKg.toLocaleString()} kg.`
  }
  if (/soil|udongo|pH|chokaa|lime|asidi/.test(ql)) {
    const g = soilGuidance(farm.soilTest)
    if (g.status === 'unknown') return 'Add a soil test in Soil Intelligence to unlock recommendations.'
    const line = g.nutrients.map(n => `${n.label}: ${n.value ?? '—'} (${n.status})`).join(' · ')
    return `🧪 ${line}\n` + (g.amendments.length ? 'Amendments:\n' + g.amendments.map(a => `→ ${a.name} ${a.amountKg}kg — ${a.note}`).join('\n') : 'No amendments needed — soil already near target for onion.')
  }
  if (/yield|mazao|mavuno|kila|\bt\b|tonnes|tons|kg/.test(ql)) {
    return `🌾 Projected yield: ${(econ.projectedKg / 1000).toFixed(1)} tonnes over ${farm.farm.areaHa} ha (${Math.round(econ.projectedKg / farm.farm.areaHa / 1000)}t/ha). You're in ${phase.label.toLowerCase()} — stay on the crop calendar!`
  }
  const kw = { '...': 'default' }
  kw['hello'] = 'default'; kw['hi'] = 'default'; kw['jambo'] = 'default'
  if (/hello|hi|jambo|habari|salamu/.test(ql)) return `Habari, ${farm.farm.farmer}! 👋 I'm watching your ${farm.farm.cropLabel} crop — day ${phase.daysIn}, ${phase.label}. Ask me about soil, fertiliser, irrigation, pests, prices, or your budget.`
  if (/asante|thank|shukran/.test(ql)) return 'Karibu sana! 🧅 Your onions will thank you.'
  return `Pole, sijaelewa — but I can tell you about the ${farm.farm.cropLabel} crop: soil, fertiliser, irrigation, pests, market prices, yield or farm economics.`
}

export const AI_RESPONSES = {
  vaccine: "Ratiba za chanjo: Kuku wanahitaji Newcastle wiki 1, 6, 14. Ng'ombe FMD kila miezi 6. Mbuzi PPR kila mwaka.",
  irrigation: "Mwagilia asubuhi mapema (5-7am) kupunguza uvukizi. Weka unyevu wa udongo 40-60%.",
  maize: "Panda mahindi mwanzoni mwa mvua. Nafasi: 75cm x 25cm. NPK wakati wa kupanda, urea wiki ya 4.",
  chicken: "Kuku wa mayai wanaanza kutaga wiki 18-22. Mwanga saa 16/siku. Chakula 110-120g kwa siku.",
  cattle: "Ng'ombe wanahitaji maji 25-30L kwa siku. Dawa ya minyoo kila miezi 3.",
  goat: "Mbuzi wanapenda majani ya miti kuliko nyasi. Maji 2-4L kwa siku. Kata kwato kila wiki 6."
};
export function genericAi(q) {
  const ql = q.toLowerCase()
  for (const k in AI_RESPONSES) if (ql.includes(k)) return AI_RESPONSES[k]
  if (/price|bei|soko|market/.test(ql)) return `Vitunguu (onion) @ Arusha: ${onionMarket().pricePerKg.toLocaleString()} TSh/kg — check Marketplace for the full list.`
  if (/help|msaada|nisaidie/.test(ql)) return 'Naweza kusaidia na: mazao, mifugo, mbolea, umwagiliaji, wadudu, na bei za soko.'
  return "Habari! 😊 I can help with crops, livestock, fertiliser, irrigation, pests or prices. Or open Farm Dashboard for a full briefing."
}