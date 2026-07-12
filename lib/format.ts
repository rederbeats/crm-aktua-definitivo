import type { Client, Owner, Property } from "./types";

export function compact(parts: Array<string | number | null | undefined>) {
  return parts
    .map((part) => (part === null || part === undefined ? "" : String(part).trim()))
    .filter(Boolean)
    .join(" | ");
}

export function money(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "";

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(numeric);
}

export function displayDate(value: string | null | undefined) {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));
}

export function inputDate(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function clientLabel(client: Client) {
  return compact([client.name, client.phone || client.email, client.interest]);
}

export function ownerLabel(owner: Owner) {
  return compact([owner.name, owner.phone || owner.email]);
}

export function propertyLabel(property: Property) {
  return compact([property.title, money(property.price), property.address, property.status]);
}
