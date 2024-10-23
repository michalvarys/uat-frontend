import { Box, Heading, useBreakpointValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import NewsType from '../news/types/NewsType'
import { getString, Strings } from '../../locales'
import NewsList from './NewsList'

type Props = {
  news: NewsType[]
}

const NewsSlice = ({ news }: Props) => {
  const router = useRouter()

  const onSelectNews = (news: NewsType) => {
    router.push(`/news/${news.slug}`)
  }

  const padding = useBreakpointValue({
    base: '10px 20px 200px',
    md: '10px 40px 200px',
    lg: '10px 80px 200px',
  })

  const headingSize = useBreakpointValue({ base: '40px', sm: '48px' })

  return (
    <Box position="relative" padding={padding}>
      <Box
        position="absolute"
        top="-70px"
        left={0}
        right={0}
        height="70px"
        backgroundImage="url('/icons/common/Wave.svg')"
      />
      <Heading as="h1" fontSize={headingSize} mb={4}>
        {getString(router.locale, Strings.NEWS)}
      </Heading>
      <NewsList news={news} onSelect={onSelectNews} />
    </Box>
  )
}

export default NewsSlice
