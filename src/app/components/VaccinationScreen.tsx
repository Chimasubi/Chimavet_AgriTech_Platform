import { useState, useEffect } from "react";
import { Syringe, Calendar, CheckCircle2, AlertCircle, Plus, Filter, Search, ShieldAlert, FileText, X, Award, Printer, Download, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { api, VaccinationRecord } from "../services/api";

const animalTypes = ["All", "Cattle", "Poultry", "Goats", "Swine"];

export function VaccinationScreen() {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificateRecord, setCertificateRecord] = useState<VaccinationRecord | null>(null);

  // Form State
  const [livestockType, setLivestockType] = useState("Cattle");
  const [tagId, setTagId] = useState("");
  const [animalName, setAnimalName] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [dateAdministered, setDateAdministered] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [vetNotes, setVetNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    const data = await api.getVaccinations(selectedType);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedType]);

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.tagId.toLowerCase().includes(q) ||
      r.animalName.toLowerCase().includes(q) ||
      r.vaccineName.toLowerCase().includes(q)
    );
  });

  const handleAddVaccination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagId || !vaccineName) {
      toast.error("Tag ID and Vaccine Name are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.addVaccination({
        livestockType,
        tagId,
        animalName: animalName || tagId,
        vaccineName,
        dosage: dosage || "1ml Subcutaneous",
        dateAdministered: dateAdministered || new Date().toISOString().split("T")[0],
        nextDueDate: nextDueDate || "In 6 Months",
        vetNotes: vetNotes || "Routine booster administered by licensed vet",
      });

      if (res.success) {
        toast.success("Vaccination record & digital certificate generated!");
        setIsModalOpen(false);
        setTagId("");
        setAnimalName("");
        setVaccineName("");
        setDosage("");
        setVetNotes("");
        fetchRecords();
      }
    } catch (err) {
      toast.error("Error logging vaccination record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-2 backdrop-blur-md px-3 py-1">
              💉 Livestock Biosecurity & Vaccine Protocol
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Vaccination Management Hub</h1>
            <p className="text-purple-100 text-sm mt-1 max-w-xl">
              Track immunity timelines, generate vet certificates, and prevent livestock disease outbreaks.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-11 px-6 rounded-2xl shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-5 h-5 mr-2" /> Log Vaccination
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card className="p-5 border-l-4 border-l-emerald-500 bg-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Vaccines Completed</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {records.filter((r) => r.status === "Completed").length} Verified
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500 bg-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Upcoming Boosters</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {records.filter((r) => r.status === "Scheduled").length} Scheduled
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-red-500 bg-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Overdue Boosters</span>
            <h3 className="text-2xl font-black text-red-600 mt-1 font-mono">
              {records.filter((r) => r.status === "Overdue").length} Action Needed
            </h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search Tag ID, animal name, or vaccine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
          {animalTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-5 text-xs font-semibold whitespace-nowrap ${
                selectedType === type ? "bg-purple-700 hover:bg-purple-800 text-white" : "bg-white"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Vaccination Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-slate-200/60 rounded-3xl" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Syringe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No vaccination records found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((r) => (
            <Card key={r.id} className="p-6 border-l-4 border-l-purple-600 rounded-3xl shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {r.livestockType}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {r.animalName} <span className="text-slate-400 font-mono text-xs">({r.tagId})</span>
                    </h3>
                  </div>
                  <Badge
                    variant={
                      r.status === "Completed"
                        ? "success"
                        : r.status === "Overdue"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {r.status}
                  </Badge>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs text-slate-700 border border-slate-100 my-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Vaccine Name:</span>
                    <span className="font-bold text-slate-900">{r.vaccineName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Dosage:</span>
                    <span>{r.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Administered Date:</span>
                    <span className="font-mono">{r.dateAdministered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Next Booster Due:</span>
                    <span className="font-mono text-purple-700 font-bold">{r.nextDueDate}</span>
                  </div>
                </div>

                {r.vetNotes && (
                  <p className="text-xs text-slate-600 italic bg-purple-50/50 p-3 rounded-xl border border-purple-100/80">
                    📝 "{r.vetNotes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCertificateRecord(r)}
                  className="text-xs text-purple-700 border-purple-200 hover:bg-purple-50 font-semibold"
                >
                  <Award className="w-3.5 h-3.5 mr-1" /> View Digital Passport
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Log Vaccination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-2xl rounded-3xl relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsModalOpen(false)}>
              <X className="w-5 h-5" />
            </Button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">Log Livestock Treatment</h2>
            <p className="text-xs text-slate-500 mb-5">Record vaccine administration for biosecurity compliance.</p>

            <form onSubmit={handleAddVaccination} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Livestock Type</label>
                  <select
                    value={livestockType}
                    onChange={(e) => setLivestockType(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Cattle">Cattle</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Goats">Goats</option>
                    <option value="Swine">Swine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag / Ear ID</label>
                  <Input required placeholder="e.g. COW-112" value={tagId} onChange={(e) => setTagId(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Animal / Group Name</label>
                <Input placeholder="e.g. Daisy or Layer Flock A" value={animalName} onChange={(e) => setAnimalName(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vaccine Name</label>
                <Input required placeholder="e.g. Foot and Mouth Disease (FMD)" value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dosage</label>
                  <Input placeholder="e.g. 2ml Subcutaneous" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date Administered</label>
                  <Input type="date" value={dateAdministered} onChange={(e) => setDateAdministered(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vet Signature & Notes</label>
                <Input placeholder="e.g. Administered by Dr. Kamau (KVB #4021)" value={vetNotes} onChange={(e) => setVetNotes(e.target.value)} />
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-purple-700 hover:bg-purple-800 h-11 font-bold rounded-2xl mt-4">
                {submitting ? "Saving..." : "Save Record"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Digital Vaccination Certificate Modal */}
      {certificateRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white p-6 shadow-2xl rounded-3xl relative text-center border-2 border-purple-200">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setCertificateRecord(null)}>
              <X className="w-5 h-5" />
            </Button>

            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest block">Official Vet Pass</span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Vaccination Passport Certificate</h2>

            <div className="bg-purple-50/60 p-4 rounded-2xl text-left my-4 text-xs space-y-2 border border-purple-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Animal Name:</span>
                <span className="font-bold text-slate-900">{certificateRecord.animalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Tag ID:</span>
                <span className="font-mono font-bold text-purple-800">{certificateRecord.tagId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Vaccine Administered:</span>
                <span className="font-bold text-slate-900">{certificateRecord.vaccineName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Administered Date:</span>
                <span className="font-mono">{certificateRecord.dateAdministered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Booster Due Date:</span>
                <span className="font-mono font-bold text-purple-700">{certificateRecord.nextDueDate}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                toast.success("Downloading Certificate PDF...");
                setCertificateRecord(null);
              }}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl"
            >
              <Printer className="w-4 h-4 mr-2" /> Print / Download Passport PDF
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
