import { LinkType } from './types'

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
