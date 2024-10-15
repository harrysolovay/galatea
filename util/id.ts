export function idFactory(prefix: string) {
  let i = 0
  return () => `${prefix}_${i++}`
}
