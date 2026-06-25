import React, { forwardRef, useCallback, useImperativeHandle, useState, type ChangeEvent } from "react";
import { Form } from "react-bootstrap";

import type { ShippingInfo } from "../../models";

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

const ShippingForm: React.ForwardRefRenderFunction<ShippingFormHandle, object> = (_props, ref) => {
  const [values, setValues] = useState<ShippingInfo>(initialShipping);
  const [touched, setTouched] = useState<Record<keyof ShippingInfo, boolean>>(emptyErrors);

  useImperativeHandle<ShippingFormHandle, ShippingFormHandle>(
    ref,
    (): ShippingFormHandle => ({
      getData: (): { valid: boolean; data?: ShippingInfo; error?: string } => {
        const missing: (keyof ShippingInfo)[] = fields
          .filter((f) => !values[f.key].trim())
          .map((f) => f.key);

        setTouched((prev: Record<keyof ShippingInfo, boolean>) => {
          const next: Record<keyof ShippingInfo, boolean> = { ...prev };
          missing.forEach((k: keyof ShippingInfo) => { next[k] = true; });
          return next;
        });

        if (missing.length > 0) {
          return { valid: false, error: "Completá todos los campos de envío" };
        }
        return { valid: true, data: { ...values } };
      },
    }),
    [values],
  );

  const handleChange: (key: keyof ShippingInfo, value: string) => void = useCallback(
    (key: keyof ShippingInfo, value: string): void => {
      setValues((prev: ShippingInfo) => ({ ...prev, [key]: value }));
      setTouched((prev: Record<keyof ShippingInfo, boolean>) => ({ ...prev, [key]: false }));
    },
    [],
  );

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Datos de envío</h5>
        <p className="text-muted small">Completá los campos para recibir tu pedido.</p>
        {fields.map((f) => (
          <Form.Group className="mb-3" key={f.key}>
            <Form.Label htmlFor={`shipping-${f.key}`}>{f.label}</Form.Label>
            <Form.Control
              id={`shipping-${f.key}`}
              isInvalid={touched[f.key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              required
              type={f.type}
              value={values[f.key]}
            />
            <Form.Control.Feedback type="invalid">
              {f.label} es obligatorio
            </Form.Control.Feedback>
          </Form.Group>
        ))}
      </div>
    </div>
  );
};

export default forwardRef(ShippingForm);
