export type DataType<T> = {
  id: number
  data: {
    attributes: T
  }
}
