import { useRouter } from 'next/router'
import { Flex, Box } from '@chakra-ui/react'

import FestivalType, {
  FestivalRelationship,
} from '../../festivals/types/FestivalType'
import { ContainerVariant } from '../../common/Container'
import DescriptionSection from '../../common/DescriptionSection'
import FestivalsGrid from './components/FestivalsGrid'
import { prepareFestivals } from './components/FestivalsGrid/FestivalsGrid'

type Props = {
  festivals?: FestivalRelationship[] | FestivalType[]
  variant: ContainerVariant
}

const FestivalsSlice = ({ festivals, variant }: Props) => {
  const router = useRouter()

  if (!festivals?.length) {
    return null
  }

  const [promotedFestival] = prepareFestivals(festivals)

  const onSelectFestival = (item: FestivalType) => {
    router.push(`/festivals/${item.id}`)
  }

  return (
    <Flex
      flexDirection={{ base: 'column', md: 'row' }}
      px={{ base: '20px', sm: '40px', lg: '80px' }}
    >
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        py={{ base: '80px', md: '80px 0' }}
        pr={{ base: 0, md: '80px', xl: '200px' }}
      >
        {promotedFestival && (
          <DescriptionSection
            data={{
              title: promotedFestival.title,
              subtitle: promotedFestival.subtitle,
              content: promotedFestival.description,
            }}
            isGreen
            variant={variant}
          />
        )}
      </Box>

      <Box flex="1" py={{ base: 0, lg: '60px', xl: 0 }}>
        <FestivalsGrid festivals={festivals} onSelect={onSelectFestival} />
      </Box>
    </Flex>
  )
}

export default FestivalsSlice
