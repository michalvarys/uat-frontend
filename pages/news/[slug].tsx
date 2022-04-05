import moment from 'moment';
import 'moment/locale/sk';
import axios from 'axios';
import Head from 'next/head';
import styles from './news.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';
import NewsType from '../../components/news/types/NewsType';
import RichTextSlice from '../../components/slices/RichTextSlice';
import GallerySlice from '../../components/slices/GallerySlice';

import { REVALIDATE_TIME } from '../../consts/app.consts';
import YoutubePlayerSlice from '../../components/slices/YoutubePlayerSlice';
import ButtonLink, { ButtonLinkImageType } from '../../components/navigation/ButtonLink';
import { useEffect } from 'react';
import { setLocalizationData } from '../../utils/localizationsUtils';
import { useApp } from '../../components/context/AppContext';

type NewsDetailsPageProps = {
  slug?: string,
  news: NewsType | null,
};

export default function NewsDetails({ news, ...rest }: NewsDetailsPageProps) {
  const { setLocalePaths } = useApp();

  useEffect(() => {
    if (news && news.localizations.length > 0) {
      setLocalizationData(setLocalePaths, news.localizations, '/news');
    } else {
      setLocalizationData(setLocalePaths, null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news]);

  const renderNewsSection = (section: any) => {
    switch (section.__component) {
      case 'shared.rich-text-with-title':
        return (
          <div key={`section-rich-text-${section.id}`} className={styles.rich_text}>
            <RichTextSlice data={section}/>
          </div>
        );
      case 'shared.you-tube-player-slice':
        return (
          <div className={styles.player} key={`section-youtube-${section.id}`}>
            <YoutubePlayerSlice data={section}/>
          </div>
        );
      case 'shared.gallery':
        return (
          <div className={styles.gallery} key={`section-gallery-${section.id}`}>
            <GallerySlice data={section} />
          </div>
        );
      case 'navigation.section':
        return (
          <div className={styles.navigation}>
            {section.items.map((item: any) => (
              <div key={`link-=${item.id}`}>
                <ButtonLink
                  imageType={item.__component.includes('download') ? ButtonLinkImageType.Download : ButtonLinkImageType.Arrow}
                  title={item.title}
                  path={item.url || item.path}
                />
              </div>
            ))}
          </div>
        )
    }
  }
  
  if (!news) {
    return <></>
  }
  return (
    <Container variant={ContainerVariant.White}>
      <Head>
        <title>{news.title}</title>
      </Head>
      <div className={styles.details_container}>
        <span className={styles.date}>{moment(news.date).format('DD MMMM YYYY')}</span>
        <div className={styles.title}>
          <h1 className={styles.header}>{news.title}</h1>
        </div>
        {news.sections
          .reduce((acc, item) => {
            if (item.__component.includes('navigation')) {
              if (acc.length > 0 && acc[acc.length - 1].__component.includes('navigation')) {
                acc[acc.length - 1] = {
                  ...acc[acc.length - 1],
                  items: [...acc[acc.length - 1].items, item]
                }
                return acc
              }
              return [
                ...acc,
                {
                  __component: 'navigation.section',
                  items: [item],
                }
              ];
            }
            return [...acc, item];
          }, [])
          .map((item: any) => renderNewsSection(item))
        }
      </div>
    </Container>
  )
};

type StaticPathsPropsType = {
  locales: Array<string>,
};

export async function getStaticPaths({ locales }: StaticPathsPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/news?${locales.map((locale: string, idx: number) => {
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
  const { news } = res.data;
  return {
    paths: news.map((item: NewsType) => (
      { params: { slug: item.slug, news: item } }
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
  const url = `${baseURL}:${port}/news?_locale=${locale}&slug=${params.slug}`;
  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    };
  }
  const { news } = res.data;
  return {
    props: {
      news: news && news.length > 0 ? news[0] : null,
    },
    revalidate: REVALIDATE_TIME,
  }
};