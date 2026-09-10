import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Store, Plus, Search, Phone, MapPin, CheckCircle, Package, Filter, X, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { api, MarketPrice, ProduceListing } from "../services/api";

export function FarmerMarketplace() {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  // Listing Form State
  const [cropName, setCropName] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [region, setRegion] = useState("Morogoro");
  const [quantityAvailable, setQuantityAvailable] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [phone, setPhone] = useState("+255 7");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [prices, produce] = await Promise.all([api.getMarketPrices(), api.getProduceListings()]);
    setMarketPrices(prices);
    setListings(produce);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !farmerName || !unitPrice) {
      toast.error("Please enter crop name, your name, and selling price in TSh");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createProduceListing({
        cropName,
        farmerName,
        region,
        quantityAvailable,
        unitPrice: Number(unitPrice),
        phone,
        description,
      });

      if (res.success) {
        toast.success("Crop harvest listed on Wholesale Marketplace!");
        setIsListingModalOpen(false);
        setCropName("");
        setFarmerName("");
        setUnitPrice("");
        setDescription("");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to list crop produce.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-2 backdrop-blur-md px-3 py-1">
              🌾 Wholesale Commodity Board & Farmer Trading Hub
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Tanzania Crop Produce Marketplace</h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-xl">
              Track live wholesale market prices in Morogoro, Arusha, Mbeya, & Kariakoo. Sell harvested crops directly to buyers.
            </p>
          </div>

          <Button
            onClick={() => setIsListingModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-2xl shadow-lg shadow-emerald-600/30"
          >
            <Plus className="w-5 h-5 mr-2" /> List Harvest Produce
          </Button>
        </div>
      </div>

      {/* Live Wholesale Market Prices Ticker Grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Live Wholesale Commodity Market Prices (TSh)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketPrices.map((p) => (
            <Card key={p.id} className="p-4 bg-white border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{p.market}</span>
                <h4 className="font-bold text-sm text-slate-900">{p.crop}</h4>
                <span className="text-xs text-slate-500">Per {p.unit}</span>
              </div>

              <div className="text-right">
                <strong className="text-base font-black text-slate-900 font-mono block">
                  TSh {p.price.toLocaleString()}
                </strong>
                <span
                  className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                    p.trend === "up" ? "text-emerald-600" : p.trend === "down" ? "text-red-500" : "text-slate-500"
                  }`}
                >
                  {p.trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {p.change}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Farmer Produce Listings Marketplace */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Direct Farmer Produce Offers</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-80 animate-pulse bg-slate-200/60 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-3xl border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img src={item.image} alt={item.cropName} className="w-full h-full object-cover" />
                    <Badge className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-emerald-300 border-none text-[11px]">
                      {item.region}
                    </Badge>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{item.cropName}</h3>
                        <span className="text-xs text-slate-500 font-medium">Farmer: {item.farmerName}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.quantityAvailable}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Asking Price</span>
                    <span className="text-lg font-black text-emerald-800 font-mono">
                      TSh {item.unitPrice.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      toast.info(`Contact Farmer ${item.farmerName}: ${item.phone}`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs h-9 px-4"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1" /> Call Farmer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* List Produce Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-2xl rounded-3xl relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsListingModalOpen(false)}>
              <X className="w-5 h-5" />
            </Button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">List Crop Produce for Sale</h2>
            <p className="text-xs text-slate-500 mb-5">Connect directly to buyers and wholesale markets across Tanzania.</p>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop / Produce Name</label>
                <Input required placeholder="e.g. White Maize or Hass Avocados" value={cropName} onChange={(e) => setCropName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farmer Full Name</label>
                  <Input required placeholder="e.g. Juma Swai" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Morogoro">Morogoro</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Mbeya">Mbeya</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Iringa">Iringa / Njombe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Available Quantity</label>
                  <Input placeholder="e.g. 100 Bags or 5 Tons" value={quantityAvailable} onChange={(e) => setQuantityAvailable(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unit Price (TSh)</label>
                  <Input required type="number" placeholder="68000" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone (+255)</label>
                <Input placeholder="+255 754 123 456" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Produce Description</label>
                <Input placeholder="e.g. Grade 1 dry maize grain, under 13% moisture." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-2xl mt-4">
                {submitting ? "Publishing Listing..." : "Publish Produce Offer"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
