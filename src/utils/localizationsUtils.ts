const setLocalizationData = (
  setter: Function,
  data: any,
  subpath?: string | null
) => {
  if (!data || !subpath) {
    setter(null)
    return
  }
  const values: { [name: string]: string } = data.reduce((item, memo) => {
    memo[item.locale] = `${subpath}/${item.slug || item.id}`
    return item
  }, {})
  // data.forEach(
  //   (item: any) => (values[item.locale] = `${subpath}/${item.slug || item.id}`)
  // )
  setter(values)
}

export { setLocalizationData }
