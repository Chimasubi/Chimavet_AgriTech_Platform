import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { AIAssistant } from "./AIAssistant";
import { SplashScreen } from "./SplashScreen";
import { Footer } from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-dvh bg-slate-50">
      <ScrollToTop />
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}