import { SocialMediaType } from './types'

export const SOCIAL_ICONS: Record<
  SocialMediaType,
  {
    imagePath: string
    baseURL: string
  }
> = {
  discord: {
    baseURL: 'https://discordapp.com/users',
    imagePath: '/socials/discord.svg',
  },
  github: {
    baseURL: 'https://github.com',
    imagePath: '/socials/github.svg',
  },
  twitter: {
    imagePath: 'https://twitter.com',
    baseURL: '',
  },
  telegram: {
    baseURL: 'https://t.me',
    imagePath: '/socials/telegram.svg',
  },
  reddit: {
    baseURL: 'https://reddit.com/u',
    imagePath: '/socials/reddit.svg',
  },
}
