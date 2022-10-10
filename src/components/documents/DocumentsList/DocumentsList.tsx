import { chakra } from '@chakra-ui/react'
import DocumentType from '../types/DocumentType'
import DocumentItem from './components/DocumentItem'
import styles from './DocumentsList.module.scss'

type Props = {
  documents: DocumentType[]
  onSelect: (item: DocumentType) => void
}

const DocumentsList = ({ documents = [], onSelect }: Props) => {
  return (
    <chakra.div w="full" className={styles.container}>
      {documents.map((item: DocumentType) => (
        <DocumentItem document={item} key={item.id} onSelect={onSelect} />
      ))}
    </chakra.div>
  )
}

export default DocumentsList
