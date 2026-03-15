import { getEntityId } from "./api";

export function asList(payload) {
  return Array.isArray(payload) ? payload : [];
}

export function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
}

export function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

export function resolveNameById(list, reference) {
  if (reference && typeof reference === "object") {
    return reference.nome ?? reference.name ?? `#${getEntityId(reference) ?? "-"}`;
  }

  const match = list.find((item) => String(getEntityId(item)) === String(reference));
  return match?.nome ?? (reference ? `#${reference}` : "-");
}
