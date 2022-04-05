const setLocalizationData = (setter: Function, data: any, subpath?: string | null) => {
  if (!data || !subpath) {
    setter(null);
    return;
  }
  const values: { [name: string]: string } = {};
  data.forEach((item: any) => values[item.locale] = `${subpath}/${item.slug || item.id}`);
  setter(values);
};

export {
  setLocalizationData,
}