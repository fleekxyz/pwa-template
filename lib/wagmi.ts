import { mainnet, goerli } from 'wagmi/chains'
import { configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

export const configureChainsConfig = configureChains(
  [mainnet, goerli],
  [publicProvider()],
)
