export function id(prefix: string, length = 21): string {
  const str = Array(length - prefix.length)
    .fill(0)
    .map((_) => CHARS[Math.floor(Math.random() * CHARS.length)])
    .join("")
  return `${prefix}${str}`
}

// cspell:disable-next-line
const CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
