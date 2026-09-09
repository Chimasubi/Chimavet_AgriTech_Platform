// Mock AI agent logic — swap bodies for real API calls when ready.

export const TSh = n => 'TSh ' + Number(n).toLocaleString('en-US');

const CROP_DISEASES = [
  { name: 'Maize Streak Virus', confidence: 0.87, affected: 'Maize', symptoms: ['Yellow streaks along leaf veins', 'Stunted growth', 'Leaf curling'], causes: 'Spread by leafhoppers (Cicadulina spp.) and infected seed.', treatment: ['Remove and burn infected plants', 'Control leafhoppers with Imidacloprid spray', 'Plant resistant varieties (PAN 53, DK 8031)', 'Avoid late planting'], severity: 'High', icon: '🌽' },
  { name: 'Tomato Late Blight', confidence: 0.92, affected: 'Tomato / Potato', symptoms: ['Dark water-soaked lesions on leaves', 'White fungal growth under leaves', 'Brown fruit rot'], causes: 'Phytophthora infestans fungus; thrives in cool, wet weather.', treatment: ['Spray with Mancozeb 75% WP (50g/20L water)', 'Remove and destroy infected plants immediately', 'Improve air circulation by pruning', 'Apply preventive copper-based fungicides weekly'], severity: 'Critical', icon: '🍅' },
  { name: 'Common Bean Rust', confidence: 0.81, affected: 'Beans', symptoms: ['Reddish-brown pustules on leaf undersides', 'Yellow halos around spots', 'Premature leaf drop'], causes: 'Uromyces appendiculatus fungus, spread by wind and rain.', treatment: ['Spray with Sulphur 80% WP or Hexaconazole', 'Rotate crops every 2-3 years (avoid beans)', 'Plant resistant varieties (GLP 2, KAT B1)', 'Remove crop debris after harvest'], severity: 'Moderate', icon: '🫘' },
  { name: 'Cabbage Black Rot', confidence: 0.78, affected: 'Cabbage / Kale', symptoms: ['V-shaped yellow lesions from leaf edges', 'Black veins inside leaves', 'Wilting'], causes: 'Xanthomonas campestris bacteria; spread by water splash and infected seed.', treatment: ['Use certified disease-free seed', 'Hot water treat seeds at 50°C for 30 min', 'Spray with copper hydroxide (Kocide 101)', 'Practice 3-year crop rotation'], severity: 'High', icon: '🥬' },
  { name: 'Fall Armyworm', confidence: 0.94, affected: 'Maize (and 80+ other crops)', symptoms: ['Windowpane damage on young leaves', 'Frass (droppings) in whorl', 'Damaged growing point'], causes: 'Spodoptera frugiperda larvae; invasive pest from Americas.', treatment: ['Apply Emamectin Benzoate 5% WG (4g/20L) into whorl', 'Hand-pick and crush larvae in small plots', 'Use pheromone traps to monitor moth flights', 'Encourage natural predators (wasps, birds)'], severity: 'Critical', icon: '🐛' },
  { name: 'Healthy Plant', confidence: 0.95, affected: 'General', symptoms: ['Vibrant green color', 'No visible lesions', 'Normal growth pattern'], causes: 'No disease detected. Plant appears healthy.', treatment: ['Continue regular watering and fertilization', 'Monitor weekly for early signs of pests', 'Maintain good field sanitation', 'Keep records for future comparison'], severity: 'None', icon: '✅' }
]

export function diagnoseCrop({ filename = '', fileSize = 0, context = '' }) {
  const f = (filename + ' ' + context).toLowerCase()
  let match = CROP_DISEASES[CROP_DISEASES.length - 1]
  for (const d of CROP_DISEASES) {
    const keys = d.name.toLowerCase().split(' ').concat(d.affected.toLowerCase().split(/[ /]/))
    if (keys.some(k => k.length > 3 && f.includes(k))) { match = d; break }
  }
  if (fileSize === 0) match = CROP_DISEASES[CROP_DISEASES.length - 1]
  return match
}

export const COMMODITIES = [
  { id: 'maize', name: 'Mahindi (Maize)', unit: 'mfuko 90kg', emoji: '🌽', base: 95000 },
  { id: 'beans', name: 'Maharage (Beans)', unit: 'mfuko 90kg', emoji: '🫘', base: 220000 },
  { id: 'tomato', name: 'Nyanya (Tomato)', unit: 'kasha 60kg', emoji: '🍅', base: 65000 },
  { id: 'onion', name: 'Vitunguu (Onion)', unit: 'mfuko 50kg', emoji: '🧅', base: 95000 },
  { id: 'cabbage', name: 'Kabichi (Cabbage)', unit: 'mfuko 50kg', emoji: '🥬', base: 45000 },
  { id: 'potato', name: 'Viazi (Potato)', unit: 'mfuko 110kg', emoji: '🥔', base: 75000 },
  { id: 'milk', name: 'Maziwa (Milk)', unit: 'lita', emoji: '🥛', base: 1400 },
  { id: 'egg', name: 'Mayai (Eggs)', unit: 'trei 30', emoji: '🥚', base: 9500 },
  { id: 'chicken', name: 'Kuku (Broiler)', unit: 'kg hai', emoji: '🐔', base: 11500 },
  { id: 'beef', name: 'Nyama (Beef)', unit: 'kg', emoji: '🥩', base: 18500 }
]

