import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import styles from './studies.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';
import FieldOfStudyType from '../../components/fields/types/FieldOfStudyType';
import FieldOfStudyHeader from '../../components/fields/FieldOfStudyHeader';
import MultiGallerySlice from '../../components/slices/MultiGallerySlice';
import TextWithImageType from '../../components/slices/types/TextWithImageType';
import TextWithImageSlice from '../../components/slices/TextWithImageSlice';
import TeachersCarusel from '../../components/teachers/TeachersCarusel';

import { REVALIDATE_TIME } from '../../consts/app.consts';
import Subjects from '../../components/fields/Subjects';
import { useApp } from '../../components/context/AppContext';
import { setLocalizationData } from '../../utils/localizationsUtils';



type FieldOfStudyProps = {
  study: FieldOfStudyType,
};

export default function FieldOfStudy({ study }: FieldOfStudyProps) {
  const { setLocalePaths } = useApp();

  useEffect(() => {
    if (study && study.localizations.length > 0) {
      setLocalizationData(setLocalePaths, study.localizations, '/studies');
    } else {
      setLocalizationData(setLocalePaths, null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study]);

  if (!study) {
    return <></>
  }

  const renderSlice = (slice: any, index: number) => {
    switch (slice.__component) {
      case 'shared.text-with-image':
        return (
          <TextWithImageSlice
            key={`text-with-image-${slice.id}`}
            data={slice}
            extraTextTopSpace={120}
          />
        );
      case 'shared.subjects':
        return <Subjects key={`subjects-${slice.id}`} subjects={slice}/>;
      default:
        return null;
    }
  }
  return (
    <>
      <Head>
        <title>{study.name}</title>
      </Head>
      <Container variant={ContainerVariant.Black} isHigh>
        <FieldOfStudyHeader data={study}/>
        
        {study.teachers && (
          <TeachersCarusel isTitle teachers={study.teachers}/>
        )}
      </Container>
      <Container variant={ContainerVariant.White}>
        <div>
          {study.content.map((item: TextWithImageType, index: number) => renderSlice(item, index))}
        </div>
        <div className={styles.galleries_container}>
          <MultiGallerySlice galleries={study.galleries} isSmall/>
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
  const url = `${baseURL}:${port}/field-of-studies?${locales.map((locale: string, idx: number) => {
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
  const studies = res.data;
  return {
    paths: studies.map((item: FieldOfStudyType) => (
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
  const url = `${baseURL}:${port}/field-of-studies/${params.id}?_locale=${locale}`;

  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    };
  }
  const study = res.data;
  return {
    props: {
      study,
    },
    revalidate: REVALIDATE_TIME,
  }
};