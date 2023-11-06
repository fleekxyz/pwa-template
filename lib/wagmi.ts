import { configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { mainnetWithEns } from './ens'

export const configureChainsConfig = configureChains(
  [mainnetWithEns],
  [jsonRpcProvider({
    rpc: () => ({
      http: `https://rpc.ankr.com/eth`,
    }),
  })],
)
