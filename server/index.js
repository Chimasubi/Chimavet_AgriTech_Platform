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
    name: "Ivermectin 1% Injectable (50ml)",
    category: "Veterinary Medicine",
    price: 45000, // TSh
    image: "https://images.unsplash.com/photo-1606235357537-84aea24d4c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Anti-parasitic solution for cattle, sheep, and swine - 50ml bottle. TVLA certified.",
    dosage: "1ml per 50kg body weight subcutaneously",
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
    name: "High Yield Dairy Feed Concentrate (70kg)",
    category: "Animal Feed",
    price: 78000, // TSh
    image: "https://images.unsplash.com/photo-1655980235599-8e3d642e4993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Formulated protein & mineral feed for dairy cows in Tanga & Arusha regions.",
    dosage: "2kg per 5 litres of milk produced daily",
  },
  {
    id: 4,
    name: "Oxytetracycline LA 20% (100ml)",
    category: "Veterinary Medicine",
    price: 32000, // TSh
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Long-acting broad spectrum antibiotic for bacterial livestock infections.",
    dosage: "1ml per 10kg body weight intramuscularly",
  },
  {
    id: 5,
    name: "Calcium & Phosphorus Oral Booster (500ml)",
    category: "Supplements",
    price: 24000, // TSh
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    inStock: true,
    description: "Oral energy & calcium booster for post-calving milk fever prevention.",
    dosage: "1 bottle (500ml) immediately post-calving",
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

// Vaccination Records (TVLA Certified Tanzania Registry)
let vaccinationRecords = [
  {
    id: 1,
    livestockType: "Cattle",
    tagId: "TZ-COW-904",
    animalName: "Simba",
    vaccineName: "Foot and Mouth Disease (TVLA FMD)",
    dosage: "2ml Subcutaneous",
    dateAdministered: "2026-02-10",
    nextDueDate: "2026-08-10",
    status: "Completed",
    vetNotes: "Administered by Dr. Mvungi (TVLA Arusha Officer). Animal healthy.",
  },
  {
    id: 2,
    livestockType: "Cattle",
    tagId: "TZ-COW-912",
    animalName: "Kijito",
    vaccineName: "Contagious Bovine Pleuropneumonia (CBPP)",
    dosage: "1ml Subcutaneous",
    dateAdministered: "2025-10-15",
    nextDueDate: "2026-10-15",
    status: "Scheduled",
    vetNotes: "Booster due in Mbeya livestock dip station.",
  },
  {
    id: 3,
    livestockType: "Poultry",
    tagId: "FLOCK-TZ-08",
    animalName: "Kuku Kuchi Flock (300 birds)",
    vaccineName: "Newcastle Disease (NDV-Lasota)",
    dosage: "Drinking water application",
    dateAdministered: "2026-01-12",
    nextDueDate: "2026-03-01",
    status: "Overdue",
    vetNotes: "Revaccination required for Morogoro poultry house.",
  },
  {
    id: 4,
    livestockType: "Goats",
    tagId: "TZ-GOAT-55",
    animalName: "Mwenzangu",
    vaccineName: "Peste des Petits Ruminants (PPR)",
    dosage: "1ml Subcutaneous",
    dateAdministered: "2026-01-25",
    nextDueDate: "2027-01-25",
    status: "Completed",
    vetNotes: "Immunity certificate issued.",
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

// Vaccinations API
app.get('/api/vaccinations', (req, res) => {
  res.json({ success: true, data: vaccinationRecords });
});

app.post('/api/vaccinations', (req, res) => {
  const { livestockType, tagId, animalName, vaccineName, dosage, dateAdministered, nextDueDate, vetNotes } = req.body;

  const newRecord = {
    id: vaccinationRecords.length + 1,
    livestockType: livestockType || 'Cattle',
    tagId,
    animalName: animalName || tagId,
    vaccineName,
    dosage: dosage || '1ml Subcutaneous',
    dateAdministered: dateAdministered || new Date().toISOString().split('T')[0],
    nextDueDate: nextDueDate || 'In 6 Months',
    status: 'Completed',
    vetNotes: vetNotes || 'TVLA certified veterinarian log',
  };

  vaccinationRecords.unshift(newRecord);
  res.json({ success: true, message: 'TVLA Vaccination Passport updated!', record: newRecord });
});

// ChimaAI Tanzanian Agronomy Assistant API
app.post('/api/ai/ask', (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ success: false, message: 'Prompt required' });

  const q = question.toLowerCase();
  let answer = "";
  let category = "Tanzania Kilimo Assistant";

  if (q.includes("presi") || q.includes("tsh") || q.includes("tzs") || q.includes("tigo") || q.includes("mpesa") || q.includes("pesa")) {
    category = "Malipo ya M-Pesa & Tigo Pesa";
    answer = `Habari! Chimavet Super App inakubali malipo ya papo hapo kupitia **M-Pesa Tanzania**, **Tigo Pesa**, na **Airtel Money** kwa Shilingi za Tanzania (TSh).\n\n• **Lipa kwa Namba**: Tumia namba yako ya simu kuanzia +255 7XX XXX XXX.\n• **Hati ya Malipo**: Baada ya kukamilisha malipo, utapokea Risiti ya Kidigitali papo hapo.`;
  } else if (q.includes("presi") || q.includes("presi") || q.includes("market") || q.includes("presha") || q.includes("price") || q.includes("maize") || q.includes("rice")) {
    category = "Bei za Soko la Tanzania";
    answer = `Bei za Soko la Jumla Tanzania leo (TSh):\n\n• **Mahindi (Kilosa / Morogoro)**: TSh 68,000 / Gunia (100kg)\n• **Mchele wa Kyela (Mbeya)**: TSh 145,000 / Gunia (100kg)\n• **Maharage (Arusha)**: TSh 210,000 / Gunia (100kg)\n• **Alizeti (Dodoma Kibaigwa)**: TSh 95,000 / Gunia\n\nUnaweza kuuza mazao yako moja kwa moja kwenye **Farmer Marketplace** yetu!`;
  } else if (q.includes("tractor") || q.includes("rent") || q.includes("machin") || q.includes("harvest")) {
    category = "Kukodi Mitambo & Matrekta";
    answer = `Huduma ya Kukodi Matrekta (Equipment Rental):\n\n• **John Deere 75HP**: TSh 180,000 / Siku au TSh 45,000 / Ekari.\n• **Kubota Rice Combine Harvester**: TSh 85,000 / Ekari (pamoja na Dereva na Mafuta).\n\nKitengo chetu kinatuma trekta moja kwa moja shambani kwako Arusha, Morogoro, Mbeya, au Dodoma!`;
  } else if (q.includes("vaccin") || q.includes("chanjo") || q.includes("tvla") || q.includes("dawa")) {
    category = "Chanjo za Mifugo (TVLA)";
    answer = `Mwongozo wa Chanjo za Mifugo Tanzania (TVLA Protocol):\n\n1. **Ng'ombe**: Chanjo ya Homa ya Mapafu (CBPP) & Magonjwa ya Miguu na Midomo (FMD).\n2. **Kuku**: Chanjo ya Kideri (Newcastle Lasota) kila baada ya wiki 6 kupitia maji ya kunywa.\n3. **Mbuzi / Kondoo**: Chanjo ya PPR kila mwaka.\n\nRipoti na Pasipoti zote za Chanjo zinalindwa na mamlaka ya TVLA.`;
  } else {
    category = "ChimaAI Ecosystem Support";
    answer = `Habari Mkulima! Mimi ni ChimaAI, msaidizi wako wa Kilimo na Mifugo Tanzania.\n\nNinaweza kukusaidia kuhusu:\n1. Kuagiza pembejeo za Kilimo kwa TSh (Agrovet Shop).\n2. Kukodi trekta au Combine Harvester (Equipment Rental).\n3. Kuangalia bei za soko na kuuza mazao (Farmer Marketplace).\n4. Ratiba za chanjo za mifugo na umwagiliaji wa IoT.`;
  }

  res.json({ success: true, answer, category, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Chimavet Tanzania Super App Backend API running on port ${PORT}`);
});
