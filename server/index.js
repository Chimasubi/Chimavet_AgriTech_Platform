import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Agrovet Products (Prices in TSh - Tanzanian Shilling)
let products = [
  {
    id: 1,
    name: "Mancozeb 80% WP Fungicide (500g)",
    category: "Crop Protection",
    price: 38000, // TSh
    image: "https://images.unsplash.com/photo-1606235357537-84aea24d4c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Broad-spectrum fungicide for early & late blight in tomatoes, potatoes, and vegetables.",
    dosage: "2.5kg per hectare in protective spraying program",
  },
  {
    id: 2,
    name: "NPK Fertilizer 20-20-20 (50kg)",
    category: "Fertilizers",
    price: 98000, // TSh
    image: "https://images.unsplash.com/photo-1759411364609-aeb30eb034e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Balanced water-soluble crop fertilizer - 50kg bag for maize, rice, & vegetables.",
    dosage: "50kg per acre during early vegetative growth",
  },
  {
    id: 3,
    name: "Foliar Micro-Nutrient Mix (1kg, 12 Elements)",
    category: "Fertilizers",
    price: 45000, // TSh
    image: "https://images.unsplash.com/photo-1655980235599-8e3d642e4993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Chelated micronutrients (Zn, Fe, Mn, B, Cu, Mo) for maize, rice, beans, and horticulture.",
    dosage: "200g per acre dissolved in 100L water for foliar spray",
  },
  {
    id: 4,
    name: "Lambda-cyhalothrin Insecticide (250ml)",
    category: "Crop Protection",
    price: 28000, // TSh
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Effective contact & stomach insecticide for fall armyworm, aphids, and bollworms in crops.",
    dosage: "150ml per hectare against fall armyworm in maize",
  },
  {
    id: 5,
    name: "Bio-Stimulant Seaweed Extract (1L)",
    category: "Supplements",
    price: 24000, // TSh
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Organic seaweed-based bio-stimulant for strong rooting, flowering, and stress recovery in crops.",
    dosage: "50ml per 20L water every 14 days during vegetative stage",
  },
  {
    id: 6,
    name: "Drip Irrigation Starter Kit (0.5 Acre)",
    category: "Equipment",
    price: 420000, // TSh
    image: "https://images.unsplash.com/photo-1598370025936-0856434d26e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Complete drip irrigation kit with mainline pipes, drip tapes, filters & emitters.",
    dosage: "Covers 0.5 acre vegetable or fruit orchard",
  },
];

let orders = [];

// Equipment Rental Registry (Tanzania Machinery)
let rentalEquipment = [
  {
    id: 101,
    name: "John Deere 5075E 75HP Tractor",
    category: "Tractors",
    ratePerDay: 180000, // TSh / day
    ratePerAcre: 45000,  // TSh / acre
    operatorIncluded: true,
    fuelIncluded: false,
    region: "Morogoro / Kilosa",
    image: "https://images.unsplash.com/photo-1530267981608-a6d5494d7835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    specifications: "75HP 4WD Diesel, Disc Plough & Ridger attachments available",
    available: true,
  },
  {
    id: 102,
    name: "Massey Ferguson 375 Multi-Discipline Tractor",
    category: "Tractors",
    ratePerDay: 160000, // TSh / day
    ratePerAcre: 40000,  // TSh / acre
    operatorIncluded: true,
    fuelIncluded: false,
    region: "Arusha / Karatu",
    image: "https://images.unsplash.com/photo-1589876076290-9515949d21c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    specifications: "75HP Heavy duty 2WD/4WD for land clearing and planting",
    available: true,
  },
  {
    id: 103,
    name: "Kubota DC-70 Rice & Grain Combine Harvester",
    category: "Harvesters",
    ratePerDay: 450000, // TSh / day
    ratePerAcre: 85000,  // TSh / acre
    operatorIncluded: true,
    fuelIncluded: true,
    region: "Mbeya / Kyela",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    specifications: "70HP Rubber Crawler, high threshing efficiency for paddy rice & wheat",
    available: true,
  },
  {
    id: 104,
    name: "Solar Mobile Irrigation Water Pump Trailer (10HP)",
    category: "Irrigation Rigs",
    ratePerDay: 75000, // TSh / day
    ratePerAcre: 25000, // TSh / acre
    operatorIncluded: false,
    fuelIncluded: false,
    region: "Dodoma / Chamwino",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    specifications: "Portable 10HP solar pump trailer with 300m discharge hose",
    available: true,
  },
];

