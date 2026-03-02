export function generateApiKey(): string {
  const bytes = new Uint8Array(23);
  crypto.getRandomValues(bytes);
  return "pk_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
