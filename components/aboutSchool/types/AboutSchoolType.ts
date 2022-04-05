import EUProjectType from '../../euProjects/types/EUProjectType';
import YouTubeVideoType from '../../slices/types/YouTubeVideoType';
import ApplicationsAtUniversityType from './ApplicationsAtUniversityType';
import EmploymentStatisticsType from './EmploymentStatisticsType';

type AboutSchoolType = {
  id: number,
  title: string,
  description: string,
  buttons: Array<any>,
  video: YouTubeVideoType,
  history: any,
  graduates: any,
  EmploymentStatistics: EmploymentStatisticsType,
  applications_at_university: ApplicationsAtUniversityType,
  eu_projects: Array<EUProjectType>,
};

export default AboutSchoolType;
