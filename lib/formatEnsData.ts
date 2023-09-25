import { createPublicClient, http } from 'viem'
import {
  CoinType,
  EnsNameData,
  FormattedEnsData,
  SocialMediaType,
} from './types'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
  transport: http('https://rpc.ankr.com/eth'),
  chain: mainnet,
})

const tldRegex = /^[a-z0-9-]{1,63}\.[a-z]{2,253}$/i

export const formatEnsData = async ({ resolver, name }: EnsNameData) => {
  const data: FormattedEnsData = { coins: [], socials: [] }

  for (const record of resolver.texts) {
    if (tldRegex.test(record)) {
      data.socials.push({
        type: record.slice(4) as SocialMediaType,
        handle: await publicClient.getEnsText({ key: record, name }),
      })
    } else {
      data[record] = await publicClient.getEnsText({ key: record, name })
    }
  }

  for (const coinType of resolver.coinTypes) {
    data.coins.push({
      type: CoinType[parseInt(coinType)],
      address: await publicClient.getEnsAddress({
        coinType: parseInt(coinType),
        name,
      }),
    })
  }

  return data
}
