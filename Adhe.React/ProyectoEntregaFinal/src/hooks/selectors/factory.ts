import { useContext, useContextSelector, type Context } from "use-context-selector";

export function createSelectorHook<TContext>(context: Context<TContext | undefined>, name: string): () => TContext {
  return (): TContext => {
    const ctx: TContext | undefined = useContext(context);
    if (ctx === undefined) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return ctx;
  };
}

export function createSelectiveSelectorHook<TContext>(context: Context<TContext | undefined>, name: string) {
  return <TSelected>(selector: (value: TContext) => TSelected): TSelected =>
    useContextSelector(context, (c) => {
      if (c === undefined) {
        throw new Error(`use${name} must be used within ${name}Provider`);
      }
      return selector(c);
    });
}
