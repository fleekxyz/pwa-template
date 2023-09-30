export const createQueryString = <V extends string>(key: string, value: V) => {
  const params = new URLSearchParams()

  params.set(key, value)

  return params.toString()
}
