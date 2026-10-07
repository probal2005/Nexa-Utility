export function calculateExpression(expression: string): string {
  const normalized = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/%/g, "/100")
    .trim();

  if (!normalized) {
    return "0";
  }

  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
    throw new Error("Invalid expression");
  }

  try {
    const result = Function(`"use strict"; return (${normalized})`)();

    if (
      typeof result !== "number" ||
      !Number.isFinite(result)
    ) {
      throw new Error("Invalid result");
    }

    return Number.isInteger(result)
      ? String(result)
      : String(Number(result.toFixed(10)));
  } catch {
    throw new Error("Invalid expression");
  }
}
