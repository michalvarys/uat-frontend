'use client'

import { useMemo } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'
import { Grid, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import ArrowRightIcon from 'public/icons/common/arrow_right.svg'
import NewsType from '../news/types/NewsType'
import { colors, renderJSON } from '@ssupat/components'
import {
  parseRichTextDocument,
  truncateHtml,
  truncateRichTextDocument,
} from 'src/utils/richText'

type NewsItemProps = {
  news: NewsType
  onSelect: (item: NewsType) => void
}

const NewsItem = ({ news, onSelect }: NewsItemProps) => {
  const textData = news.sections.find(
    (item: any) => item.__component === 'shared.rich-text-with-title'
  )
  const text = textData?.content ?? ''

  // Po migraci Strapi chodí content buď jako HTML (starší články), nebo jako
  // serializovaný TipTap dokument (novější). Náhled musí zvládnout obojí —
  // stejně jako RichTextSlice na detailu článku.
  const preview = useMemo(() => {
    const document = parseRichTextDocument(text)

    if (document) {
      const { nodes, truncated } = truncateRichTextDocument(document.content)
      return (
        <>
          {renderJSON(nodes)}
          {truncated && '…'}
        </>
      )
    }

    const { html, truncated } = truncateHtml(text)
    return (
      <>
        {parse(html)}
        {truncated && '…'}
      </>
    )
  }, [text])

  const bgColor = useColorModeValue('transparent', 'transparent')
  const hoverBgColor = useColorModeValue(colors.uat_dark, colors.uat_dark)
  const textColor = useColorModeValue(colors.uat_dark, colors.uat_dark)
  const hoverTextColor = useColorModeValue(colors.uat_orange, colors.uat_orange)
  const borderColor = useColorModeValue(colors.uat_dark, colors.uat_dark)

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="flex-start"
      minHeight="220px"
      padding={{ base: '16px', md: '24px' }}
      border="2px solid"
      borderColor={borderColor}
      cursor="pointer"
      transition="background-color 200ms linear"
      bg={bgColor}
      onClick={() => onSelect(news)}
      _hover={{
        bg: hoverBgColor,
        '.title, .sneak_peak': { color: hoverTextColor },
        img: {
          filter:
            'invert(57%) sepia(82%) saturate(2505%) hue-rotate(359deg) brightness(92%) contrast(105%)',
        },
      }}
    >
      <Box maxWidth="100%">
        <Text
          className="title"
          color={textColor}
          fontWeight={900}
          fontSize="xl"
          fontFamily="iAWriterQuattroS"
          textTransform="uppercase"
          overflow="hidden"
          textOverflow="ellipsis"
          display="-webkit-box"
          sx={{
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {news.title}
        </Text>
        <Text
          // Náhled je HTML z CMS a obsahuje vlastní <p>. Chakra Text
          // renderuje <p>, takže by vzniklo neplatné vnoření <p> v <p>
          // a s ním hydratační chyba.
          as="div"
          className="sneak_peak"
          color={textColor}
          fontSize="l"
          lineHeight={1.375}
          fontFamily="iAWriterQuattroS"
          overflow="hidden"
          textOverflow="ellipsis"
          maxHeight="194px"
        >
          {preview}
        </Text>
      </Box>
      <Image src={ArrowRightIcon} alt={'arrow'} />
    </Flex>
  )
}

type Props = {
  news: NewsType[]
  onSelect: (item: NewsType) => void
}

const NewsList = ({ news = [], onSelect }: Props) => {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(auto-fill, 1fr)',
        sm: 'repeat(auto-fill, minmax(300px, 1fr))',
        lg: 'repeat(auto-fill, minmax(410px, 1fr))',
      }}
      gap={{ base: '16px', lg: '24px' }}
    >
      {news.map((item: NewsType) => (
        <NewsItem news={item} key={item.id} onSelect={onSelect} />
      ))}
    </Grid>
  )
}

export default NewsList