let rentalBookings = [];

// Live Wholesale Market Prices (Tanzania Main Commodity Markets)
let marketPrices = [
  { id: 1, crop: "White Maize", market: "Kilosa / Morogoro", unit: "100kg Bag", price: 68000, change: "+3.2%", trend: "up" },
  { id: 2, crop: "Paddy Rice (Kyela Super)", market: "Mbeya Market", unit: "100kg Bag", price: 145000, change: "+1.8%", trend: "up" },
  { id: 3, crop: "Dry Beans (Yellow / Rosecoco)", market: "Arusha Wholesale", unit: "100kg Bag", price: 210000, change: "-0.5%", trend: "down" },
  { id: 4, crop: "Sunflower Seeds", market: "Dodoma Kibaigwa", unit: "100kg Bag", price: 95000, change: "+4.1%", trend: "up" },
  { id: 5, crop: "Fresh Tomatoes", market: "Dar es Salaam (Kariakoo)", unit: "Crate (60kg)", price: 58000, change: "+5.0%", trend: "up" },
  { id: 6, crop: "Raw Dairy Milk", market: "Tanga / Lushoto", unit: "Liter", price: 1300, change: "0.0%", trend: "stable" },
];

// Farmer Produce Marketplace Listings
let produceListings = [
  {
    id: 201,
    cropName: "Grade 1 White Maize",
    farmerName: "Juma Hassan",
    region: "Morogoro (Kilosa District)",
    quantityAvailable: "150 Bags (100kg each)",
    unitPrice: 66000, // TSh per bag
    phone: "+255 754 123 456",
    paymentMethodAccepted: "M-Pesa / Tigo Pesa / Cash",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    description: "Properly dried white maize grain, moisture content under 13%. Ready for miller pickup.",
    datePosted: "Today",
  },
  {
    id: 202,
    cropName: "Organic Hass Avocados",
    farmerName: "Mama Neema Swai",
    region: "Njombe / Iringa",
    quantityAvailable: "4.5 Tons",
    unitPrice: 1800000, // TSh per Ton
    phone: "+255 784 987 654",
    paymentMethodAccepted: "Airtel Money / Bank Transfer",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    description: "Export-grade Hass avocados grown at high altitude. Rich oil content, pesticide-free.",
    datePosted: "Yesterday",
  },
  {
    id: 203,
    cropName: "Kyela Aromatic Super Rice",
    farmerName: "Emmanuel Mwakipesile",
    region: "Mbeya (Kyela)",
    quantityAvailable: "80 Bags (100kg)",
    unitPrice: 140000, // TSh per bag
    phone: "+255 713 555 888",
    paymentMethodAccepted: "Tigo Pesa / M-Pesa",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    description: "Pure aromatic Kyela rice, double-milled, clean without stones. Great for wholesalers.",
    datePosted: "2 days ago",
  },
];

// IoT Irrigation Zones (Tanzania Farms)
let irrigationZones = [
  {
    id: 1,
    name: "Kilombero Paddy Sector",
    isActive: true,
    isAutoMode: true,
    flowRate: 90,
    schedule: "06:00 AM & 06:00 PM",
    soilMoisture: 72,
    lastWatered: "1 hour ago",
    sensorOnline: true,
    cropType: "Rice & Maize",
    areaSize: "5.0 Acres",
  },
  {
    id: 2,
    name: "Arusha Horticulture Orchard",
    isActive: false,
    isAutoMode: true,
    flowRate: 65,
    schedule: "07:00 AM & 05:00 PM",
    soilMoisture: 48,
    lastWatered: "6 hours ago",
    sensorOnline: true,
    cropType: "French Beans & Tomatoes",
    areaSize: "2.5 Acres",
  },
  {
    id: 3,
    name: "Morogoro Greenhouse Complex",
    isActive: true,
    isAutoMode: false,
    flowRate: 80,
    schedule: "05:30 AM & 06:30 PM",
    soilMoisture: 84,
    lastWatered: "30 mins ago",
    sensorOnline: true,
    cropType: "Sweet Peppers & Capsicum",
    areaSize: "1,200 sq meters",
  },
];

// API Endpoints

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Chimavet Tanzania Super App API', timestamp: new Date().toISOString() });
});

// Products API
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.json({ success: true, count: result.length, data: result });
});

