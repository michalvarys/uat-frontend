// TODO
export function CodeSlice(section) {
  // eslint-disable-next-line react/no-children-prop
  return <pre>{JSON.stringify(section, null, 2)}</pre>
}
