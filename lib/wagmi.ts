import { configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { goerliWithEns, mainnetWithEns } from './ens'

export const configureChainsConfig = configureChains(
  [mainnetWithEns, goerliWithEns],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `https://rpc.ankr.com/eth`,
      }),
    }),
  ],
)
