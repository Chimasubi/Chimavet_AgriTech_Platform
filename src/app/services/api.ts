export interface Product {
  id: number;
  name: string;
  category: string;
  price: number; // TSh
  image: string;
  inStock: boolean;
  description: string;
  dosage?: string;
}

export interface Equipment {
  id: number;
  name: string;
  category: string;
  ratePerDay: number; // TSh / day
  ratePerAcre: number; // TSh / acre
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  region: string;
  image: string;
  specifications: string;
  available: boolean;
}

export interface MarketPrice {
  id: number;
  crop: string;
  market: string;
  unit: string;
  price: number; // TSh
  change: string;
  trend: "up" | "down" | "stable";
}

export interface ProduceListing {
  id: number;
  cropName: string;
  farmerName: string;
  region: string;
  quantityAvailable: string;
  unitPrice: number; // TSh
  phone: string;
  paymentMethodAccepted: string;
  image: string;
  description: string;
  datePosted: string;
}

export interface Zone {
  id: number;
  name: string;
  isActive: boolean;
  isAutoMode: boolean;
  flowRate: number;
  schedule: string;
  soilMoisture: number;
  lastWatered: string;
  sensorOnline: boolean;
  cropType?: string;
  areaSize?: string;
}

export interface VaccinationRecord {
  id: number;
  livestockType: string;
  tagId: string;
  animalName: string;
  vaccineName: string;
  dosage: string;
  dateAdministered: string;
  nextDueDate: string;
  status: "Completed" | "Scheduled" | "Overdue";
  vetNotes: string;
}

export const api = {
  // Products API
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (search) params.append("search", search);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  async placeOrder(payload: any) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Equipment Rental API
  async getEquipment(category?: string): Promise<Equipment[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      const res = await fetch(`/api/rental/equipment?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch equipment");
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  async bookEquipment(payload: any) {
    const res = await fetch("/api/rental/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Market Prices & Marketplace Listings API
  async getMarketPrices(): Promise<MarketPrice[]> {
    try {
      const res = await fetch("/api/market/prices");
      if (!res.ok) throw new Error("Failed to fetch market prices");
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  async getProduceListings(): Promise<ProduceListing[]> {
    try {
      const res = await fetch("/api/market/listings");
      if (!res.ok) throw new Error("Failed to fetch produce listings");
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  async createProduceListing(payload: any) {
    const res = await fetch("/api/market/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Irrigation Zones API
  async getZones(): Promise<Zone[]> {
    try {
      const res = await fetch("/api/irrigation/zones");
      if (!res.ok) throw new Error("Failed to fetch zones");
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  async toggleZone(zoneId: number, isActive?: boolean, isAutoMode?: boolean, flowRate?: number) {
    const res = await fetch("/api/irrigation/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneId, isActive, isAutoMode, flowRate }),
    });
    return res.json();
  },

  // Vaccinations API
  async getVaccinations(livestockType?: string): Promise<VaccinationRecord[]> {
    try {
      const params = new URLSearchParams();
      if (livestockType && livestockType !== "All") params.append("livestockType", livestockType);

      const res = await fetch(`/api/vaccinations?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch vaccinations");
      const data = await res.json();
      return data.data;
    } catch (err) {
      return [];
    }
  },

  async addVaccination(record: Partial<VaccinationRecord>) {
    const res = await fetch("/api/vaccinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    return res.json();
  },

  // AI Assistant API
  async askAI(question: string) {
    const res = await fetch("/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    return res.json();
  },
};
