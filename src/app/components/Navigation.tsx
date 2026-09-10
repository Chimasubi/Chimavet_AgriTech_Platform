import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, Droplets, Syringe, Home, Activity, Sprout, Bell, Tractor, Store, Sparkles } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shop", label: "Agrovet Shop", icon: ShoppingBag },
    { path: "/equipment-rental", label: "Equipment Rental", icon: Tractor },
    { path: "/marketplace", label: "Crop Produce Market", icon: Store },
    { path: "/irrigation", label: "Smart Irrigation", icon: Droplets },
    { path: "/vaccination", label: "Vaccination Hub", icon: Syringe },
    { path: "/smart-farming", label: "Analytics", icon: Activity },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-tr from-green-700 via-emerald-600 to-green-500 text-white p-2.5 rounded-2xl group-hover:scale-105 transition-all shadow-md shadow-green-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans block leading-none">
                Chima<span className="text-emerald-600">vet</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                Agriculture & Vet Ecosystem (TSh)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-emerald-800 shadow-sm font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agrovet Store</span>
            </Link>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-100 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
