import YoutubePlayer from 'react-youtube';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';

import styles from './YoutubePlayerSlice.module.scss';

import YouTubeVideoType from '../types/YouTubeVideoType';
import { transformLink } from '../../../utils/transformLink';

import PlayIcon from '../../../public/icons/common/play.svg';

type YoutubeVideoProps = {
  data: YouTubeVideoType,
  isSmall?: boolean,
}

const YoutubePlayerSlice = ({ data }: YoutubeVideoProps) => {
  const [videoState, setVideoState] = useState<number>(-1);
  const [videoHeight, setVideoHeight] = useState<number>(10);
  const containerRef = useRef(null);
  let player: any = null;


  const onResize = useCallback(() => {
    const container: any = containerRef && containerRef.current;
    if (container && data.cover_image) {
      setVideoHeight(container.offsetWidth * data.cover_image.height / data.cover_image.width)
    }
  }, [setVideoHeight, data]);

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  const onPlayVideo = () => {
    if (player) {
      if (videoState === -1) {
        player.playVideo();
      }
    }
  };

  const onPlayerReady = (event: any) => {
    player = event.target;
  }

  const onStateChange = (event: any) => {
    if (event.data === 0) {
      event.target.stopVideo();
    }
    setVideoState(event.data)
  }

  if (!data || !data.youtube_video_id) {
    return <></>
  }
  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={`${styles.cover} ${videoState > 0 && styles.cover_hidden}`}
        onClick={onPlayVideo}
      >
        <div className={styles.play_button}>
          <Image
            alt={'Play'}
            src={PlayIcon}
          />
        </div>
        {data.cover_image && (
          <Image
            alt={data.cover_image.alternativeText}
            src={transformLink(data.cover_image.url)}
            width={data.cover_image.width}
            height={data.cover_image.height}
            layout={'fill'}
            objectFit={'cover'}
          />
        )}
      </div>
      <div className={styles.player}>
        <YoutubePlayer
          videoId={data.youtube_video_id}
          opts={{
            height: videoHeight.toString(),
            width: '100%',
          }}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      </div>
    </div>
  );
};

YoutubePlayerSlice.defaultProps = {
  isSmall: false,
}

export default YoutubePlayerSlice;
