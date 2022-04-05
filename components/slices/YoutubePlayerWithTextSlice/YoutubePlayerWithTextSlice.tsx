import Image from 'next/image';
import { transformLink } from '../../../utils/transformLink';
import { ContainerVariant } from '../../common/Container';
import DescriptionSection from '../../common/DescriptionSection';

import { YouTubeVideoWithTextType } from '../types/YouTubeVideoType';
import YoutubePlayerSlice from '../YoutubePlayerSlice';

import styles from './YoutubePlayerWithTextSlice.module.scss';

type YoutubeVideoWithTextProps = {
  data: YouTubeVideoWithTextType,
}

const YoutubePlayerWithTextSlice = ({ data }: YoutubeVideoWithTextProps) => {
  const renderTextSection = () => (
    <div
      style={{
        display: 'flex',
      }}
    >
      <DescriptionSection
        data={{
          content: data.content || '',
          download_link: data.download_link,
          link: data.link,
        }}
        variant={ContainerVariant.Black}
      />
    </div>
  );

  const renderVideo = () => (
    <div style={{

      position: 'relative',
      width: '100%',
    }}>
      {data.cover_image ? (
        <YoutubePlayerSlice data={data} isSmall/>
      ) : <></>}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.video_side}>
        {renderVideo()}
      </div>
      <div className={styles.text_side}>
        {renderTextSection()}
      </div>
    </div>
  )
}

export default YoutubePlayerWithTextSlice;