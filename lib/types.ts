import { Address } from 'wagmi'

export type EnsNameData = {
  resolvedAddress: null | { id: Address }
  resolver: {
    texts: null | string[]
    coinTypes: null | string[]
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

export enum CoinType {
  btc = 0,
  ltc = 2,
  doge = 3,
  mona = 22,
  eth = 60,
  etc = 61,
  rsk = 137,
  xrp = 144,
  bch = 145,
  binance = 714,
}

export type FormattedEnsData = {
  socials: { type: LinkType; handle: string }[]
  coins: { type: string; address: string }[]
} & Partial<{
  description: string
  avatar: string
  location: string
}>
