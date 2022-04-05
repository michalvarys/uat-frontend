import parse from 'html-react-parser';
import RichTextType from '../../../types/data/RichTextType';
import styles from './RichTextSlice.module.scss';

type Props = {
  data: RichTextType,
}

const RichTextSlice = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      {data.title && <div className={styles.title}>{data.title}</div>}
      <div className={styles.content}>{parse(data.content)}</div>
    </div>
  );
};

export default RichTextSlice;
