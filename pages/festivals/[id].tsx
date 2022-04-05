import Image from 'next/image';
import Head from 'next/head';
import moment from 'moment';

import styles from './festivals.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';
import FestivalType from '../../components/festivals/types/FestivalType';
import axios from 'axios';
import { REVALIDATE_TIME } from '../../consts/app.consts';
import { transformLink } from '../../utils/transformLink';
import TextWithImageSlice from '../../components/slices/TextWithImageSlice';
import TextWithImageType from '../../components/slices/types/TextWithImageType';
import FestivalWinners from '../../components/festivals/FestivalWinners';
import FestivalPrizes from '../../components/festivals/FestivalPrizes/FestivalPrizes';
import ButtonLink, { ButtonLinkImageType, ButtonLinkVariant } from '../../components/navigation/ButtonLink';
import { useApp } from '../../components/context/AppContext';
import { useEffect } from 'react';
import { setLocalizationData } from '../../utils/localizationsUtils';


type FestivalsProps = {
  festival: FestivalType,
};

export default function Festival({ festival }: FestivalsProps) {
  const { cover_image, content, winners, prizes, title } = festival;
  const { setLocalePaths } = useApp();

  useEffect(() => {
    if (festival && festival.localizations.length > 0) {
      setLocalizationData(setLocalePaths, festival.localizations, '/festivals');
    } else {
      setLocalizationData(setLocalePaths, null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [festival]);

  if (!festival) {
    return <></>
  }
  
  const renderStudyBadge = () => (
    <div className={styles.badge}>
      <div className={styles.symbol}>
        {festival.symbol}
      </div>
      <div className={styles.date}>
        <span>{moment(festival.date).format('DD MMM YYYY')}</span>
      </div>
    </div>
  )

  const renderButtons = (buttons: Array<any>) => {
    return (
      <div className={styles.buttons}>
        {buttons.map((item: any) => (
          <div key={`link-=${item.id}`}>
            <ButtonLink
              imageType={item.__component.includes('download') ? ButtonLinkImageType.Download : ButtonLinkImageType.Arrow}
              title={item.title}
              path={item.url || item.path}
              variant={ButtonLinkVariant.Black}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container variant={ContainerVariant.Black}>
        <div className={styles.top_container}>
          <div className={styles.text_section}>
            <h1 className={styles.header}>{festival.title}</h1>
            <div className={styles.slogan_section}>
              {renderStudyBadge()}
              <div className={styles.slogan}>{festival.slogan}</div>
            </div>
            <div className={styles.description}>
              {festival.description}
            </div>
            {(festival.buttons && festival.buttons.length > 0) && renderButtons(festival.buttons)}
          </div>
          <div className={styles.image}>
          {cover_image ? (
            <Image
              alt={cover_image.alternativeText}
              src={transformLink(cover_image.url)}
              width={cover_image.width}
              height={cover_image.height}
              layout={'responsive'}
              objectFit={'contain'}
              objectPosition={'center center'}
            />
          ) : <></>}
          </div>
        </div>
      </Container>
      <Container variant={ContainerVariant.Transparent} isHigh>
        {prizes && (
          <FestivalPrizes prizes={prizes}/>
        )}
      </Container>
      <Container variant={ContainerVariant.White}>
        <div>
          <div>
            {content ? content.map((item: TextWithImageType, index: number) => (
              <TextWithImageSlice key={item.id} data={item} extraTextTopSpace={index === 0 ? 194 : 0}/>
            )) : <></>}
          </div>
        </div>
        <div className={styles.winners_container}>
          {winners && winners.length > 0 && (
            <FestivalWinners winners={winners}/>
          )}
        </div>
      </Container>
    </>
  )
};

type StaticPathsPropsType = {
  locales: Array<string>,
};

export async function getStaticPaths({ locales }: StaticPathsPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/festivals?${locales.map((locale: string, idx: number) => {
    return `_locale=${locale}${idx < locales.length - 1 ? '&' : ''}`;
  }).join('')}`;
  
  
  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
  const festivals = res.data;
  return {
    paths: festivals.map((item: FestivalType) => (
      { params: { id: item.id.toString() } }
    )),
    fallback: 'blocking',
  };
};

type StaticPropsType = {
  locale: string,
  params: any,
};

export async function getStaticProps({ locale, params }: StaticPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/festivals/${params.id}?_locale=${locale}`;

  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    };
  }
  const festival = res.data;
  return {
    props: {
      festival,
    },
    revalidate: REVALIDATE_TIME,
  }
};
