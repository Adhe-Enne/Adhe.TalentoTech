import type { CouponsContextType } from "../../contexts/Coupons/CouponsContext";

import CouponsContext from "../../contexts/Coupons/CouponsContext";
import { createSelectiveSelectorHook } from "./factory";

const useCouponsSelective: <TSelected>(selector: (value: CouponsContextType) => TSelected) => TSelected = createSelectiveSelectorHook<CouponsContextType>(CouponsContext, "Coupons");

export default useCouponsSelective;
