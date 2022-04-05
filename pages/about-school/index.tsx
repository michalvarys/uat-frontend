import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router'
import styles from './about-school.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';

import YoutubePlayerSlice from '../../components/slices/YoutubePlayerSlice';
import AboutSchoolType from '../../components/aboutSchool/types/AboutSchoolType';
import EmploymentStatistics from '../../components/aboutSchool/EmploymentStatistics';
import ApplicationsAtUniversity from '../../components/aboutSchool/ApplicationsAtUniversity';
import EUProjectsSlice from '../../components/slices/EUProjectsSlice';
import ButtonLink, { ButtonLinkImageType, ButtonLinkVariant } from '../../components/navigation/ButtonLink';
import { useEffect } from 'react';
import { useApp } from '../../components/context/AppContext';
import { setLocalizationData } from '../../utils/localizationsUtils';

type AboutSchoolPageProps = {
  data: AboutSchoolType,
};

export default function AboutSchoolPage({ data }: AboutSchoolPageProps) {
  const router = useRouter();
  const { setLocalePaths } = useApp();

  useEffect(() => {
    setLocalizationData(setLocalePaths, null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className={styles.container}>
      <Head>
        <title>{data.title}</title>
      </Head>
      <Container variant={ContainerVariant.Black}>
        <div className={`${styles.inner_black_container} ${styles.inner_container}`}>
          <h1>{data.title}</h1>
          <div className={styles.top_container}>
            <div className={styles.video_container}>
              <YoutubePlayerSlice data={data.video}/>
            </div>
            <div className={styles.description_container}>
              {data.description}
            </div>
          </div>
          {(data.buttons && data.buttons.length > 0) && renderButtons(data.buttons)}
        </div>
      </Container>
      <Container variant={ContainerVariant.White}>
        <div className={`${styles.inner_container} ${styles.inner_white_container}`}>
          <div className={styles.statistics_container}>
            <EmploymentStatistics data={data.EmploymentStatistics}/>
          </div>
        </div>
      </Container>
      <Container variant={ContainerVariant.Black} >
        <div className={`${styles.inner_application_container} ${styles.inner_container}`}>
          <ApplicationsAtUniversity data={data.applications_at_university}/>
        </div>
      </Container>
      <Container variant={ContainerVariant.White} >
        <div className={`${styles.inner_application_container} ${styles.inner_container}`}>
          <EUProjectsSlice projects={data.eu_projects}/>
        </div>
      </Container>
    </div>
  )
};

type StaticPropsType = {
  locale: string,
  query: any,
};

export async function getServerSideProps({ locale, query }: StaticPropsType) {
  const { year } = query; 
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/about-school?_locale=${locale}`;

  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
    };
  }
  const { data } = res;

  return {
    props: {
      data
    },
  }
}