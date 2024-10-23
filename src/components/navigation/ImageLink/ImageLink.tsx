import Link from 'next/link'
import Image from 'next/image'

import styles from './ImageLink.module.scss'
import { DbImage } from 'src/components/DbImage'

type Props = {
  url: string
  image: string
  imageWidth: number
  imageHeight: number
  title: string
  subtitle: string
}

const ImageLink = ({
  url,
  image,
  title,
  subtitle,
  imageWidth,
  imageHeight,
}: Props) => (
  // eslint-disable-next-line @next/next/link-passhref
  <Link href={url}>
    <a className={styles.container}>
      <div className={styles.image}>
        <Image
          src={image}
          alt=""
          width={imageWidth}
          height={imageHeight}
          layout={'responsive'}
          objectFit={'fill'}
          objectPosition={'center center'}
        />
      </div>

      <div className={styles.text_container}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </a>
  </Link>
)

export default ImageLink
