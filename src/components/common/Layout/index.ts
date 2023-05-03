// export { default } from './Layout'
// TODO
import dynamic from 'next/dynamic'

export default dynamic(() => import('./Layout'), {
  ssr: false,
})
