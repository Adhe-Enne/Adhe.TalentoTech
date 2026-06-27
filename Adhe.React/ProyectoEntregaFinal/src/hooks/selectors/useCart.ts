import type { CartContextType } from "../../contexts/Cart/CartContext";

import CartContext from "../../contexts/Cart/CartContext";
import { createSelectorHook } from "./factory";

const useCart: () => CartContextType = createSelectorHook(CartContext, "Cart");

export default useCart;
