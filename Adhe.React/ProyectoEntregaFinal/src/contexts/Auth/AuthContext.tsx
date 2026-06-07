import { createContext, type Context } from "use-context-selector";

import type { AuthContextType } from "./AuthTypes";

const AuthContext: Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
