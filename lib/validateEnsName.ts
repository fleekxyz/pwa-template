import { normalize } from 'viem/ens'

export const validateEnsName = (name: string): string | false => {
  try {
    return normalize(name)
  } catch {
    return false
  }
}
