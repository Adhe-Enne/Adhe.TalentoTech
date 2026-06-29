const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX: RegExp = /^[\d\s\-()+]+$/;
const POSTAL_CODE_AR_REGEX: RegExp = /^\d{4}$/;
const SLUG_REGEX: RegExp = /^[A-Z0-9-]+$/;
const COUPON_CODE_REGEX: RegExp = /^[A-Z0-9-]+$/;
const UPPERCASE_REGEX: RegExp = /[A-Z]/;
const NUMBER_REGEX: RegExp = /\d/;
const ALLOWED_IMAGE_TYPES: Set<string> = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const isValidEmail: (email: string) => boolean = (email: string): boolean => EMAIL_REGEX.test(email);

export const isValidPhoneAR: (phone: string) => boolean = (phone: string): boolean => {
  const cleaned: string = phone.replace(/[\s\-()]/g, "");
  return PHONE_REGEX.test(phone) && cleaned.length >= 8 && cleaned.length <= 15;
};

export const isValidPostalCodeAR: (code: string) => boolean = (code: string): boolean => POSTAL_CODE_AR_REGEX.test(code);

export const isValidSlug: (slug: string) => boolean = (slug: string): boolean => {
  const normalized: string = slug.toUpperCase().replace(/\s+/g, "");
  return SLUG_REGEX.test(normalized) && normalized.length > 0;
};
export const isValidCouponCode: (code: string) => boolean = (code: string): boolean => COUPON_CODE_REGEX.test(code);

export const isValidPrice: (price: number) => boolean = (price: number): boolean => !Number.isNaN(price) && price > 0 && price <= 999999.99 && /^\d+(\.\d{1,2})?$/.test(String(price));

export const isPositiveInteger: (n: number) => boolean = (n: number): boolean => Number.isInteger(n) && n >= 0;

export const hasUpperCase: (s: string) => boolean = (s: string): boolean => UPPERCASE_REGEX.test(s);

export const hasNumber: (s: string) => boolean = (s: string): boolean => NUMBER_REGEX.test(s);

export const isValidImageFile: (file: File, maxMB?: number) => string | null = (file: File, maxMB?: number): string | null => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Solo se permiten archivos JPG, PNG, WebP o GIF";
  }
  const maxBytes: number = (maxMB ?? 5) * 1024 * 1024;
  if (file.size > maxBytes) {
    return `La imagen no debe superar los ${maxMB ?? 5}MB`;
  }
  return null;
};

export const maxLength: (s: string, max: number) => boolean = (s: string, max: number): boolean => s.length <= max;

export const minLength: (s: string, min: number) => boolean = (s: string, min: number): boolean => s.length >= min;
