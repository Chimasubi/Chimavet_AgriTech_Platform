import { useState, useEffect } from "react";
import { Tractor, Calendar, MapPin, ShieldCheck, Fuel, UserCheck, Wrench, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { PageBanner } from "./ui/PageBanner";
import { toast } from "sonner";
import { api, Equipment } from "../services/api";

const categories = ["All", "Tractors", "Harvesters", "Irrigation Rigs"];

export function EquipmentRental() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Booking Modal Form State
  const [farmerName, setFarmerName] = useState("");
  const [phone, setPhone] = useState("+255 7");
  const [region, setRegion] = useState("Morogoro");
  const [durationDays, setDurationDays] = useState("2");
  const [pricingType, setPricingType] = useState<"day" | "acre">("day");
  const [bookingDate, setBookingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEquipment = async () => {
    setLoading(true);
    const data = await api.getEquipment(selectedCategory);
    setEquipmentList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment || !farmerName.trim()) {
      toast.error("Please fill in your name and M-Pesa / Tigo Pesa contact number");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      toast.error("Please enter a valid phone number (e.g. +255 712 345 678)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.bookEquipment({
        equipmentId: selectedEquipment.id,
        farmerName,
        phone,
        region,
        durationDays,
        bookingDate: bookingDate || new Date().toISOString().split("T")[0],
        pricingType,
      });

      if (res.success) {
        toast.success(`Machinery Booked! Booking ID: ${res.booking.id}. Operator dispatched to ${res.booking.region}`);
        setSelectedEquipment(null);
      } else {
        toast.error(res.message || "Failed to process machinery booking.");
      }
    } catch (err) {
      toast.error("Failed to process machinery booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const effectiveRate = (eq: Equipment) => (selectedEquipment?.id === eq.id ? eq : eq);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-dvh">
      <PageBanner
        badge={<>🚜 Kilimo Kwanza Machinery Hub</>}
        title="Agricultural Equipment & Tractor Rental"
        subtitle="Rent high-power tractors, combine harvesters, and solar irrigation pumps across Arusha, Morogoro, Mbeya, & Dodoma."
        actions={
          <div className="flex items-center gap-2 bg-black/20 p-3 rounded-2xl border border-white/10 text-xs">
            <UserCheck className="w-5 h-5 text-green-300" />
            <div>
              <span className="font-bold text-white block">Certified Operators Included</span>
              <span className="text-green-200/80">Professional drivers on-site</span>
            </div>
          </div>
        }
      />

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar overscroll-contain">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-5 text-xs font-semibold whitespace-nowrap ${
              selectedCategory === category ? "bg-green-700 hover:bg-green-800 text-white shadow-sm" : "bg-white"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Equipment Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-96 animate-pulse bg-slate-200/60 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((eq) => (
            <Card key={eq.id} className="overflow-hidden flex flex-col justify-between rounded-3xl border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow bg-white">
              <div>
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-green-300 border-none text-[11px]">
                    {eq.region}
                  </Badge>
                  {!eq.available && (
                    <Badge className="absolute bottom-3 left-3 bg-slate-800/90 text-amber-300 border-none text-[10px]">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Currently Unavailable
                    </Badge>
                  )}
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                    {eq.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-2">{eq.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{eq.specifications}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-green-600" /> {eq.operatorIncluded ? "Operator Ready" : "Self Operated"}
                    </span>
                    <span className="flex items-center gap-1">
                      {eq.fuelIncluded ? (
                        <>
                          <Wrench className="w-3.5 h-3.5 text-green-600" /> Fuel Included
                        </>
                      ) : (
                        <>
                          <Fuel className="w-3.5 h-3.5 text-green-600" /> Diesel Powered
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Rental Rate</span>
                  <span className="text-base font-black text-green-800 font-mono">
                    TSh {eq.ratePerDay.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ day</span>
                  </span>
                </div>

                <Button
                  onClick={() => setSelectedEquipment(eq)}
                  disabled={!eq.available}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs h-9 px-4 disabled:opacity-40"
                >
                  {eq.available ? "Book Machinery" : "Unavailable"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto flex items-start p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-2xl rounded-3xl relative m-auto my-6">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setSelectedEquipment(null)}>
              <X className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-2xl">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Book {selectedEquipment.name}</h2>
                <p className="text-xs text-slate-500">Machinery dispatch & operator allocation</p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farmer / Farm Name</label>
                <Input required placeholder="e.g. Mkulima Rashidi Hassan" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number (+255)</label>
                  <Input required placeholder="+255 712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farm Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-green-600"
                  >
                    <option value="Morogoro">Morogoro / Kilosa</option>
                    <option value="Arusha">Arusha / Karatu</option>
                    <option value="Mbeya">Mbeya / Kyela</option>
                    <option value="Dodoma">Dodoma / Chamwino</option>
                    <option value="Kilimanjaro">Kilimanjaro / Moshi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pricing Model</label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-green-600"
                  >
                    <option value="day">Per Day (TSh {selectedEquipment.ratePerDay.toLocaleString()})</option>
                    <option value="acre">Per Acre (TSh {selectedEquipment.ratePerAcre.toLocaleString()})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Duration ({pricingType === "acre" ? "Acres" : "Days"})
                  </label>
                  <Input type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
                </div>
              </div>

              {pricingType === "acre" && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-green-600" /> Date: optional, defaults to today
                  <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="ml-auto w-auto h-9 text-xs" />
                </div>
              )}

              <div className="p-3 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Estimated Total Cost:</span>
                <span className="text-xl font-black text-green-800 font-mono">
                  TSh {( (effectiveRate(selectedEquipment) ? (pricingType === "acre" ? selectedEquipment.ratePerAcre : selectedEquipment.ratePerDay) : 0) * (Number(durationDays) || 1) ).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-green-700 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Operator + machine dispatched to your farm location.
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-2xl">
                {submitting ? "Booking Machinery..." : "Confirm Machinery Booking"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}