'use client'

import { useState } from 'react'

import Container, { ContainerVariant } from 'src/components/common/Container'
import { getString, Strings } from 'src/locales'
import PaginationSwitcher from 'src/components/common/PaginationSwitcher'
import { PaginationSwitcherVariant } from 'src/components/common/PaginationSwitcher/PaginationSwitcher'
import DocumentType from 'src/components/documents/types/DocumentType'
import DocumentsList from 'src/components/documents/DocumentsList'
import SegmentedControl from 'src/components/common/buttons/SegmentedControl'
import SearchBox from 'src/components/common/SearchBox'

import styles from './documents.module.scss'

const PAGE_SIZE = 15

const sortByName = (a: DocumentType, b: DocumentType) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())

const sortByDate = (a: DocumentType, b: DocumentType) => {
  const dateA = new Date(a.updated_at).getTime()
  const dateB = new Date(b.updated_at).getTime()
  if (dateA === dateB) {
    return 0
  }
  return dateA > dateB ? -1 : 1
}

type Props = {
  documents: DocumentType[]
  lang: string
}

export default function DocumentsView({ documents, lang }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const [currentSort, setCurrentSort] = useState(0)
  const [currentSearch, setCurrentSearch] = useState('')

  const filtered = documents
    .filter((item) => item.name.includes(currentSearch))
    .sort(currentSort === 0 ? sortByName : sortByDate)

  const pagesCount = Math.ceil(filtered.length / PAGE_SIZE)

  const onSearchChange = (value: string) => {
    setCurrentPage(0)
    setCurrentSearch(value)
  }

  return (
    <Container variant={ContainerVariant.Orange}>
      <div className={styles.container}>
        <div>
          <div className={styles.header}>
            <h1>{getString(lang, Strings.DOCUMENTS)}</h1>
            <div className={styles.controls_container}>
              <SearchBox
                currentValue={currentSearch}
                onChange={onSearchChange}
                placeholder={getString(lang, Strings.SEARCH)}
              />
              <SegmentedControl
                current={currentSort}
                onSelect={setCurrentSort}
                items={[
                  getString(lang, Strings.NAME) || '',
                  getString(lang, Strings.DATE) || '',
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
              documents={filtered.slice(
                currentPage * PAGE_SIZE,
                (currentPage + 1) * PAGE_SIZE
              )}
              // Kliknutí na dokument řeší odkaz v DocumentItem, který
              // soubor otevře v novém okně — žádná další akce netřeba.
              onSelect={() => undefined}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}
