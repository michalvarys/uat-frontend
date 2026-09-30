'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Container, { ContainerVariant } from 'src/components/common/Container'
import TeachersList from 'src/components/teachers/TeachersList'
import TeacherType from 'src/components/teachers/types/TeacherType'
import TeacherDetailsModal from 'src/components/teachers/TeachersList/components/TeacherDetailsModal'
import { getString, Strings } from 'src/locales'
import { localePath } from 'src/i18n/config'

import styles from './teachers.module.scss'

type Props = {
  teachers: TeacherType[]
  lang: string
}

export default function TeachersView({ teachers, lang }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Otevřený učitel se drží v URL (?id=), aby šel detail sdílet odkazem.
  // Dřív se kopíroval do stavu přes useEffect; tady stačí číst přímo.
  const selectedTeacher = useMemo(() => {
    const id = parseInt(searchParams.get('id') || '', 10)
    if (Number.isNaN(id)) {
      return undefined
    }
    return teachers.find((teacher) => teacher.id === id)
  }, [searchParams, teachers])

  const basePath = localePath('/teachers', lang)

  const onSelectItem = useCallback(
    (item: TeacherType) => {
      router.replace(`${basePath}?id=${item.id}`, { scroll: false })
    },
    [router, basePath]
  )

  const onCloseTeacherDetails = useCallback(() => {
    router.replace(basePath, { scroll: false })
  }, [router, basePath])

  return (
    <Container variant={ContainerVariant.White}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{getString(lang, Strings.TEACHING_STUFF)}</h1>
        </div>
        <TeachersList teachers={teachers} onSelect={onSelectItem} />
        {selectedTeacher && (
          <TeacherDetailsModal
            data={selectedTeacher}
            isOpen={!!selectedTeacher}
            onClose={onCloseTeacherDetails}
          />
        )}
      </div>
    </Container>
  )
}
