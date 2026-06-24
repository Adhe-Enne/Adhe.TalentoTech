import { createContext, type Context } from "use-context-selector";

import type { CartContextType } from "./CartTypes";

const CartContext: Context<CartContextType | undefined> = createContext<CartContextType | undefined>(undefined);

export default CartContext;
