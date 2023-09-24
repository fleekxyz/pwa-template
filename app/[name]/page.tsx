import { notFound } from 'next/navigation'
import { validateEnsName } from '../../lib/validateEnsName'
import { Address } from 'wagmi'
import { EnsNameData } from '../../lib/types'
import { formatEnsData } from '../../lib/formatEnsData'
import { Avatar } from '../../components/Avatar'

const QUERY = `
query ($name: String!) {
  domains(where:{name: $name}) {
    name
    resolvedAddress {
      id
    }
    resolver {
      texts
      coinTypes
    }
  }
}
`

const getEnsNameData = async (name: string): Promise<EnsNameData> => {
  const res = await fetch(
    'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    {
      body: JSON.stringify({ query: QUERY, variables: { name } }),
      method: 'POST',
    },
  )

  if (!res.ok) throw new Error('Failed to fetch ENS name data')

  const json = await res.json()

  if (json.errors) throw new Error(json.errors[0].message)

  return json.data.domains[0]
}

export default async function ProfilePage({
  params,
}: {
  params: { name: string }
}) {
  if (!validateEnsName(params.name)) notFound()

  const data = await getEnsNameData(params.name)

  if (!data) return notFound()

  const formattedData = await formatEnsData(data)

  return (
    <>
      <main>
        <Avatar
          size={128}
          address={data.resolvedAddress.id}
          avatar={`https://metadata.ens.domains/mainnet/avatar/${params.name}`}
        />
      </main>
    </>
  )
}
