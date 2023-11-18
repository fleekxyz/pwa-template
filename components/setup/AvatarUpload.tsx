import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import styles from './AvatarUpload.module.css'
import common from '../../common.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createQueryString } from '../../lib/createQueryString'
import { SetupStep } from '../../lib/types'

export const AvatarUpload = () => {
  const [image, setImage] = useState<(File & { preview: string }) | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: ([file]) => {
      setImage(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      )
    },
    accept: {
      'image/*': [],
    },
  })

  useEffect(() => {
    const imageCached = sessionStorage.getItem('avatar')

    if (imageCached) {
      setImage(
        Object.assign(new File([], ''), {
          preview: imageCached,
        }),
      )
    }
  }, [])

  const router = useRouter()

  return (
    <>
      <div
        {...getRootProps({ className: `${styles.container} ${common.center}` })}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop it here</p> : <>+</>}
        {image
          ? (
            <Image
              width={250}
              height={250}
              className={styles.image}
              src={image.preview}
              alt="Avatar"
              onLoad={() => sessionStorage.setItem('avatar', image.preview)}
              onError={() => {
                setImage(null)
              }}
            />
            )
          : null}
      </div>
      <div className={`${common.row} ${styles.buttonMenu}`}>
        <button
          className={common.button}
          onClick={() => {
            router.push(
              `/setup?${createQueryString<SetupStep>('step', 'social')}`,
            )
          }}
        >
          {image ? 'Next' : 'Skip'}
        </button>
        {image
          ? (
            <button
              className={common.button}
              onClick={() => {
                sessionStorage.removeItem('avatar')
                URL.revokeObjectURL(image.preview)
                setImage(null)
              }}
            >
              Clear
            </button>
            )
          : null}
      </div>
    </>
  )
}
