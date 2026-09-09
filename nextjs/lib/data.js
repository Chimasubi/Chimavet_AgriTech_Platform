const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const TSh = n => 'TSh ' + Number(n).toLocaleString('en-US');

export const TZ_MARKETS = [
  'Dar es Salaam (Kariakoo)',
  'Arusha Central',
  'Mwanza (Kirumba)',
  'Dodoma (Kibaigwa)',
  'Mbeya (Mwanjelwa)',
  'Tanga',
  'Morogoro (Kihonda)',
  'Iringa'
];

export const PRODUCTS = [
  { id:1,  name:'Hybrid Maize Seed H614',         category:'Seeds',      price: 95000,  oldPrice: 110000, img: img('1601493700631-2b16ec4b4716'), stock: 42, desc:'Drought-tolerant, high-yield hybrid for Tanzania lowlands', rating: 4.8, reviews: 124, badge:'Bestseller' },
  { id:2,  name:'NPK 17-17-17 Fertilizer (50kg)', category:'Fertilizer', price: 145000, img: img('1759411364609-aeb30eb034e4'), stock: 18, desc:'Balanced fertilizer for maize, rice & vegetables', rating: 4.7, reviews: 89 },
  { id:3,  name:'Albendazole Dewormer 10%',       category:'Veterinary', price: 25000,  img: img('1606235357537-84aea24d4c4f'), stock: 65, desc:'Broad-spectrum dewormer for cattle, goats & sheep', rating: 4.9, reviews: 67, badge:'Top rated' },
  { id:4,  name:'Drip Irrigation Starter Kit',    category:'Equipment',  price: 385000, oldPrice: 425000, img: img('1598370025936-0856434d26e7'), stock: 7,  desc:'Complete kit covers 500 sqm · includes tape, fittings & timer', rating: 4.6, reviews: 34 },
  { id:5,  name:'Layer Chicken Feed (50kg)',      category:'Feed',       price: 68000,  img: img('1612170153139-6f881ff067e0'), stock: 33, desc:'18% protein feed for egg-laying hens', rating: 4.5, reviews: 156, badge:'Popular' },
  { id:6,  name:'Multivitamin Poultry Mix',       category:'Veterinary', price: 18000,  img: img('1607619056574-7b8d3ee536b2'), stock: 120, desc:'Water-soluble vitamins & electrolytes for poultry', rating: 4.7, reviews: 78 },
  { id:7,  name:'Battery Backpack Sprayer 16L',   category:'Equipment',  price: 155000, img: img('1655980235599-8e3d642e4993'), stock: 12, desc:'Rechargeable · 4h battery · adjustable nozzle', rating: 4.4, reviews: 42 },
  { id:8,  name:'Professional Soil Test Kit',     category:'Equipment',  price: 52000,  img: img('1416879595882-3373a0480b5b'), stock: 25, desc:'Tests pH, NPK, moisture in 10 minutes · 50 tests', rating: 4.8, reviews: 56 },
  { id:9,  name:'Newcastle Disease Vaccine',      category:'Veterinary', price: 12000,  img: img('1584036561566-baf8f5f1b144'), stock: 200, desc:'Lasota strain · 100 doses · cold-chain required', rating: 4.9, reviews: 234, badge:'Essential' },
  { id:10, name:'Hybrid Tomato Seedlings (50)',   category:'Seeds',      price: 35000,  img: img('1592841200221-a6898f307baa'), stock: 48, desc:'Roma VF variety · disease-resistant · ready to transplant', rating: 4.6, reviews: 91 },
  { id:11, name:'PPR + ET Goat Vaccine Pack',     category:'Veterinary', price: 38000,  img: img('1533318087102-b3ad366ed041'), stock: 30, desc:'Combined vaccine for Peste des Petits Ruminants & Enterotoxemia', rating: 4.7, reviews: 47 },
  { id:12, name:'Drip Irrigation Tape 500m',      category:'Equipment',  price: 195000, img: img('1591857177580-dc82b9ac4e1e'), stock: 9,  desc:'16mm emitter tape · 30cm spacing · pressure-compensating', rating: 4.5, reviews: 28 },
  { id:13, name:'Onion Seed — Mbili F1 (2kg)',    category:'Seeds',      price: 280000, img: img('1595853695584-89c11b3c8fd7'), stock: 14, desc:'Hybrid red onion · high yield · long storage · Arusha bred', rating: 4.7, reviews: 18, badge:'For onions' },
  { id:14, name:'Thrips Insecticide — Imidacloprid (1L)', category:'Veterinary', price: 62000, img: img('1532938911079-1b06ac7ceec7'), stock: 40, desc:'Systemic thrips & aphid control · safe for bulb crops', rating: 4.6, reviews: 33 },
  { id:15, name:'Onion Harvesting Nets (50kg)',   category:'Equipment',  price: 1500,  img: img('1558293994-f81175534c7a'), stock: 500, desc:'Ventilated 50kg nets for onions · re-usable · market grade', rating: 4.5, reviews: 21 }
];

