import Container, { ContainerVariant } from 'src/components/common/Container'

export default function NotFound() {
  return (
    <Container variant={ContainerVariant.White}>
      <h1>404</h1>
    </Container>
  )
}
