import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { AgrovetShop } from "./components/AgrovetShop";
import { IrrigationControl } from "./components/IrrigationControl";
import { SmartFarming } from "./components/SmartFarming";
import { ShambaAnalytics } from "./components/ShambaAnalytics";
import { EquipmentRental } from "./components/EquipmentRental";
import { FarmerMarketplace } from "./components/FarmerMarketplace";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop", Component: AgrovetShop },
      { path: "equipment-rental", Component: EquipmentRental },
      { path: "marketplace", Component: FarmerMarketplace },
      { path: "irrigation", Component: IrrigationControl },
      { path: "smart-farming", Component: SmartFarming },
      { path: "shamba-analytics", Component: ShambaAnalytics },
      { path: "*", Component: NotFound },
    ],
  },
]);