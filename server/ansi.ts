export * as cursor from "ansi-escapes";

export function rgbForeground(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}
export function rgbBackground(r: number, g: number, b: number): string {
  return `\x1b[48;2;${r};${g};${b}m`;
}
export const reset = `\x1b[0m`;
export const bold = `\x1b[1m`;
