import React from "react";
import { FaDollarSign, FaEuroSign, FaMoneyBillWave } from "react-icons/fa";

export const CURRENCY_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  USD: { icon: <FaDollarSign />, color: "success", label: "USD" },
  ARS: { icon: <FaMoneyBillWave />, color: "info", label: "ARS" },
  EUR: { icon: <FaEuroSign />, color: "primary", label: "EUR" },
  BRL: { icon: <FaMoneyBillWave />, color: "warning", label: "BRL" },
};

export interface CurrencyRow {
  currency: string;
  percentage: number;
}

export interface InventoryCurrencyRow extends CurrencyRow {
  totalOriginal: number;
  totalUSD: number;
}

export interface RevenueCurrencyRow extends CurrencyRow {
  totalOriginal: number;
  totalUSD: number;
}

export interface DiscountCurrencyRow extends CurrencyRow {
  count: number;
  discountOriginal: number;
  discountUSD: number;
}

export interface AverageTicketCurrencyRow extends CurrencyRow {
  averageOriginal: number;
  averageUSD: number;
  count: number;
}
