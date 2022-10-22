// TODO types
export function parseSections(sections) {
  return sections.reduce((memo, item) => {
    if (item.__component.includes('navigation')) {
      const len = memo.length
      const data = memo[len - 1]
      if (len > 0 && data?.__component?.includes('navigation')) {
        memo[len - 1].items.push(item)
        return memo
      }

      memo.push({
        __component: 'navigation.section',
        items: [item],
      })

      return memo
    }
    return [...memo, item]
  }, [])
}
