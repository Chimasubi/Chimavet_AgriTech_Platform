import { Link } from "react-router";
import { Sprout, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

const sections = [
  {
    title: "Platform",
    links: [
      { label: "Agrovet Shop", to: "/shop" },
      { label: "Equipment Rental", to: "/equipment-rental" },
      { label: "Crop Marketplace", to: "/marketplace" },
      { label: "Smart Irrigation", to: "/irrigation" },
    ],
  },
  {
    title: "Farming Tools",
    links: [
      { label: "Smart Farming", to: "/smart-farming" },
      { label: "Shamba Analytics", to: "/shamba-analytics" },
      { label: "ChimaAI Assistant", to: "/marketplace" },
      { label: "Home", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-950 via-green-900 to-green-950 text-green-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-gradient-to-tr from-green-800 via-green-600 to-green-500 text-white p-2.5 rounded-2xl">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  Chima<span className="text-green-500">vet</span>
                </span>
                <span className="text-[10px] font-semibold text-green-300 block mt-0.5">
                  Tanzania Agriculture Ecosystem (TSh)
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-green-200/80 max-w-xs">
              One platform for certified crop inputs, machinery hire, market access, smart irrigation, and farm analytics across Tanzania.
            </p>
            <div className="flex gap-2.5 mt-5">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-green-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs text-green-200/80 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-xs text-green-200/80 font-medium">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-green-400 shrink-0" /> Morogoro Farm Station, Tanzania
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-400 shrink-0" /> +255 700 000 000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-green-400 shrink-0" /> support@chimavet.co.tz
              </li>
            </ul>
            <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] leading-relaxed text-green-200/70">
              Prices displayed in Tanzanian Shillings (TSh). Mobile money via M-Pesa & Tigo Pesa.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-green-300/60 font-medium">
          <span>© {new Date().getFullYear()} Chimavet Agriculture Ecosystem. All rights reserved.</span>
          <span>Powered by Smart Farming IoT · Precision Agriculture in Tanzania</span>
        </div>
      </div>
    </footer>
  );
}