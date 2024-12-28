import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './documents.module.scss'
import axios from 'axios'

import Container, { ContainerVariant } from 'src/components/common/Container'
import { getString, Strings } from 'src/locales'
import PaginationSwitcher from 'src/components/common/PaginationSwitcher'
import { PaginationSwitcherVariant } from 'src/components/common/PaginationSwitcher/PaginationSwitcher'
import DocumentType from 'src/components/documents/types/DocumentType'
import DocumentsList from 'src/components/documents/DocumentsList'
import SegmentedControl from 'src/components/common/buttons/SegmentedControl'
import SearchBox from 'src/components/common/SearchBox'
import { useApp } from 'src/components/context/AppContext'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getDocumentList } from '@/queries/documents'

const sortByName = (a: DocumentType, b: DocumentType) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

const sortByDate = (a: DocumentType, b: DocumentType) => {
  const dateA = new Date(a.updated_at).getTime()
  const dateB = new Date(b.updated_at).getTime()
  if (dateA === dateB) {
    return 0
  }
  return dateA > dateB ? -1 : 1
}

type DocumentsProps = {
  documents: DocumentType[]
}

export default function Documents({ documents }: DocumentsProps) {
  const router = useRouter()
  const { setLocalePaths } = useApp()
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSort, setCurrentSort] = useState(0)
  const [currentSearch, setCurrentSearch] = useState('')
  const pagesCount = Math.ceil(documents.length / 15)

  useEffect(() => {
    setLocalizationData(setLocalePaths, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelect = (document: DocumentType) => {
    console.log('get doc: ' + document.name)
    // router.push(`/news/${news.slug}`);
  }

  const onSearchChange = (value: string) => {
    setCurrentPage(0)
    setCurrentSearch(value)
  }

  return (
    <Container variant={ContainerVariant.Orange}>
      <Head>
        <title>{getString(router.locale, Strings.DOCUMENTS)}</title>
      </Head>
      <div className={styles.container}>
        <div>
          <div className={styles.header}>
            <h1>{getString(router.locale, Strings.DOCUMENTS)}</h1>
            <div className={styles.controls_container}>
              <SearchBox
                currentValue={currentSearch}
                onChange={onSearchChange}
                placeholder={getString(router.locale, Strings.SEARCH)}
              />
              <SegmentedControl
                current={currentSort}
                onSelect={(current: number) => setCurrentSort(current)}
                items={[
                  getString(router.locale, Strings.NAME) || '',
                  getString(router.locale, Strings.DATE) || '',
                ]}
              />
            </div>
          </div>
          <PaginationSwitcher
            onSelect={setCurrentPage}
            pages={Array.from(Array(pagesCount).keys()).map((item) =>
              (item + 1).toString()
            )}
            current={currentPage}
            variant={PaginationSwitcherVariant.OrangeBackground}
          />
          <div>
            <DocumentsList
              documents={documents
                .filter((item: DocumentType) =>
                  item.name.includes(currentSearch)
                )
                .sort(currentSort === 0 ? sortByName : sortByDate)
                .slice(currentPage * 15, (currentPage + 1) * 15)}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

export async function getServerSideProps(
  _ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DocumentsProps>> {
  try {
    const documents = await getDocumentList()

    return {
      props: {
        documents,
      },
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    }
  }
}
