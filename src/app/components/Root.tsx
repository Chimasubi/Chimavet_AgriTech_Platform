import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { AIAssistant } from "./AIAssistant";

export function Root() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <AIAssistant />
    </div>
  );
}
