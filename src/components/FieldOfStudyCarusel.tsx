import Image from 'next/image'
import { useRouter } from 'next/router'
import { transformLink } from 'src/utils/link'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'

import ArrowIcon from 'public/icons/common/arrow_right.svg'
import { Flex } from '@chakra-ui/react'

type Props = {
  fields: FieldOfStudyType[]
}

type FieldItemPros = {
  field: FieldOfStudyType
}

const FieldItem = ({ field }: FieldItemPros) => {
  const router = useRouter()

  const onSelect = () => {
    router.push(`/studies/${field.id}`)
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      h="210px"
      flex={1}
      border="2px solid black"
      borderRight={0}
      bgColor="whw"
      onClick={onSelect}
      className={styles.item}
    >
      <div className={styles.content}>
        <div className={styles.image}>
          {field.icon_svg && (
            <Image
              src={transformLink(field.icon_svg.url)}
              width={90}
              height={90}
              alt="icon"
            />
          )}
        </div>
        <div className={styles.title}>{field.name}</div>
      </div>
      <div className={styles.arrow}>
        <Image src={ArrowIcon} alt="arrow" />
      </div>
    </Flex>
  )
}

export const FieldOfStudyCarusel = ({ fields }: Props) => {
  return (
    <div className={styles.container}>
      {fields.map((item) => item && <FieldItem key={item.id} field={item} />)}
    </div>
  )
}
