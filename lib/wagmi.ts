import { configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnetWithEns } from './ens'

export const configureChainsConfig = configureChains(
  [mainnetWithEns],
  [publicProvider()],
)
