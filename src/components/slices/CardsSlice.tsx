import { chakra, Heading, Link, IconButton, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import { transformLink } from 'src/utils/link'

export function CardsSlice(section) {
  return (
    <Stack
      direction="row"
      minBlockSize="200px"
      pb={{ base: '40px', md: '60px', lg: '84px' }}
      padding={5}
    >
      {section.CardItem?.map((item) => (
        <Stack
          dir="row"
          maxW={{ base: '100%', md: 'md', lg: 'lg' }}
          minW="300px"
          key={item.id}
        >
          <chakra.div
            sx={{
              img: {
                borderRadius: 'md',
              },
            }}
          >
            <Image
              src={transformLink(item.Image.url)}
              alt={item.Image.caption}
              width={item.Image.formats.medium.width}
              height={item.Image.formats.medium.height}
              layout="responsive"
              objectFit="cover"
            />
          </chakra.div>

          <chakra.div p={5} pt={0} w="full">
            <Heading
              w="full"
              position="relative"
              mt="2"
              textAlign="center"
              size="md"
            >
              {item.Link.title}

              <Link
                position="absolute"
                right={0}
                top={-2}
                target="_blank"
                href={item.Link.url}
              >
                <IconButton
                  variant="link"
                  color="gray.800"
                  _hover={{
                    textDecoration: 'none',
                  }}
                  colorScheme="gray"
                  aria-label="See menu"
                  icon={<chakra.span fontSize="3xl">{'→'}</chakra.span>}
                />
              </Link>
            </Heading>
          </chakra.div>
        </Stack>
      ))}
    </Stack>
  )
}
