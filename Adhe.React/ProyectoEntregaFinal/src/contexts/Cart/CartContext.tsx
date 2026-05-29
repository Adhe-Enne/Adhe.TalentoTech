import React, { createContext } from "react";

import type { CartContextType } from "./Cart.Type";

const CartContext: React.Context<CartContextType | undefined> = createContext<CartContextType | undefined>(undefined);

export default CartContext;
