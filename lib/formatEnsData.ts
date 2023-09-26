import { createPublicClient, fromHex, http } from 'viem'
import { CoinType, EnsNameData, FormattedEnsData, LinkType } from './types'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
  transport: http('https://rpc.ankr.com/eth'),
  chain: mainnet,
})

const tldRegex = /^[a-z0-9-]{1,63}\.[a-z]{2,253}$/i

export const formatEnsData = async ({ resolver, name }: EnsNameData) => {
  const data: FormattedEnsData = { coins: [], socials: [] }

  for (const record of resolver.texts) {
    const text = await publicClient.getEnsText({ key: record, name })

    if (tldRegex.test(record)) {
      data.socials.push({
        type: record.slice(4) as LinkType,
        handle: text,
      })
    } else if (['url', 'email'].includes(record)) {
      data.socials.push({
        type: record as LinkType,
        handle: text,
      })
    } else {
      data[record] = text
    }
  }

  for (const coinType of resolver.coinTypes) {
    const hexAddress = await publicClient.getEnsAddress({
      coinType: parseInt(coinType),
      name,
    })

    if (hexAddress) {
      data.coins.push({
        type: CoinType[parseInt(coinType)],
        address: hexAddress,
      })
    }
  }

  return data
}
