import type { AuthContextType } from "../../contexts/Auth/AuthContext";

import AuthContext from "../../contexts/Auth/AuthContext";
import { createSelectorHook } from "./factory";

const useAuth: () => AuthContextType = createSelectorHook(AuthContext, "Auth");

export default useAuth;
