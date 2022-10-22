import { Subjects } from './Subjects'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'

export function Slice(slice) {
  switch (slice.__component) {
    case 'shared.text-with-image':
      return (
        <TextWithImageSlice
          key={`text-with-image-${slice.id}`}
          data={slice}
          extraTextTopSpace={120}
        />
      )
    case 'shared.subjects':
      return <Subjects key={`subjects-${slice.id}`} subjects={slice} />
  }

  return null
}
