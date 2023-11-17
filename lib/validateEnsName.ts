import { validateName } from '@ensdomains/ensjs/utils'

export const validateEnsName = (name: string): string | false => {
  try {
    return validateName(name)
  } catch {
    return false
  }
}
