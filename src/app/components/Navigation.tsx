import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, Droplets, Sprout, Activity, BarChart3, Tractor, Store, Home as HomeIcon } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  useEffect(() => {
    const active = document.querySelector('[data-nav-active="true"]');
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/shop", label: "Agrovet Shop", icon: ShoppingBag },
    { path: "/equipment-rental", label: "Equipment Rental", icon: Tractor },
    { path: "/marketplace", label: "Crop Marketplace", icon: Store },
    { path: "/irrigation", label: "Smart Irrigation", icon: Droplets },
    { path: "/smart-farming", label: "Smart Farming", icon: Activity },
    { path: "/shamba-analytics", label: "Shamba Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 [@media(orientation:landscape)_and_(max-height:480px)]:h-14">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-tr from-green-800 via-green-600 to-green-500 text-white p-2.5 rounded-2xl group-hover:scale-105 transition-all shadow-md shadow-green-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans block leading-none">
                Chima<span className="text-green-600">vet</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-0.5 [@media(orientation:landscape)_and_(max-height:480px)]:hidden">
                Agriculture Ecosystem (TSh)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-green-800 shadow-sm font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-green-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-green-600/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agrovet Store</span>
            </Link>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-100 custom-scrollbar [@media(orientation:landscape)_and_(max-height:480px)]:py-1.5 [@media(orientation:landscape)_and_(max-height:480px)]:gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all [@media(orientation:landscape)_and_(max-height:480px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:480px)]:py-1 [@media(orientation:landscape)_and_(max-height:480px)]:text-[11px] ${
                  isActive
                    ? "bg-green-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                data-nav-active={isActive || undefined}
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