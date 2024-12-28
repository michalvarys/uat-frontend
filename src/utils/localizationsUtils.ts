const setLocalizationData = (
  setter: Function,
  data: { id: number; attributes: { locale: string; slug: string } }[] | null,
  subpath?: string | null
) => {
  if (!data || !subpath) {
    setter(null)
    return
  }

  const values: { [name: string]: string } = data.reduce((memo, item) => {
    const locale = item?.attributes?.locale
    memo[locale] = `${subpath}/${item?.attributes?.slug || item.id}`
    return memo
  }, {})

  setter(values)
}

export { setLocalizationData }
