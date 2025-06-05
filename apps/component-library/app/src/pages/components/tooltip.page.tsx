import styled from "@emotion/styled"
import { Button, ButtonVariants, MockIframe, SubTitle, Title, Tooltip } from "@shared/components"
import { Themes, ThemeWrapper } from "@shared/theme"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .row {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
`

const Test = styled.div`
  width: 300px;
  height: 300px;
  /* background-color: red; */
  background: var(--color-primary);
`

export const TooltipPage = () => {
  return (
    <Container>
      <Title>Tooltip</Title>

      <section>
        <div className="row">

        <Tooltip message="This is a tooltip">
          <Button>
            Hover inside iframe
          </Button>
        </Tooltip>

      <MockIframe>
        <Tooltip message="This is a tooltip">
          <Button>
            Hover inside iframe
          </Button>
        </Tooltip>
      </MockIframe>
        </div>
      </section>
    </Container>
  )
}