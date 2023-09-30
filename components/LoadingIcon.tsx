import Image, { ImageProps } from 'next/image'

export const LoadingIcon = (props: Partial<ImageProps>) => (
  <Image src="/loading.svg" height={18} width={18} alt="Loading" {...props} />
)
