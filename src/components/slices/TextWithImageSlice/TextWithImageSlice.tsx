import Image from 'next/image'
import classNames from 'classnames'

import styles from './TextWithImageSlice.module.scss'

import { transformLink } from 'src/utils/link'
import { useRouter } from 'next/router'
import TextWithImageType from '../types/TextWithImageType'
import { ContainerVariant } from '../../common/Container'
import DescriptionSection from '../../common/DescriptionSection'
import { getAttributes } from 'src/utils/data'

type Props = {
  data: TextWithImageType
  extraBottomSpace?: number
  extraTextTopSpace?: number
  extraTextBottomSpace?: number
  extraTopSpace?: number
  variant?: ContainerVariant
}

const TextWithImageSlice = ({
  data,
  extraBottomSpace,
  extraTopSpace,
  extraTextTopSpace,
  extraTextBottomSpace,
  variant,
}: Props) => {
  const router = useRouter()

  const renderTextSection = () => (
    <div
      style={{
        marginTop: extraTextTopSpace,
        marginBottom: extraTextBottomSpace,
        display: 'flex',
      }}
    >
      <DescriptionSection
        data={{
          title: data.title,
          subtitle: data.subtitle,
          content: data.content || '',
          download_link: data.download_link,
          link: data.link,
        }}
        variant={variant === undefined ? ContainerVariant.White : variant}
      />
    </div>
  )

  const renderImage = () => {
    const image = getAttributes(data.image)
    return (
      <div
        style={{
          marginBottom: extraBottomSpace,
          marginTop: extraTopSpace,
          position: 'relative',
        }}
      >
        {image ? (
          <Image
            alt={image.alternativeText}
            src={transformLink(image.url)}
            width={image.width}
            height={image.height}
          />
        ) : (
          <></>
        )}
      </div>
    )
  }

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.image_right]: !data.left_side_image,
      })}
    >
      <div
        className={classNames({
          [styles.left]: true,
          [styles.text_side]: !data.left_side_image,
          [styles.image_side]: data.left_side_image,
        })}
      >
        {data.left_side_image ? renderImage() : renderTextSection()}
      </div>
      <div
        className={classNames({
          [styles.right]: true,
          [styles.text_side]: data.left_side_image,
          [styles.image_side]: !data.left_side_image,
        })}
      >
        {!data.left_side_image ? renderImage() : renderTextSection()}
      </div>
    </div>
  )
}

TextWithImageSlice.defaultProps = {
  extraBottomSpace: 0,
  extraTopSpace: 0,
  extraTextTopSpace: 0,
  variant: ContainerVariant.White,
}

export default TextWithImageSlice
