import { useContext, type Context } from "use-context-selector";

export function createSelectorHook<T>(
  context: Context<T | undefined>,
  name: string,
): () => T {
  return (): T => {
    const ctx: T | undefined = useContext(context);
    if (!ctx) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return ctx;
  };
}
