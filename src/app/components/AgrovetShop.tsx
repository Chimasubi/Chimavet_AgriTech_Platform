import { useState, useEffect } from "react";
import { ShoppingCart, Search, Filter, Plus, Minus, CheckCircle, Package, Truck, ShieldCheck, X, Star, Eye, Phone, CreditCard, Sparkles, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { api, Product } from "../services/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = ["All", "Fertilizers", "Crop Protection", "Seeds", "Supplements", "Equipment", "Kits"];

export function AgrovetShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Checkout Form
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+255 7");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa / Tigo Pesa");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.getProducts(selectedCategory, searchQuery);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    toast.success("Added to cart!");
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
    toast.info("Cart updated");
  };

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product?.price || 0) * count;
  }, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number (e.g. +255 712 345 678)");
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderItems = Object.entries(cart).map(([id, quantity]) => {
        const product = products.find((p) => p.id === Number(id));
        return {
          id: Number(id),
          name: product?.name || "Agrovet Input",
          price: product?.price || 0,
          quantity,
        };
      });

      const res = await api.placeOrder({
        items: orderItems,
        totalAmount: totalPrice,
        paymentMethod,
        customerName,
        phoneNumber,
        deliveryAddress: deliveryAddress || "Morogoro Farm Station",
      });

      if (res.success) {
        setOrderSuccess(res.order);
        setCart({});
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        toast.success(`M-Pesa / Tigo Pesa payment prompt sent to ${phoneNumber}`);
      }
    } catch (err) {
      toast.error("Failed to process order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Light Green Banner with Overlay */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-8">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606235357537-84aea24d4c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600"
            alt="Agrovet Inputs"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-3 backdrop-blur-md px-3.5 py-1 text-xs font-semibold">
            🌱 Certified Agrovet Distribution Store (TSh)
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Agrovet Input Store
          </h1>
          <p className="text-emerald-50 text-sm sm:text-base mb-6 leading-relaxed font-medium">
            Certified crop fertilizers, seeds, crop protection, nutrient sprays, and precision drip kits with doorstep farm delivery.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-2 rounded-full backdrop-blur-md">
              <Truck className="w-4 h-4 text-emerald-200" /> Doorstep Delivery
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-2 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-200" /> Quality Certified Inputs
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-2 rounded-full backdrop-blur-md">
              <Package className="w-4 h-4 text-emerald-200" /> Bulk Discounts
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search fertilizers, seeds, crop protection, kits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 shadow-xs text-sm rounded-xl"
          />
        </div>

        <Button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-emerald-600 hover:bg-emerald-700 h-11 px-5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {totalItems > 0 && (
            <Badge className="ml-1 bg-white text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
              {totalItems}
            </Badge>
          )}
          <span className="ml-2 font-mono text-sm border-l border-emerald-500/60 pl-2 text-emerald-100">
            TSh {totalPrice.toLocaleString()}
          </span>
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-88 animate-pulse bg-slate-200/60 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No products found</h3>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col justify-between group border-slate-200/80 rounded-2xl hover:shadow-xl transition-all duration-300 bg-white">
              <div>
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 font-semibold text-[11px] border-none">
                    {product.category}
                  </Badge>

                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setQuickViewProduct(product)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md text-slate-800 h-9 w-9 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Price</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    TSh {product.price.toLocaleString()}
                  </span>
                </div>

                {cart[product.id] ? (
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    <Button size="icon" variant="ghost" onClick={() => removeFromCart(product.id)} className="h-7 w-7 rounded-lg">
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="font-bold text-sm w-5 text-center">{cart[product.id]}</span>
                    <Button size="icon" variant="ghost" onClick={() => addToCart(product.id)} className="h-7 w-7 rounded-lg">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => addToCart(product.id)} className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold rounded-xl h-9 px-4">
                    Add to Cart
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cart Drawer & Checkout Modals */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900">Agrovet Cart ({totalItems})</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {totalItems === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium text-sm">Cart is empty</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 my-4">
                  {Object.entries(cart).map(([id, quantity]) => {
                    const product = products.find((p) => p.id === Number(id));
                    if (!product) return null;
                    return (
                      <div key={id} className="py-4 flex items-center justify-between gap-3">
                        <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{product.name}</h4>
                          <span className="text-xs text-emerald-700 font-mono font-bold">
                            TSh {(product.price * quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {totalItems > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Subtotal Amount</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    TSh {totalPrice.toLocaleString()}
                  </span>
                </div>
                <Button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-bold rounded-2xl shadow-lg">
                  Proceed to Payment
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-2xl rounded-3xl relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsCheckoutOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">M-Pesa / Tigo Pesa Checkout</h2>
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 mt-4">
              <Input required placeholder="Farmer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input required placeholder="+255 Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <Input placeholder="Farm Location (e.g. Morogoro)" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
              <Button type="submit" disabled={submittingOrder} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 font-bold rounded-2xl">
                {submittingOrder ? "Processing..." : "Confirm & Pay"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
