import {
  chakra,
  Heading,
  Card,
  CardBody,
  Link,
  IconButton,
  CardFooter,
  SimpleGrid,
  Box,
} from '@chakra-ui/react'
import Image from 'next/image'
import { transformLink } from 'src/utils/link'
import { DbImage } from '../DbImage'

export function CardsSlice(section) {
  return (
    <SimpleGrid
      gap={2}
      spacing={2}
      minInlineSize="300px"
      columns={[1, 2, 3, null, 5]}
      pb={{ base: '40px', md: '60px', lg: '84px' }}
    >
      {section.CardItem?.map((item) => {
        const img = item.Image?.formats?.small || item.Image

        return (
          <Card w="full" key={item.id}>
            <CardBody
              sx={{
                img: {
                  borderRadius: 'md',
                },
              }}
            >
              <DbImage
                data={img}
                format="small"
                props={(image) => ({
                  width: image.width,
                  height: image.height,
                  layout: 'responsive',
                  objectFit: 'cover',
                })}
              />
            </CardBody>

            <Box
              as={CardFooter}
              display="flex"
              justify="center"
              alignContent="center"
              p={5}
              pt={0}
              w="full"
            >
              <Heading
                w="80%"
                position="relative"
                mt="2"
                textAlign="center"
                size="md"
              >
                {item.Link.title}
              </Heading>
              <IconButton
                as={Link}
                target="_blank"
                href={item.Link.url}
                w="10%"
                variant="link"
                color="gray.800"
                _hover={{
                  textDecoration: 'none',
                }}
                colorScheme="gray"
                aria-label="See menu"
                icon={<chakra.span fontSize="xl">{'→'}</chakra.span>}
              />
            </Box>
          </Card>
        )
      })}
    </SimpleGrid>
  )
}