// Orders API
app.post('/api/orders', (req, res) => {
  const { items, totalAmount, paymentMethod, customerName, phoneNumber, deliveryAddress } = req.body;

  const newOrder = {
    id: `CHV-TZ-${Date.now().toString().slice(-6)}`,
    items,
    totalAmount,
    paymentMethod: paymentMethod || 'M-Pesa Tanzania / Tigo Pesa',
    customerName: customerName || 'Mkulima Hodari',
    phoneNumber: phoneNumber || '+255 700 000 000',
    deliveryAddress: deliveryAddress || 'Morogoro Farm Station',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  res.json({ success: true, message: 'Agrovet order confirmed!', order: newOrder });
});

// Equipment Rental API
app.get('/api/rental/equipment', (req, res) => {
  const { category, region } = req.query;
  let result = [...rentalEquipment];

  if (category && category !== 'All') {
    result = result.filter(e => e.category.toLowerCase() === String(category).toLowerCase());
  }

  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/rental/book', (req, res) => {
  const { equipmentId, farmerName, phone, region, durationDays, bookingDate, pricingType } = req.body;

  const eq = rentalEquipment.find(e => e.id === Number(equipmentId));
  if (!eq) {
    return res.status(404).json({ success: false, message: 'Equipment not found' });
  }

  const rate = pricingType === 'acre' ? eq.ratePerAcre : eq.ratePerDay;
  const totalCost = rate * (Number(durationDays) || 1);

  const booking = {
    id: `RNT-TZ-${Date.now().toString().slice(-6)}`,
    equipmentName: eq.name,
    farmerName,
    phone,
    region: region || eq.region,
    durationDays: Number(durationDays) || 1,
    bookingDate: bookingDate || new Date().toISOString().split('T')[0],
    totalCost,
    status: 'Dispatched',
    createdAt: new Date().toISOString(),
  };

  rentalBookings.unshift(booking);
  res.json({ success: true, message: `Machinery booked! Operator dispatched to ${region}.`, booking });
});

// Market Prices & Produce Listings API
app.get('/api/market/prices', (req, res) => {
  res.json({ success: true, data: marketPrices });
});

app.get('/api/market/listings', (req, res) => {
  res.json({ success: true, data: produceListings });
});

app.post('/api/market/listings', (req, res) => {
  const { cropName, farmerName, region, quantityAvailable, unitPrice, phone, description } = req.body;

  if (!cropName || !farmerName || !unitPrice) {
    return res.status(400).json({ success: false, message: 'Crop name, farmer name, and unit price are required.' });
  }

  const newListing = {
    id: produceListings.length + 201,
    cropName,
    farmerName,
    region: region || 'Arusha / Kilimanjaro',
    quantityAvailable: quantityAvailable || '50 Bags',
    unitPrice: Number(unitPrice),
    phone: phone || '+255 754 000 111',
    paymentMethodAccepted: 'M-Pesa / Tigo Pesa / Cash',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    description: description || 'Fresh farm harvest, excellent quality.',
    datePosted: 'Just now',
  };

  produceListings.unshift(newListing);
  res.json({ success: true, message: 'Crop Produce listed on Wholesale Marketplace!', listing: newListing });
});

// Irrigation API
app.get('/api/irrigation/zones', (req, res) => {
  res.json({ success: true, data: irrigationZones });
});

app.post('/api/irrigation/toggle', (req, res) => {
  const { zoneId, isActive, isAutoMode, flowRate } = req.body;
  const zone = irrigationZones.find(z => z.id === Number(zoneId));

  if (!zone) {
    return res.status(404).json({ success: false, message: 'Zone not found' });
  }

  if (isActive !== undefined) zone.isActive = Boolean(isActive);
  if (isAutoMode !== undefined) zone.isAutoMode = Boolean(isAutoMode);
  if (flowRate !== undefined) zone.flowRate = Number(flowRate);

  res.json({ success: true, message: `Updated zone ${zone.name}`, zone });
});

// ChimaAI Tanzanian Agronomy Assistant API
app.post('/api/ai/ask', (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ success: false, message: 'Prompt required' });

  const q = question.toLowerCase();
  let answer = "";
  let category = "Tanzania Kilimo Assistant";

  if (q.includes("presi") || q.includes("presha") || q.includes("bei") || q.includes("market") || q.includes("price") || q.includes("maize") || q.includes("rice") || q.includes("mahindi") || q.includes("mchele")) {
    category = "Bei za Soko la Tanzania";
    answer = `Bei za Soko la Jumla Tanzania leo (TSh):\n\n• **Mahindi (Kilosa / Morogoro)**: TSh 68,000 / Gunia (100kg)\n• **Mchele wa Kyela (Mbeya)**: TSh 145,000 / Gunia (100kg)\n• **Maharage (Arusha)**: TSh 210,000 / Gunia (100kg)\n• **Alizeti (Dodoma Kibaigwa)**: TSh 95,000 / Gunia\n\nUnaweza kuuza mazao yako moja kwa moja kwenye **Farmer Marketplace** yetu!`;
  } else if (q.includes("tractor") || q.includes("rent") || q.includes("machin") || q.includes("harvest") || q.includes("trekta") || q.includes("kodi")) {
    category = "Kukodi Mitambo & Matrekta";
    answer = `Huduma ya Kukodi Matrekta (Equipment Rental):\n\n• **John Deere 75HP**: TSh 180,000 / Siku au TSh 45,000 / Ekari.\n• **Kubota Rice Combine Harvester**: TSh 85,000 / Ekari (pamoja na Dereva na Mafuta).\n\nKitengo chetu kinatuma trekta moja kwa moja shambani kwako Arusha, Morogoro, Mbeya, au Dodoma!`;
  } else if (q.includes("mbolea") || q.includes("fert") || q.includes("npk") || q.includes("dawa ya magonjwa ya mimea") || q.includes("pesticide") || q.includes("fungicide") || q.includes("seed") || q.includes("mbegu")) {
    category = "Pembejeo za Kilimo (Agrovet)";
    answer = `Pembejeo za Kilimo zinapatikana kwenye **Agrovet Shop** yetu (bei kwa TSh):\n\n• **NPK Fertilizer 20-20-20 (50kg)**: TSh 98,000 — bora kwa mahindi, mchele na mboga.\n• **High Yield Feed & Crop Inputs**: Dukani kila kitu cha mazingira.\n• **Drip Irrigation Kit (0.5 Ekari)**: TSh 420,000.\n\nAgiza leo na malipo ya **M-Pesa / Tigo Pesa** yakubaliwe papo hapo!`;
  } else if (q.includes("irrigation") || q.includes("umwagilia") || q.includes("maji") || q.includes("soil moisture") || q.includes("unyevu")) {
    category = "Usimamizi wa Umwagiliaji (IoT)";
    answer = `Mfumo wetu wa **Smart Irrigation** unafuatilia unyevu wa udongo (soil moisture) kwa wakati halisi:\n\n1. **Kilombero Paddy Sector**: Unyevu wa udongo 72% — ratiba 06:00 & 18:00.\n2. **Arusha Horticulture Orchard**: Unyevu 48% — hitaji la kumwagilia linaonekana.\n3. **Morogoro Greenhouse**: Unyevu 84% — AUTO mode imewasha.\n\nValves za IoT zinaweza kudhibitiwa kwa mkono au kuachwa AUTO.`;
  } else if (q.includes("analytics") || q.includes("takwimu") || q.includes("mavuno") || q.includes("yield") || q.includes("forecast")) {
    category = "Shamba Analytics Dashboard";
    answer = `Dashboard ya **Shamba Analytics** inakupa:\n\n• **MACRO**: muhtasari wa mavuno, mapato, maji yaliyotumika na afya ya shamba zima.\n• **MICRO**: uchambuzi wa kila shamba/ploti binafsi (unyevu, joto, mwanga, awamu ya mimea).\n\nTembelea kipengele cha **Shamba Analytics** juu ya ukurasa kuona takwimu za sasa.`;
  } else {
    category = "ChimaAI Ecosystem Support";
    answer = `Habari Mkulima! Mimi ni ChimaAI, msaidizi wako wa Kilimo Tanzania.\n\nNinaweza kukusaidia kuhusu:\n1. Kuagiza pembejeo za Kilimo kwa TSh (Agrovet Shop).\n2. Kukodi trekta au Combine Harvester (Equipment Rental).\n3. Kuangalia bei za soko na kuuza mazao (Farmer Marketplace).\n4. Umwagiliaji wa IoT na uchambuzi wa Shamba Analytics.`;
  }

  res.json({ success: true, answer, category, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Chimavet Tanzania Super App Backend API running on port ${PORT}`);
});
