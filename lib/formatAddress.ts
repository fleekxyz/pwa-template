export const formatAddress = (address: string, slice = 4) =>
  address.slice(0, slice + 4) + '...' + address.slice(42 - slice, 42)
