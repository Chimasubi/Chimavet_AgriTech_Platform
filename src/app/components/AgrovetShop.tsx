import { useState, useEffect } from "react";
import { ShoppingCart, Search, Plus, Minus, CheckCircle, Package, Truck, ShieldCheck, X, Eye, Phone, CreditCard, Sprout, ChevronRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { PageBanner } from "./ui/PageBanner";
import { toast } from "sonner";
import { api, Product } from "../services/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = ["All", "Fertilizers", "Crop Protection", "Seeds", "Supplements", "Equipment", "Kits"];
const paymentMethods = ["M-Pesa / Tigo Pesa", "Airtel Money", "Bank Transfer", "Cash on Delivery"];

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

  const clearCartItem = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product?.price || 0) * count;
  }, 0);

  const findProduct = (id: number) => products.find((p) => p.id === id);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Please enter the farmer's name");
      return;
    }
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length < 9) {
      toast.error("Please enter a valid phone number (e.g. +255 712 345 678)");
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderItems = Object.entries(cart).map(([id, quantity]) => {
        const product = findProduct(Number(id));
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
        toast.success(`${paymentMethod} payment prompt sent to ${phoneNumber}`);
      } else {
        toast.error(res.message || "Failed to process order.");
      }
    } catch (err) {
      toast.error("Failed to process order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-dvh">
      <PageBanner
        badge={<>🌱 Certified Agrovet Distribution Store (TSh)</>}
        title="Agrovet Input Store"
        subtitle="Certified crop fertilizers, seeds, crop protection, nutrient sprays, and precision drip kits with doorstep farm delivery."
        actions={
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-2 rounded-full backdrop-blur-md">
              <Truck className="w-4 h-4 text-green-300" /> Doorstep Delivery
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-2 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-green-300" /> Quality Certified Inputs
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3.5 py-2 rounded-full backdrop-blur-md">
              <Package className="w-4 h-4 text-green-300" /> Bulk Discounts
            </span>
          </div>
        }
      />

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
          className="relative bg-green-600 hover:bg-green-700 h-11 px-5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-green-600/20"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {totalItems > 0 && (
            <Badge className="ml-1 bg-white text-green-800 font-extrabold px-2 py-0.5 rounded-full">
              {totalItems}
            </Badge>
          )}
          <span className="ml-2 font-mono text-sm border-l border-green-500/60 pl-2 text-green-100">
            TSh {totalPrice.toLocaleString()}
          </span>
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar overscroll-contain">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-green-700 hover:bg-green-800 text-white shadow-sm"
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
          <p className="text-xs text-slate-500 mt-2">Try a different category or search term.</p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col justify-between group border-slate-200/80 rounded-2xl hover:shadow-xl transition-all duration-300 bg-white">
              <div>
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 font-semibold text-[11px] border-none">
                    {product.category}
                  </Badge>
                  {product.inStock ? (
                    <Badge className="absolute bottom-3 left-3 bg-green-600/90 text-white border-none text-[10px]">
                      <CheckCircle className="w-3 h-3 mr-1" /> In Stock
                    </Badge>
                  ) : (
                    <Badge className="absolute bottom-3 left-3 bg-slate-700/90 text-white border-none text-[10px]">Sold Out</Badge>
                  )}

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
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-green-700 transition-colors line-clamp-1">
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
                  <Button
                    onClick={() => addToCart(product.id)}
                    disabled={!product.inStock}
                    className="bg-green-600 hover:bg-green-700 text-xs font-bold rounded-xl h-9 px-4 disabled:opacity-40"
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto flex items-start p-4" onClick={() => setQuickViewProduct(null)}>
          <Card className="max-w-lg w-full bg-white p-0 shadow-2xl rounded-3xl relative overflow-hidden m-auto my-6" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-56 bg-slate-100">
              <ImageWithFallback src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
              <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-white/90 text-slate-800" onClick={() => setQuickViewProduct(null)}>
                <X className="w-5 h-5" />
              </Button>
              <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 border-none">{quickViewProduct.category}</Badge>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{quickViewProduct.name}</h3>
                <span className="text-lg font-black text-green-700 font-mono whitespace-nowrap">
                  TSh {quickViewProduct.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{quickViewProduct.description}</p>

              {quickViewProduct.dosage && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-900 leading-relaxed mb-4">
                  <span className="font-bold">💡 Application:</span> {quickViewProduct.dosage}
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 mb-4">
                {quickViewProduct.inStock ? <><CheckCircle className="w-4 h-4" /> In stock — ready for dispatch</> : <><X className="w-4 h-4" /> Currently sold out</>}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setQuickViewProduct(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!quickViewProduct.inStock}
                  onClick={() => {
                    addToCart(quickViewProduct.id);
                    setQuickViewProduct(null);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto overscroll-contain pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
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
                    const product = findProduct(Number(id));
                    if (!product) return null;
                    return (
                      <div key={id} className="py-4 flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{product.name}</h4>
                          <span className="text-xs text-green-700 font-mono font-bold">
                            TSh {(product.price * quantity).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                          <Button size="icon" variant="ghost" onClick={() => removeFromCart(Number(id))} className="h-6 w-6 rounded-md">
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-bold text-xs w-5 text-center">{quantity}</span>
                          <Button size="icon" variant="ghost" onClick={() => addToCart(Number(id))} className="h-6 w-6 rounded-md">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => clearCartItem(Number(id))} className="h-6 w-6 text-slate-400" aria-label="Remove item">
                          <X className="w-3.5 h-3.5" />
                        </Button>
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
                  <span className="text-2xl font-black text-green-700 font-mono">
                    TSh {totalPrice.toLocaleString()}
                  </span>
                </div>
                <Button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-bold rounded-2xl shadow-lg">
                  Proceed to Payment
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto flex items-start p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-2xl rounded-3xl relative m-auto my-6">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsCheckoutOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Secure Checkout</h2>
            <p className="text-xs text-slate-500 mb-4">Pay with mobile money — the payment prompt will be sent to your phone.</p>
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farmer / Buyer Name</label>
                <Input required placeholder="e.g. Mkulima Juma Hassan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number (+255)</label>
                <Input required placeholder="+255 712 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Delivery Location</label>
                <Input placeholder="e.g. Morogoro Farm Station" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-green-600"
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="p-3 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-green-700" /> Total Payable
                </span>
                <span className="text-lg font-black text-green-800 font-mono">TSh {totalPrice.toLocaleString()}</span>
              </div>
              <Button type="submit" disabled={submittingOrder} className="w-full bg-green-600 hover:bg-green-700 h-12 font-bold rounded-2xl">
                {submittingOrder ? "Processing..." : `Confirm & Pay via ${paymentMethod.split(" / ")[0]}`}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto flex items-start p-4">
          <Card className="max-w-md w-full bg-white p-8 shadow-2xl rounded-3xl text-center relative m-auto my-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Order Placed!</h2>
            <p className="text-sm text-slate-500 mb-5">Your agrovet order has been confirmed.</p>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-5 text-left">
              <div className="flex justify-between p-3 text-xs">
                <span className="font-bold text-slate-500 uppercase">Order ID</span>
                <span className="font-mono font-bold text-slate-900">{orderSuccess.id}</span>
              </div>
              <div className="flex justify-between p-3 text-xs">
                <span className="font-bold text-slate-500 uppercase">Amount</span>
                <span className="font-mono font-bold text-green-700">TSh {Number(orderSuccess.totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 text-xs">
                <span className="font-bold text-slate-500 uppercase">Payment</span>
                <span className="font-bold text-slate-800">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between p-3 text-xs">
                <span className="font-bold text-slate-500 uppercase">Delivery</span>
                <span className="font-bold text-slate-800">{orderSuccess.deliveryAddress}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-green-700 font-bold mb-5">
              <Phone className="w-4 h-4" /> Payment prompt sent to {phoneNumber}
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-12 font-bold rounded-2xl"
              onClick={() => setOrderSuccess(null)}
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}