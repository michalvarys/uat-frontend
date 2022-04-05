type NewsType = {
  id: number,
  date: string,
  title: string,
  slug: string,
  sections: Array<any>,
  important_news: boolean,
  localizations: any,
};

export default NewsType;
