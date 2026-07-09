import React from "react";
import { FaDollarSign, FaEuroSign, FaMoneyBillWave } from "react-icons/fa";

export const CURRENCY_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  USD: { icon: <FaDollarSign />, color: "bg-emerald-500", label: "USD" },
  ARS: { icon: <FaMoneyBillWave />, color: "bg-cyan-500", label: "ARS" },
  EUR: { icon: <FaEuroSign />, color: "bg-blue-500", label: "EUR" },
  BRL: { icon: <FaMoneyBillWave />, color: "bg-amber-500", label: "BRL" },
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
