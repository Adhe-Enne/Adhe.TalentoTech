type GenericObject = {
  seconds?: number;
  _seconds?: number;
};

export const tsToIso: (val: unknown) => string | undefined = (val: unknown): string | undefined => {
  if (!val) {
    return undefined;
  }
  if (typeof val === "string") {
    return val;
  }
  if (typeof val === "number") {
    return new Date(val).toISOString();
  }
  if (typeof val === "object" && ((val as GenericObject)?.seconds || (val as GenericObject)?._seconds)) {
    const seconds: number = (val as GenericObject).seconds ?? (val as GenericObject)._seconds ?? 0;
    return new Date(seconds * 1000).toISOString();
  }
  return undefined;
};

export const mapTimestamps: (data: Record<string, unknown> | undefined) => { createdAt: string; updatedAt: string | undefined } = (data) => ({
  createdAt: tsToIso(data?.createdAt) ?? "",
  updatedAt: tsToIso(data?.updatedAt) ?? undefined,
});
