export function generateId(prefix: string, length = 21): string {
  // cspell:disable-next-line
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  const str = Array(length - prefix.length)
    .fill(0)
    .map((_) => chars[Math.floor(Math.random() * chars.length)])
    .join("")
  return `${prefix}${str}`
}
