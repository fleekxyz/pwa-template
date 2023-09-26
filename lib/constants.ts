import { CoinType, LinkType } from './types'

export const SOCIAL_ICONS: Record<
  LinkType,
  {
    imagePath: string
    baseURL: string
  }
> = {
  discord: {
    baseURL: 'https://discordapp.com/users',
    imagePath: '/icons/discord.svg',
  },
  github: {
    baseURL: 'https://github.com',
    imagePath: '/icons/github.svg',
  },
  twitter: {
    imagePath: 'https://twitter.com',
    baseURL: '',
  },
  telegram: {
    baseURL: 'https://t.me',
    imagePath: '/icons/telegram.svg',
  },
  reddit: {
    baseURL: 'https://reddit.com/u',
    imagePath: '/icons/reddit.svg',
  },
  email: {
    imagePath: '/icons/email.svg',
    baseURL: 'mailto:',
  },
  url: {
    imagePath: '/icons/globe.svg',
    baseURL: '',
  },
}

export const COIN_ICONS: Record<CoinType, { imagePath: string }> = {
  [CoinType.btc]: {
    imagePath: '/coins/btc.svg',
  },
  [CoinType.ltc]: {
    imagePath: '/coins/ltc.svg',
  },
  [CoinType.doge]: {
    imagePath: '/coins/doge.svg',
  },
  [CoinType.mona]: {
    imagePath: '/coins/mona.svg',
  },
  [CoinType.eth]: {
    imagePath: '/coins/eth.svg',
  },
  [CoinType.etc]: {
    imagePath: '/coins/etc.svg',
  },
  [CoinType.rsk]: {
    imagePath: '/coins/rsk.svg',
  },
  [CoinType.xrp]: {
    imagePath: '/coins/xrp.svg',
  },
  [CoinType.bch]: {
    imagePath: '/coins/bch.svg',
  },
  [CoinType.binance]: {
    imagePath: '/coins/binance.svg',
  },
}
