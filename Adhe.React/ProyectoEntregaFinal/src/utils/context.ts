import { createContext, type Context } from "use-context-selector";

export function createTypedContext<T>(): Context<T | undefined> {
  return createContext<T | undefined>(undefined);
}
