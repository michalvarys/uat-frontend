import YouTubeVideoType from '../../slices/types/YouTubeVideoType';
type StatisticsSingleEntry = {
  id: number,
  title: string,
  value: string,
};

type StatisticEntries = {
  id: number,
  year: string,
  single_entry: Array<StatisticsSingleEntry>,
}
type EmploymentStatisticsType = {
  id: number,
  statistic_entry: Array<StatisticEntries>
};

export default EmploymentStatisticsType;
export type {
  StatisticEntries,
  StatisticsSingleEntry,
};

