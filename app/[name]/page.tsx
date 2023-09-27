import { notFound } from 'next/navigation'
import { validateEnsName } from '../../lib/validateEnsName'
import { EnsNameData } from '../../lib/types'
import { formatEnsData } from '../../lib/formatEnsData'
import { Avatar } from '../../components/Avatar'
import Link from 'next/link'
import { SOCIAL_ICONS } from '../../lib/constants'
import Image from 'next/image'
import styles from './page.module.css'
import { ExternalLink } from 'react-external-link'

const QUERY = `
query ($name: String!) {
  domains(where:{name: $name}) {
    name
    resolvedAddress {
      id
    }
    resolver {
      texts
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

  const links = formattedData.socials.filter((x) => x.type in SOCIAL_ICONS)

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Avatar
          sizes="(max-width: 768px) 224px, (max-width: 1200px) 256px, 320px"
          address={data.resolvedAddress.id}
          ens={params.name}
        />
        <h1>{data.name}</h1>
        {formattedData.location ? (
          <p className={styles.location}>
            <Image
              src="/icons/location.svg"
              height={24}
              width={24}
              alt="Location:"
            />{' '}
            {formattedData.location}
          </p>
        ) : null}
      </header>
      <div className={styles.links}>
        {links.map((social) => {
          const { imagePath, baseURL } = SOCIAL_ICONS[social.type]

          if (!social.text) return null

          return baseURL.startsWith('https') ? (
            <Link
              className={styles.link}
              href={`${baseURL}/${social.text}`}
              key={social.type}
            >
              <Image
                src={imagePath}
                alt={social.type}
                width={32}
                height={32}
                className={styles.icon}
              />
            </Link>
          ) : (
            <ExternalLink href={`${baseURL}${social.text}`}>
              <Image
                src={imagePath}
                alt={social.type}
                width={32}
                height={32}
                className={styles.icon}
              />
            </ExternalLink>
          )
        })}
      </div>
      {formattedData.description ? <p>{formattedData.description}</p> : null}
    </main>
  )
}
