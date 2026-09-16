import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ShoppingBag, Droplets, TrendingUp, Activity, ArrowRight, Sparkles, ChevronRight, Tractor, Store, BarChart3, LineChart, Scale, Wifi } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

const heroSlides = [
  {
    title: "Welcome to Chimavet",
    subtitle: "Your Complete Agriculture Ecosystem",
    description: "One platform for crop inputs, machinery hire, market prices, smart irrigation, and farm analytics across Tanzania.",
    image: "https://images.unsplash.com/photo-1762291635124-cb53aac4c8e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600",
  },
  {
    title: "Smart Farming, Smarter Yields",
    subtitle: "Real-Time Crop & Soil Intelligence",
    description: "Monitor soil moisture, temperature, light, and weather telemetry with IoT field sensors and auto-actuation.",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600",
  },
  {
    title: "From Seed to Market",
    subtitle: "Buy Inputs, Hire Machinery, Sell Harvest",
    description: "Shop certified agrovet inputs in TSh, rent tractors & harvesters, and trade your produce on the wholesale board.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600",
  },
];

export function Home() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: "Agrovet Shop",
      description: "Purchase certified crop inputs, fertilizers, seeds, crop protection, and irrigation supplies in TSh.",
      icon: ShoppingBag,
      link: "/shop",
      tag: "500+ Certified Inputs",
      color: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1606235357537-84aea24d4c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      title: "Equipment & Tractor Rental",
      description: "Rent John Deere tractors, rice combine harvesters, and solar water pumps with operators across Tanzania.",
      icon: Tractor,
      link: "/equipment-rental",
      tag: "Operators Included",
      color: "bg-amber-600",
      image: "https://images.unsplash.com/photo-1530267981608-a6d5494d7835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      title: "Crop Produce Marketplace",
      description: "Live wholesale commodity market prices (Maize, Rice, Beans) and direct farmer-to-buyer crop trading.",
      icon: Store,
      link: "/marketplace",
      tag: "Wholesale Board",
      color: "bg-green-600",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      title: "Smart Irrigation Control",
      description: "Monitor root-zone soil moisture telemetry and control automated pump valves remotely per field zone.",
      icon: Droplets,
      link: "/irrigation",
      tag: "Automated Valves",
      color: "bg-cyan-600",
      image: "https://images.unsplash.com/photo-1598370025936-0856434d26e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      title: "Smart Farming Dashboard",
      description: "Live IoT field sensors, trend analytics, auto-actuation triggers, and crop advisory in one place.",
      icon: Activity,
      link: "/smart-farming",
      tag: "Precision Agronomy",
      color: "bg-green-600",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
    {
      title: "Shamba Analytics Dashboard",
      description: "MACRO whole-farm yield, revenue & water insights with MICRO per-plot crop intelligence drill-down.",
      icon: BarChart3,
      link: "/shamba-analytics",
      tag: "MACRO + MICRO",
      color: "bg-green-600",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    },
  ];

  const hero = heroSlides[slideIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Green Hero Section with Auto-Rotating Carousel */}
      <section className="relative bg-gradient-to-r from-green-950 via-green-800 to-green-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.img
            key={hero.image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            src={hero.image}
            alt="Modern Farm Landscape"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-none mb-4 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-200" />
            <span>Tanzania Agriculture Ecosystem</span>
          </Badge>

          <motion.div
            key={hero.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-green-100 max-w-3xl mx-auto mb-6 leading-relaxed">
              {hero.subtitle}
            </p>
            <p className="text-base sm:text-lg text-green-50 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              {hero.description}
            </p>
          </motion.div>

          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slideIndex ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="bg-white text-green-800 hover:bg-green-50 font-extrabold px-8 py-4 rounded-2xl transition-all shadow-xl text-base flex items-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 text-green-700" />
              <span>Explore Agrovet Store</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/marketplace"
              className="bg-green-950/40 hover:bg-green-950/60 text-white font-bold px-7 py-4 rounded-2xl backdrop-blur-md transition-all border border-white/30 text-base flex items-center gap-2"
            >
              <Store className="w-5 h-5 text-green-300" />
              <span>Crop Produce Market</span>
            </Link>

            <Link
              to="/shamba-analytics"
              className="bg-green-950/40 hover:bg-green-950/60 text-white font-bold px-7 py-4 rounded-2xl backdrop-blur-md transition-all border border-white/30 text-base flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5 text-green-300" />
              <span>Shamba Analytics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-6 text-center border-green-200/60 shadow-lg bg-white rounded-2xl">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">TSh 340M+</h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Inputs & Machinery Traded</p>
          </Card>

          <Card className="p-6 text-center border-amber-200/60 shadow-lg bg-white rounded-2xl">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
              <Tractor className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">480+</h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Tractors & Harvesters Hired</p>
          </Card>

          <Card className="p-6 text-center border-green-200/60 shadow-lg bg-white rounded-2xl">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">1,500+</h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Shambas Analyzed</p>
          </Card>

          <Card className="p-6 text-center border-cyan-200/60 shadow-lg bg-white rounded-2xl">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">1,200+</h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">IoT Farms Connected</p>
          </Card>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-green-100 text-green-800 border-none mb-3 px-3.5 py-1 rounded-full">
            Our Ecosystem Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything for Modern Agriculture
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Crop inputs, machinery, market access, IoT irrigation, and farm analytics — all in one suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="overflow-hidden border-slate-200/80 rounded-3xl hover:shadow-xl transition-all duration-300 group flex flex-col justify-between bg-white"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 font-bold border-none">
                    {service.tag}
                  </Badge>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${service.color} text-white p-2.5 rounded-xl`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                  </div>

                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-2 text-green-700 font-bold text-sm hover:text-green-800 pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Open Module</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}