import { DataType } from 'src/types/data/DataType'

export type ImageTypeProps = {
  height: number
  width: number
  name: string
  size: number
  url: string
  id: number
  ext: string
  alternativeText: string
  formats: any
}

type ImageType = DataType<ImageTypeProps> | ImageTypeProps

export default ImageType
