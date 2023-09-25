import { notFound } from 'next/navigation'
import { validateEnsName } from '../../lib/validateEnsName'
import { EnsNameData } from '../../lib/types'
import { formatEnsData } from '../../lib/formatEnsData'
import { Avatar } from '../../components/Avatar'
import Link from 'next/link'
import { SOCIAL_ICONS } from '../../lib/constants'
import Image from 'next/image'
import styles from './page.module.css'

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
  const name = validateEnsName(params.name)
  if (!name) notFound()

  const data = await getEnsNameData(name)

  if (!data) return notFound()

  const formattedData = await formatEnsData(data)

  return (
    <main className={styles.main}>
      <Avatar
        size={128}
        address={data.resolvedAddress.id}
        avatar={`https://metadata.ens.domains/mainnet/avatar/${params.name}`}
      />
      <h1>{data.name}</h1>
      <div className={styles.links}>
        {formattedData.socials
          .filter((x) => x.type in SOCIAL_ICONS)
          .map((social) => {
            const { imagePath, baseURL } = SOCIAL_ICONS[social.type]

            if (!social.handle) return null

            return (
              <Link href={`${baseURL}/${social.handle}`}>
                <Image
                  src={imagePath}
                  alt={social.type}
                  width={32}
                  height={32}
                />
              </Link>
            )
          })}
      </div>
    </main>
  )
}