export const EQUIPMENT = [
  { id:101, name:'Massey Ferguson Tractor 4708 (75 HP)', cat:'Tractor', pricePerDay: 285000, img: img('1574323347407-f5e1ad6d020b'), owner:'Juma Mfaume', loc:'Arusha', rating: 4.8, reviews: 47, specs:['75 HP diesel','4WD','Power steering','Hydraulic 3-point'] },
  { id:102, name:'John Deere Combine Harvester S660',     cat:'Harvester', pricePerDay: 850000, img: img('1625246333195-78d9c38ad449'), owner:'TAHA Co-op', loc:'Moshi', rating: 4.9, reviews: 23, specs:['Maize, wheat, rice','6-row header','GPS yield mapping','AC cabin'] },
  { id:103, name:'Disc Plough 3-Bottom (Heavy Duty)',     cat:'Tillage',   pricePerDay: 95000,  img: img('1500382017468-9049fed747ef'), owner:'Hassan Mollel', loc:'Dodoma', rating: 4.6, reviews: 34, specs:['3 x 28" discs','400kg weight','Tractor mounted','Adjustable angle'] },
  { id:104, name:'Boom Sprayer 600L (Tractor-mounted)',   cat:'Spraying',  pricePerDay: 75000,  img: img('1593115057322-e94b77572f20'), owner:'Kilimo Fresh Ltd', loc:'Iringa', rating: 4.7, reviews: 28, specs:['600L tank','12m boom','Hydraulic fold','Ceramic nozzles'] },
  { id:105, name:'Planter/Seeder 6-Row Precision',        cat:'Planting',  pricePerDay: 165000, img: img('1568605114967-8130f3a36994'), owner:'Mkulima Mbeya', loc:'Mbeya', rating: 4.8, reviews: 19, specs:['6 rows','Fertilizer box','Depth control','Maize/beans/sunflower'] },
  { id:106, name:'Farm Trailer 3-Ton (Hydraulic Tip)',    cat:'Transport', pricePerDay: 55000,  img: img('1500937386664-56d1dfef3854'), owner:'Salim Rwegasira', loc:'Morogoro', rating: 4.5, reviews: 41, specs:['3-ton capacity','Hydraulic tip','Twin axle','Braked'] },
  { id:107, name:'Power Tiller / Rotary Cultivator',      cat:'Tillage',   pricePerDay: 65000,  img: img('1592805144716-feeccccef5ac'), owner:'Asha Mwakanyemba', loc:'Tanga', rating: 4.6, reviews: 22, specs:['15 HP diesel','Rotary tiller','Walk-behind','Wet/dry soil'] },
  { id:108, name:'Water Pump 3" Diesel (Irrigation)',     cat:'Irrigation', pricePerDay: 45000, img: img('1607619056574-7b8d3ee536b2'), owner:'Bwiru Farmers Group', loc:'Mwanza', rating: 4.4, reviews: 16, specs:['3-inch outlet','Diesel 6 HP','30m head','300 L/min'] }
];

export const DRIVERS = [
  { id:201, name:'Peter Massawe',  vehicle:'Pickup (Toyota Hilux)',     capacityKg: 1500,  ratePerKm: 850,  region:'Arusha-Moshi-Dar',     rating: 4.8, trips: 142, img: img('1606166187734-a4cb74079037'), plate:'T 442 BRT' },
  { id:202, name:'Grace Mlay',     vehicle:'Isuzu Canter (3-ton)',      capacityKg: 3000,  ratePerKm: 1200, region:'Dodoma-Morogoro-Dar',  rating: 4.9, trips: 88,  img: img('1564540583246-934409427776'), plate:'T 891 DAR' },
  { id:203, name:'Hamisi Juma',    vehicle:'Lorry 10-Ton (FAW)',        capacityKg: 10000, ratePerKm: 2800, region:'Mbeya-Iringa-Dar',     rating: 4.7, trips: 56,  img: img('1601584115197-04ecc0da31d7'), plate:'T 105 MBY' },
  { id:204, name:'Rehema Sefu',    vehicle:'Refrigerated Truck (5-ton)', capacityKg: 5000, ratePerKm: 2200, region:'Moshi-Arusha-Dar',    rating: 4.9, trips: 73,  img: img('1591768793355-74d04bb6608f'), plate:'T 627 ARU', coldChain:true },
  { id:205, name:'Yusuf Mhando',   vehicle:'Tuk-tuk Cargo (500kg)',     capacityKg: 500,   ratePerKm: 350,  region:'Mwanza City + 30km',  rating: 4.6, trips: 210, img: img('1580927752452-89d86da3fa0a'), plate:'T 203 MWZ' },
  { id:206, name:'Joseph Mwakikoti', vehicle:'Box Truck (7-ton)',       capacityKg: 7000,  ratePerKm: 2400, region:'Mbeya-Songwe-Tunduma', rating: 4.7, trips: 64,  img: img('1605000797499-95a51c5269ae'), plate:'T 314 MBY' },
  { id:207, name:'Mariam Bakari',  vehicle:'Small Pickup (Tata)',       capacityKg: 1200,  ratePerKm: 700,  region:'Tanga-Pangani-Dar',   rating: 4.5, trips: 91,  img: img('1556909114-f6e7ad7d3136'), plate:'T 558 TGA' }
];

export const CATEGORIES = ['All', 'Seeds', 'Fertilizer', 'Veterinary', 'Equipment', 'Feed'];
export const EQ_CATEGORIES = ['All', 'Tractor', 'Harvester', 'Tillage', 'Spraying', 'Planting', 'Transport', 'Irrigation'];
