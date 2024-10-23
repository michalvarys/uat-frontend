import YoutubePlayer from 'react-youtube'
import Image from 'next/image'
import { useCallback, useRef, useState, useLayoutEffect } from 'react'

import styles from './YoutubePlayerSlice.module.scss'

import YouTubeVideoType from '../types/YouTubeVideoType'

import PlayIcon from 'public/icons/common/play.svg'
import { AspectRatio } from '@chakra-ui/react'
import { DbImage } from 'src/components/DbImage'
import { getAttributes } from 'src/utils/data'

type YoutubeVideoProps = {
  data: YouTubeVideoType
  isSmall?: boolean
}

const YoutubePlayerSlice = ({ data }: YoutubeVideoProps) => {
  const [videoState, setVideoState] = useState<number>(-1)
  const [videoHeight, setVideoHeight] = useState<number>(10)
  const containerRef = useRef(null)
  let player: any = null

  const { cover_image } = data
  const coverImage = getAttributes(cover_image)

  const onResize = useCallback(() => {
    const container: any = containerRef && containerRef.current
    if (container && coverImage) {
      setVideoHeight(
        (container.offsetWidth * coverImage.height) / coverImage.width
      )
    }
  }, [coverImage])

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  const onPlayVideo = () => {
    if (player) {
      if (videoState === -1) {
        player.playVideo()
      }
    }
  }

  const onPlayerReady = (event: any) => {
    player = event.target
  }

  const onStateChange = (event: any) => {
    if (event.data === 0) {
      event.target.stopVideo()
    }
    setVideoState(event.data)
  }

  if (!data || !data.youtube_video_id) {
    return <></>
  }

  return (
    <AspectRatio maxW="full" ratio={16 / 9}>
      <div className={styles.container} ref={containerRef}>
        <div
          className={`${styles.cover} ${videoState > 0 && styles.cover_hidden}`}
          onClick={onPlayVideo}
        >
          <div className={styles.play_button}>
            <Image alt={'Play'} src={PlayIcon} />
          </div>
          <DbImage
            data={coverImage}
            props={(image) => ({
              width: image.width,
              height: image.height,
              objectFit: 'cover',
              objectPosition: 'center center',
            })}
          />
        </div>
        <div className={styles.player}>
          {/**
           * eslint-disable-next-line @typescript-eslint/ban-ts-comment
           * @ts-ignore */}
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
    </AspectRatio>
  )
}

YoutubePlayerSlice.defaultProps = {
  isSmall: false,
}

export default YoutubePlayerSlice
