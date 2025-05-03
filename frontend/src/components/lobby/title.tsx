import styled from '@emotion/styled'

const Container = styled.div`
  font-family: "Orbitron", sans-serif;
  color: var(--color-text);
  font-size: 3rem;
  font-weight: 600;
  line-height: 150%;
`

interface TitleProps {
  text: string;
}

export const Title = ({text}: TitleProps) => {
  return (
    <Container>
      {text}
    </Container>
  )
}
