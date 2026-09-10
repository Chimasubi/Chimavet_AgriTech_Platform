import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { AgrovetShop } from "./components/AgrovetShop";
import { IrrigationControl } from "./components/IrrigationControl";
import { VaccinationScreen } from "./components/VaccinationScreen";
import { SmartFarming } from "./components/SmartFarming";
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
      { path: "vaccination", Component: VaccinationScreen },
      { path: "smart-farming", Component: SmartFarming },
      { path: "*", Component: NotFound },
    ],
  },
]);
