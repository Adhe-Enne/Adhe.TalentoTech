import { createContext, type Context } from "use-context-selector";

import type { CouponsContextType } from "./CouponsTypes";

const CouponsContext: Context<CouponsContextType | undefined> = createContext<CouponsContextType | undefined>(undefined);

export default CouponsContext;
