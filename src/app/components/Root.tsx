import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { AIAssistant } from "./AIAssistant";
import { SplashScreen } from "./SplashScreen";

export function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <AIAssistant />
    </div>
  );
}