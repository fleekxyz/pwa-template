import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
import { mainnet, goerli } from 'viem/chains'
import { configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

export const configureChainsConfig = configureChains(
  [mainnet, goerli],
  [publicProvider()],
)
