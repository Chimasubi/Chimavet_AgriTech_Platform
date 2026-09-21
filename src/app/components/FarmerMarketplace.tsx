import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Plus, Phone, MapPin, Package, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { PageBanner } from "./ui/PageBanner";
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
    if (!cropName.trim() || !farmerName.trim()) {
      toast.error("Please enter crop name and your full name");
      return;
    }
    if (!unitPrice || Number(unitPrice) <= 0) {
      toast.error("Please enter a valid selling price in TSh");
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      toast.error("Please enter a valid contact phone (+255...)");
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
        setPhone("+255 7");
        setQuantityAvailable("");
        fetchData();
      } else {
        toast.error(res.message || "Failed to list crop produce.");
      }
    } catch (err) {
      toast.error("Failed to list crop produce.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-dvh">
      <PageBanner
        badge={<>🌾 Wholesale Commodity Board & Farmer Trading Hub</>}
        title="Tanzania Crop Produce Marketplace"
        subtitle="Track live wholesale market prices in Morogoro, Arusha, Mbeya, & Kariakoo. Sell harvested crops directly to buyers."
        actions={
          <Button
            onClick={() => setIsListingModalOpen(true)}
            className="bg-white text-green-900 hover:bg-green-50 font-bold h-11 px-6 rounded-2xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" /> List Harvest Produce
          </Button>
        }
      />

      {/* Live Wholesale Market Prices Ticker Grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
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
                    p.trend === "up" ? "text-green-600" : p.trend === "down" ? "text-red-500" : "text-slate-500"
                  }`}
                >
                  {p.trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : p.trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : null}
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
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No produce listed yet</h3>
            <p className="text-xs text-slate-500 mt-2">Be the first to list your harvest.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-3xl border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img src={item.image} alt={item.cropName} className="w-full h-full object-cover" />
                    <Badge className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-green-300 border-none text-[11px]">
                      <MapPin className="w-3 h-3 mr-1 inline" /> {item.region}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-white/90 text-slate-700 border-none text-[10px]">
                      {item.datePosted}
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
                    <span className="text-lg font-black text-green-800 font-mono">
                      TSh {item.unitPrice.toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={`tel:${item.phone.replace(/\s+/g, "")}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs h-9 px-4 inline-flex items-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1" /> Call Farmer
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* List Produce Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto flex items-start p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-2xl rounded-3xl relative m-auto my-6">
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
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-green-600"
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
                  <Input required type="number" min="0" placeholder="68000" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
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

              <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-2xl mt-4">
                {submitting ? "Publishing Listing..." : "Publish Produce Offer"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}