import { createPublicClient, http } from 'viem'
import { EnsNameData, FormattedEnsData, LinkType } from './types'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
  transport: http('https://rpc.ankr.com/eth'),
  chain: mainnet,
})

const tldRegex = /^[a-z0-9-]{1,63}\.[a-z]{2,253}$/i

export const formatEnsData = async ({ resolver, name }: EnsNameData) => {
  const data: FormattedEnsData = { coins: [], texts: [] }

  for (const record of resolver.texts) {
    const text = await publicClient.getEnsText({ key: record, name })

    if (tldRegex.test(record)) {
      data.texts.push({
        type: record.slice(4) as LinkType,
        text,
      })
    } else if (['url', 'email'].includes(record)) {
      data.texts.push({
        type: record as LinkType,
        text,
      })
    } else {
      data[record] = text
    }
  }

  return data
}
