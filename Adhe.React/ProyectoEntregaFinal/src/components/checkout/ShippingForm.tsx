import React, { forwardRef, useCallback, useImperativeHandle, useState, type ChangeEvent } from "react";

import type { ShippingInfo } from "../../models";

import { isValidPhoneAR, isValidPostalCodeAR, minLength, maxLength } from "../../utils/validators";

export interface ShippingFormHandle {
  getData: () => { valid: boolean; data?: ShippingInfo; error?: string };
}

const fields: {
  key: keyof ShippingInfo;
  label: string;
  type: string;
  placeholder: string;
}[] = [
  { key: "fullName", label: "Nombre completo", type: "text", placeholder: "Tu nombre y apellido" },
  { key: "address", label: "Dirección", type: "text", placeholder: "Calle y número" },
  { key: "city", label: "Ciudad", type: "text", placeholder: "Ciudad" },
  { key: "postalCode", label: "Código postal", type: "text", placeholder: "CP" },
  { key: "phone", label: "Teléfono", type: "tel", placeholder: "Teléfono de contacto" },
];

const initialShipping: ShippingInfo = { fullName: "", address: "", city: "", postalCode: "", phone: "" };
const emptyErrors: Record<keyof ShippingInfo, boolean> = { fullName: false, address: false, city: false, postalCode: false, phone: false };
const emptyMessages: Record<keyof ShippingInfo, string> = { fullName: "", address: "", city: "", postalCode: "", phone: "" };

const validateFullName: (v: string) => string = (v: string): string => {
  if (!v) {
    return "El nombre completo es obligatorio";
  }
  if (!minLength(v, 2)) {
    return "Debe tener al menos 2 caracteres";
  }
  if (!maxLength(v, 100)) {
    return "No debe exceder los 100 caracteres";
  }
  return "";
};

const validateAddress: (v: string) => string = (v: string): string => {
  if (!v) {
    return "La dirección es obligatoria";
  }
  if (!minLength(v, 3)) {
    return "Debe tener al menos 3 caracteres";
  }
  if (!maxLength(v, 200)) {
    return "No debe exceder los 200 caracteres";
  }
  return "";
};

const validateCity: (v: string) => string = (v: string): string => {
  if (!v) {
    return "La ciudad es obligatoria";
  }
  if (!minLength(v, 2)) {
    return "Debe tener al menos 2 caracteres";
  }
  if (!maxLength(v, 100)) {
    return "No debe exceder los 100 caracteres";
  }
  return "";
};

const validatePostalCode: (v: string) => string = (v: string): string => {
  if (!v) {
    return "El código postal es obligatorio";
  }
  if (!isValidPostalCodeAR(v)) {
    return "Debe ser un código postal argentino válido (4 dígitos)";
  }
  return "";
};

const validatePhone: (v: string) => string = (v: string): string => {
  if (!v) {
    return "El teléfono es obligatorio";
  }
  if (!isValidPhoneAR(v)) {
    return "Debe ser un teléfono válido (8 a 15 dígitos)";
  }
  return "";
};

const VALIDATORS: Record<keyof ShippingInfo, (v: string) => string> = {
  address: validateAddress,
  city: validateCity,
  fullName: validateFullName,
  phone: validatePhone,
  postalCode: validatePostalCode,
};

const ShippingForm: React.ForwardRefRenderFunction<ShippingFormHandle, object> = (_props, ref) => {
  const [values, setValues] = useState<ShippingInfo>(initialShipping);
  const [touched, setTouched] = useState<Record<keyof ShippingInfo, boolean>>(emptyErrors);
  const [fieldErrors, setFieldErrors] = useState<Record<keyof ShippingInfo, string>>(emptyMessages);

  const validateField: (key: keyof ShippingInfo, value: string) => string = useCallback((key: keyof ShippingInfo, value: string): string => {
    const validator: (v: string) => string = VALIDATORS[key];
    return validator ? validator(value.trim()) : "";
  }, []);

  const getData: () => { valid: boolean; data?: ShippingInfo; error?: string } = useCallback((): { valid: boolean; data?: ShippingInfo; error?: string } => {
    const newFieldErrors: Record<keyof ShippingInfo, string> = { ...emptyMessages };
    let firstError: string | null = null;

    for (const field of fields) {
      const error: string = validateField(field.key, values[field.key]);
      newFieldErrors[field.key] = error;
      if (error && !firstError) {
        firstError = error;
      }
    }

    setFieldErrors(newFieldErrors);
    setTouched((prev: Record<keyof ShippingInfo, boolean>) => {
      const next: Record<keyof ShippingInfo, boolean> = { ...prev };
      for (const field of fields) {
        next[field.key] = true;
      }
      return next;
    });

    if (firstError) {
      return { valid: false, error: firstError };
    }
    return { valid: true, data: { ...values } };
  }, [values, validateField]);

  useImperativeHandle<ShippingFormHandle, ShippingFormHandle>(
    ref,
    (): ShippingFormHandle => ({
      getData,
    }),
    [getData],
  );

  const handleChange: (key: keyof ShippingInfo, value: string) => void = useCallback((key: keyof ShippingInfo, value: string): void => {
    setValues((prev: ShippingInfo) => ({ ...prev, [key]: value }));
    setTouched((prev: Record<keyof ShippingInfo, boolean>) => ({ ...prev, [key]: false }));
    setFieldErrors((prev: Record<keyof ShippingInfo, string>) => ({ ...prev, [key]: "" }));
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="p-4">
        <h5 className="text-lg font-semibold mb-3">Datos de envío</h5>
        <p className="text-gray-500 text-sm">Completá los campos para recibir tu pedido.</p>
        {fields.map((f) => (
          <div className="mb-3" key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`shipping-${f.key}`}>{f.label}</label>
            <input
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent ${
                touched[f.key] && !!fieldErrors[f.key] ? "border-red-500 ring-red-500" : "border-gray-300"
              }`}
              id={`shipping-${f.key}`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              required
              type={f.type}
              value={values[f.key]}
            />
            {touched[f.key] && (fieldErrors[f.key] || `${f.label} es obligatorio`) && (
              <div className="text-danger text-xs mt-1">{fieldErrors[f.key] || `${f.label} es obligatorio`}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default forwardRef(ShippingForm);
