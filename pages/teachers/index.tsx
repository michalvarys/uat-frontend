import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import styles from './teachers.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';
import TeachersList from '../../components/teachers/TeachersList';
import TeacherType from '../../components/teachers/types/TeacherType';
import TeacherDetailsModal from '../../components/teachers/TeachersList/components/TeacherDetailsModal';
import { getString, Strings } from '../../locales';
import axios from 'axios';
import { setLocalizationData } from '../../utils/localizationsUtils';
import { useApp } from '../../components/context/AppContext';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type TeachersPageProps = {
  teachers: Array<TeacherType>,
}

export default function Teachers({ teachers }: TeachersPageProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherType | undefined>(undefined);

  const router = useRouter();
  const { setLocalePaths } = useApp();

  useEffect(() => {
    setLocalizationData(setLocalePaths, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const teacherId: number = parseInt((router.query.id || '').toString(), 10);
    if (Number.isNaN(teacherId)) {
      setSelectedTeacher(undefined);
    }
    else if (!selectedTeacher || teacherId !== selectedTeacher.id) {
      const newTeacher: TeacherType | undefined = teachers.find((teacher: TeacherType) => teacher.id === teacherId);
      setSelectedTeacher(newTeacher);
    }
  }, [router, router.query.id, selectedTeacher, teachers]);


  const onSelectItem = (item: TeacherType) => {
    setSelectedTeacher(item);
    router.replace(`/teachers?id=${item.id}`, undefined, { shallow: true });
  };

  const onCloseTeacherDetails = () => {
    setSelectedTeacher(undefined);
    router.replace('/teachers', undefined, { shallow: true });
  };

  return (
    <Container variant={ContainerVariant.White}>
      <Head>
        <title>{getString(router.locale, Strings.TEACHING_STUFF)}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{getString(router.locale, Strings.TEACHING_STUFF)}</h1>
        </div>
        <TeachersList
          teachers={teachers}
          onSelect={onSelectItem}
        />
        {selectedTeacher && (
          <TeacherDetailsModal
            data={selectedTeacher}
            isOpen={!!selectedTeacher}
            onClose={onCloseTeacherDetails}
          />
        )}
      </div>
    </Container>
  )
}

export async function getServerSideProps({ locale }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<TeachersPageProps>> {
  const url = `/teachers?_locale=${locale}`

  try {
    const { data: teachers } = await axios(url);

    return {
      props: {
        teachers,
      },
    }
  } catch (e) {
    return {
      props: {
        teachers: [],
      }
    };
  }
}