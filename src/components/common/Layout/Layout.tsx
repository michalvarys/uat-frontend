import Header from '../Header'
import Footer from '../Footer'

import { MenuSection } from '../Header/Header'
import FooterType from 'src/types/data/FooterType'
import { Box, VStack } from '@chakra-ui/react'

type Props = {
  children: JSX.Element
  footer: FooterType
  menu: MenuSection[]
}

function Layout({ children, footer, menu }: Props) {
  return (
    <VStack spacing={0} w="full" align="stretch">
      <Header data={menu} />
      <Box w="full">{children}</Box>
      <Footer data={footer} />
    </VStack>
  )
}

export default Layout
