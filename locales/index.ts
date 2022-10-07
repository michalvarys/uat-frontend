import en from './en'
import sk from './sk'

const langs: { [lang: string]: { [key: string]: string } } = {
  en,
  sk,
}

const getString = (lang: string | undefined, key: string) => {
  if (langs && lang && langs[lang] && langs[lang][key]) {
    return langs[lang][key]
  }
  return key || ''
}

const Strings: { [key: string]: string } = Object.keys(sk).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: curr,
  }),
  {}
)

export { Strings, getString }
