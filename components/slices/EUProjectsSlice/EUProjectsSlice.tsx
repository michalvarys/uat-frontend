import styles from './EUProjectsSlice.module.scss';

import { getString, Strings } from '../../../locales';
import { useRouter } from 'next/router';
import EUProjectsList from '../../euProjects/EUProjectsList';
import EUProjectType from '../../euProjects/types/EUProjectType';
import { useState } from 'react';
import PaginationSwitcher from '../../common/PaginationSwitcher';
import { PaginationSwitcherVariant } from '../../common/PaginationSwitcher/PaginationSwitcher';

type Props = {
  projects: Array<EUProjectType>,
}

const EUProjectsSlice = ({ projects }: Props) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pagesCount = Math.ceil(projects.length / 9);


  const onSelectProject = (project: EUProjectType) => {
    router.push(`${project.link}`);
  };

  return (
    <div className={styles.container}>
        <h1 className={styles.header}>{getString(router.locale, Strings.EU_PROJECTS)}</h1>
        <PaginationSwitcher
          onSelect={setCurrentPage}
          pages={Array.from(Array(pagesCount).keys()).map((item) => (item + 1).toString())}
          current={currentPage}
          variant={PaginationSwitcherVariant.WhiteBackground}
        />
        <EUProjectsList projects={projects.slice(currentPage * 9, (currentPage + 1) *9)} onSelect={onSelectProject}/>
        
    </div>
  );
};

export default EUProjectsSlice;
