import { normalize } from 'viem/ens'

export const validateEnsName = (name: string): boolean => {
  try {
    return !!normalize(name)
  } catch {
    return false
  }
}
