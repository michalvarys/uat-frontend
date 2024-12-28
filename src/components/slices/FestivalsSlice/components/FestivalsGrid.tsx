import { Box, Flex } from '@chakra-ui/react'

import FestivalType, {
  FestivalRelationship,
} from '../../../festivals/types/FestivalType'
import FestivalGridItem from './FestivalGridItem'
import { colors } from 'src/theme/colors'

type Props = {
  festivals: (FestivalType | FestivalRelationship)[]
  onSelect(item: FestivalType): void
}

export const prepareFestivals = (
  festivals: (FestivalType | FestivalRelationship)[]
) => {
  if (!festivals?.length) {
    return []
  }

  return festivals
    .map((item: FestivalType | FestivalRelationship) => {
      if (item && 'festival' in item) {
        return item.festival
      }

      return null
    })
    .filter(Boolean)
}

const FestivalsGrid = ({ festivals: data, onSelect }: Props) => {
  const festivals = prepareFestivals(data)

  const renderGrid = () => {
    return festivals.slice(1, festivals.length).map((item) => (
      <Box
        key={item.id}
        flex={{ base: '1 1 100%', lg: '1 1 50%' }}
        justifyContent={'space-between'}
      >
        <FestivalGridItem festival={item} onSelect={onSelect} />
      </Box>
    ))
  }

  return (
    <Box
      borderTop="2px solid"
      borderLeft="2px solid"
      borderColor="black"
      mt={{ base: '40px', md: '-117px' }}
      mb={{ base: '40px', md: '44px', lg: '-128px' }}
      boxShadow={`22px 22px ${colors.uat_green}`}
    >
      {' '}
      <Box>
        {festivals?.[0] ? (
          <FestivalGridItem festival={festivals[0]} onSelect={onSelect} />
        ) : null}
      </Box>
      <Flex flex={1} flexWrap="wrap">
        {festivals.length > 1 ? renderGrid() : null}
      </Flex>
    </Box>
  )
}

export default FestivalsGrid
