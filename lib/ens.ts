import { addEnsContracts, createEnsPublicClient } from '@ensdomains/ensjs'
import { addresses } from '@ensdomains/ensjs/contracts'
import { http, parseAbi } from 'viem'
import { goerli, mainnet } from 'viem/chains'

export const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http('https://web3.ens.domains/v1/mainnet'),
})

export const mainnetWithEns = addEnsContracts(mainnet)

export const goerliWithEns = addEnsContracts(goerli)

export const ethEnsRegistrar = {
  address: addresses.homestead.ensEthRegistrarController.address,
  abi: parseAbi(['function commit(bytes32 commitment) public']),
}
