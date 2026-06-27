interface TimestampsUtil {
  onCreate: () => { createdAt: string; updatedAt: null };
  onUpdate: () => { updatedAt: string };
}

export const timestamps: TimestampsUtil = {
  onCreate: (): { createdAt: string; updatedAt: null } => ({
    createdAt: new Date().toISOString(),
    updatedAt: null,
  }),
  onUpdate: (): { updatedAt: string } => ({
    updatedAt: new Date().toISOString(),
  }),
};

export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as Partial<T>;
}
