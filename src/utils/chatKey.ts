export function getChatKey(a: string, b: string) {
  return [a, b].sort().join("-");
}