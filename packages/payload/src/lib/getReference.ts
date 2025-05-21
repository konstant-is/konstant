import { DefaultDocumentIDType } from "payload";

export function getReference<T>(
  value: DefaultDocumentIDType | T | null | undefined
) {
  const isResolved = typeof value !== "string";
  return isResolved ? (value as T) : null;
}
