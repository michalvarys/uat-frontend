import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
export const BASE_URL = publicRuntimeConfig.baseURL

export const EDUPAGE_URL = 'https://ssuat.edupage.org/login/'
export const EDUPAGE_TITLE = 'EDUPAGE'
export const SCHOOL_SHORT_TITLE = 'SŠUPAT'

export const REVALIDATE_TIME = 10
