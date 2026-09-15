import type { SeoComponent } from 'src/utils/seo'
type NewsType = {
  seo?: SeoComponent | null
  id: number
  date: string
  title: string
  slug: string
  sections: any[]
  important_news: boolean
  blinking?: boolean
  localizations: any
}

export default NewsType
