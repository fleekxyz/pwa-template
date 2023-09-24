import { useAccount, useEnsName } from 'wagmi'

export const EnsName = () => {
  const { address } = useAccount()
  const { data: ens, isLoading, isError } = useEnsName({ address })

  if (isError) return <>Error getting ENS name</>

  if (isLoading) return <>Loading...</>

  return ens
}
