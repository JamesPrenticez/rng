import styled from "@emotion/styled"
import { Button, ButtonVariants, SubTitle, Title, Tooltip } from "@shared/components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .row {
    display: flex;
    background-color: red;
    justify-content: center;
    gap: 2rem;
  }
`

export const TooltipPage = () => {
  return (
    <Container>
      <Title>Tooltip</Title>

      <section>
        <div className="row">
          <Tooltip content="this is a tooltxckashldkfhalsjkdhflakjsdhfladip">
            hello worldfjadsljfkahsdlkfjhalsdjk
          </Tooltip>
        </div>
      </section>
    </Container>
  )
}