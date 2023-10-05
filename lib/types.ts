import { Address } from 'wagmi'

export type EnsNameData = {
  resolvedAddress: null | { id: Address }
  resolver: {
    texts: null | string[]
  }
  name: string
}

export type LinkType =
  | 'twitter'
  | 'github'
  | 'telegram'
  | 'discord'
  | 'reddit'
  | 'email'
  | 'url'

export type FormattedEnsData = {
  texts: { type: LinkType; text: string }[]
  coins: { type: string; address: string }[]
} & Partial<{
  description: string
  avatar: string
  location: string
}>

export type SetupStep = 'name' | 'avatar' | 'social' | 'register'
