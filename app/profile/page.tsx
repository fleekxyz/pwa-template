'use client'

import { useSearchParams } from 'next/navigation'
import { validateEnsName } from '../../lib/validateEnsName'
import { EnsNameData, FormattedEnsData } from '../../lib/types'
import { formatEnsData } from '../../lib/formatEnsData'
import { Avatar } from '../../components/Avatar'
import Link from 'next/link'
import { SOCIAL_ICONS } from '../../lib/constants'
import Image from 'next/image'
import styles from './page.module.css'
import common from '../../common.module.css'
import { ExternalLink } from 'react-external-link'
import { NavBar } from '../../components/NavBar'
import { ShareProfile } from '../../components/ShareProfile'
import { useEffect, useState } from 'react'

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

export default function ProfilePage() {
  const params = useSearchParams()
  const nameInParams = params.get('name')

  const [formattedData, setFormattedData] = useState<FormattedEnsData>()
  const [data, setData] = useState<EnsNameData>()

  useEffect(() => {
    if (nameInParams) {
      const name = validateEnsName(nameInParams)
      if (name) {
        getEnsNameData(name).then((data) => {
          setData(data)
          formatEnsData(data).then((formattedData) => {
            setFormattedData(formattedData)
          })
        })
      }
    }
  }, [nameInParams])

  const links = formattedData
    ? formattedData.texts.filter(x => x.type in SOCIAL_ICONS)
    : []

  if (!nameInParams) return <>Not Found</>

  if (!data || !formattedData) return <>Loading...</>

  return (
    <>
      <NavBar>
        <ShareProfile />
      </NavBar>
      <main className={`${styles.main} ${common.center}`}>
        <header className={`${styles.header} ${common.center}`}>
          <Avatar
            address={data.resolvedAddress!.id}
            ens={nameInParams}
            className={styles.avatar}
            useContainer={false}
          />
          <h1>{data.name}</h1>
          {formattedData.location
            ? (
              <p className={styles.location}>
                <Image
                  src="/icons/location.svg"
                  height={24}
                  width={24}
                  alt="Location:"
                />
                {' '}
                {formattedData.location}
              </p>
              )
            : null}
        </header>
        <div className={`${styles.links} ${common.center}`}>
          {links.map((social) => {
            const { imagePath, baseURL } = SOCIAL_ICONS[social.type]

            if (!social.text) return null

            return baseURL.startsWith('https')
              ? (
                <Link
                  className={`${styles.link} ${common.button}`}
                  href={`${baseURL}/${social.text}`}
                  key={social.type}
                >
                  <Image
                    src={imagePath}
                    alt={social.type}
                    width={32}
                    height={32}
                  />
                </Link>
                )
              : (
                <ExternalLink
                  className={`${styles.link} ${common.button}`}
                  key={social.type}
                  href={`${baseURL}${social.text}`}
                >
                  <Image
                    src={imagePath}
                    alt={social.type}
                    width={32}
                    height={32}
                  />
                </ExternalLink>
                )
          })}
        </div>
        {formattedData.description ? <p>{formattedData.description}</p> : null}
      </main>
    </>
  )
}
