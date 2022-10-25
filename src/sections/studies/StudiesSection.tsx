import { chakra } from '@chakra-ui/react'
import Container, { ContainerVariant } from 'src/components/common/Container'
import { FieldOfStudyHeader } from './components/FieldOfStudyHeader'
import MultiGallerySlice from 'src/components/slices/MultiGallerySlice'
import TeachersCarusel from 'src/components/teachers/TeachersCarusel'
import { Slice } from './components/Slice'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'

export function StudiesSection(study: FieldOfStudyType) {
  return (
    <>
      <Container variant={ContainerVariant.Black} isHigh>
        <FieldOfStudyHeader data={study} />

        {study.teachers && (
          <TeachersCarusel isTitle teachers={study.teachers} />
        )}
      </Container>

      <Container variant={ContainerVariant.White}>
        <div>
          {study.content.map((slice, index) => (
            <Slice {...slice} key={slice.id || index} />
          ))}
        </div>

        <chakra.div pb="130px">
          <MultiGallerySlice galleries={study.galleries} isSmall />
        </chakra.div>
      </Container>
    </>
  )
}