const MARKETS = ['Dar es Salaam (Kariakoo)', 'Arusha Central', 'Mwanza (Kirumba)', 'Dodoma (Kibaigwa)', 'Mbeya (Mwanjelwa)', 'Tanga', 'Morogoro (Kihonda)', 'Iringa']

export function getMarketPrices() {
  return COMMODITIES.map(c => {
    const market = MARKETS[Math.floor(Math.random() * MARKETS.length)]
    const history = Array.from({ length: 14 }, (_, i) => {
      const variance = (Math.random() - 0.5) * 0.3
      return Math.round(c.base * (1 + variance) * (0.85 + (i / 14) * 0.3))
    })
    const current = history[history.length - 1]
    const weekAgo = history[history.length - 8]
    const trend = current > weekAgo ? 'up' : current < weekAgo ? 'down' : 'flat'
    const changePct = Number(((current - weekAgo) / weekAgo * 100).toFixed(1))
    return { ...c, market, current, weekAgo, trend, changePct, history }
  })
}

export function getAdvice(commodity, userQty = 1) {
  const prices = getMarketPrices()
  const item = prices.find(p => p.id === commodity)
  if (!item) return null
  let verdict, message, action
  if (item.trend === 'up' && item.changePct > 5) {
    verdict = 'SELL NOW'; action = 'sell'
    message = `Prices up ${item.changePct}% this week. Strong demand, favorable moment to sell.`
  } else if (item.trend === 'down' && item.changePct < -5) {
    verdict = 'HOLD'; action = 'hold'
    message = `Prices dropped ${Math.abs(item.changePct)}%. Wait 1-2 weeks for recovery unless you need cash.`
  } else {
    verdict = 'NEUTRAL'; action = 'monitor'
    message = `Stable prices (${item.changePct > 0 ? '+' : ''}${item.changePct}%). Watch for seasonal shifts.`
  }
  return { item, verdict, action, message, estimatedRevenue: item.current * userQty }
}

const SW_RESPONSES = {
  greeting: 'Habari yako! Naweza kukusaidia na mambo ya kilimo. Sema au andika swali lako.',
  default: 'Pole, sikuelewa. Jaribu kuniuliza kuhusu mazao, mifugo, umwagiliaji, au bei.',
  farewell: 'Asante kwa kuzungumza na mimi. Karibu tena!',
  help: 'Naweza kukusaidia na: mazao (mahindi, maharage, nyanya), mifugo (kuku, ng\'ombe, mbuzi), umwagiliaji, mbolea, wadudu, na bei za soko.'
}

export function getVoiceResponse(text, lang = 'sw') {
  const ql = (text || '').toLowerCase().trim()
  if (!ql) return { text: SW_RESPONSES.help, lang }
  if (/^(habari|jambo|hello|hi|salamu)/.test(ql)) return { text: SW_RESPONSES.greeting, lang }
  if (/(asante|thank|shukran)/.test(ql)) return { text: 'Karibu sana!', lang }
  if (/(bei|price|soko|market|gharama)/.test(ql)) return { text: 'Bei ya mahindi soko hili wiki hii ni kati ya TSh 85,000-105,000 kwa mfuko wa 90kg. Maharage yako juu kidogo - TSh 200,000-240,000.', lang }
  if (/(mahindi|maize)/.test(ql)) return { text: 'Mahindi hupandwa mwanzoni mwa mvua. Nafasi: 75cm x 25cm. Weka mbolea ya kupanda, kisha urea wiki ya 4.', lang }
  if (/(mbuzi|goat)/.test(ql)) return { text: 'Mbuzi wanapenda majani ya miti kuliko nyasi. Maji 2-4L kwa siku. Kata kwato kila wiki 6.', lang }
  if (/(kuku|chicken)/.test(ql)) return { text: 'Kuku wa mayai wanaanza kutaga wiki 18-22. Mpe mwanga wa saa 16 kwa siku. Chakula 110-120g kwa kuku kwa siku.', lang }
  if (/(ng'ombe|cattle)/.test(ql)) return { text: 'Ng\'ombe wanahitaji maji 25-30L kwa siku. Chanja kila mwaka. Dawa ya minyoo kila miezi 3.', lang }
  if (/(umwagilia|irrigat|maji|water)/.test(ql)) return { text: 'Mwagilia asubuhi mapema (5-7am) kupunguza uvukizi. Weka unyevu wa udongo kati ya 40-60%.', lang }
  if (/(mbolea|fertilizer)/.test(ql)) return { text: 'Tumia NPK 17-17-17 wakati wa kupanda, kisha urea kama mbolea ya juu wiki 4 baadaye. Kwa kilo 50, NPK ina gharama TSh 145,000.', lang }
  if (/(help|msaada|nisaidie)/.test(ql)) return { text: SW_RESPONSES.help, lang }
  return { text: SW_RESPONSES.default, lang }
}

export const VOICE_LANGS = [
  { code: 'sw-TZ', label: '🇹🇿 Kiswahili (Tanzania)' },
  { code: 'sw-KE', label: '🇰🇪 Kiswahili (Kenya)' },
  { code: 'en-US', label: '🇺🇸 English' }
]
