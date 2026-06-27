import type { CouponsContextType } from "../../contexts/Coupons/CouponsContext";

import CouponsContext from "../../contexts/Coupons/CouponsContext";
import { createSelectorHook } from "./factory";

const useCoupons: () => CouponsContextType = createSelectorHook(CouponsContext, "Coupons");

export default useCoupons;
