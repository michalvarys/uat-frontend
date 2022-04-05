import DocumentType from '../types/DocumentType';
import DocumentItem from './components/DocumentItem';
import styles from './DocumentsList.module.scss';


type Props = {
  documents: Array<DocumentType>,
  onSelect: (item: DocumentType) => void,
}

const DocumentsList = ({ documents = [], onSelect }: Props) => {
  return (
    <div className={styles.container}>
      {documents.map((item: DocumentType) => (
        <DocumentItem document={item} key={item.id} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default DocumentsList;
