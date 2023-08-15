export const pop = <T>(array: T[]) => {
  const first = array.shift()
  return first ? first : null
}
