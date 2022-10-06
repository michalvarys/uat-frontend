import Header from '../Header'
import Footer from '../Footer'

import { MenuSection } from '../Header/Header'
import FooterType from '../../../types/data/FooterType'

type Props = {
  children: JSX.Element
  footer: FooterType
  menu: MenuSection[]
}

const Layout = ({ children, footer, menu }: Props) => {
  return (
    <div>
      <Header data={menu} />
      <div>{children}</div>
      <Footer data={footer} />
    </div>
  )
}

export default Layout
