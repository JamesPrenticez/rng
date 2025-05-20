import styled from '@emotion/styled'

const Container = styled.div`
  min-height: 100dhv;
`

// It is very important to understand that this app is use to DISPLAY ONLY the components from shared. 
// It is NOT a place to build new components
export const AppLayoutComponentLibrary = () => {
  return (
    <Container>
      <h1>Component Library</h1>
    </Container>
  )
}