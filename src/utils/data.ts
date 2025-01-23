import { DataType } from 'src/types/data/DataType'

// TODO sjednotit data
export function getAttributes<T extends Record<string, any>>(
  entity: DataType<T> | T
) {
  if (!entity) {
    return null
  }

  const values =
    'data' in entity
      ? entity.data?.attributes
        ? { ...entity.data.attributes, id: entity.data.id }
        : entity.data
      : entity

  return values
}
