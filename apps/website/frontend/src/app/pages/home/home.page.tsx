import styled from '@emotion/styled';
import { project } from '../../contants';
import { GradientText } from '@shared/ui/components/effects';
import { NewsLetterSignUp } from '../../components/newsletter-signup';
import { Button } from '@shared/ui/components/buttons';
import { TextInput } from '@shared/ui/components/inputs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100dvh;
  background-color: var(--color-background);
  justify-content: center;
  align-items: center;
  color: var(--color-text);
  padding: 1rem;

  h1 {
    font-size: 10rem;
    font-weight: 900;
    font-family: 'Nunito Sans', sans-serif;
    color: var(--color-primary);
  }

  h2 {
    text-align: center;

    font-size: 4rem;
    font-weight: 600;
  }

  .newsletter {
    margin-top: 2rem;
    width: 100%;
    min-width: 32rem;
    max-width: 60rem;
  }
`;

export const HomePage = () => {
  return (
    <Container>
      <GradientText
        bgcolor1="var(--color-primary)"
        bgcolor2="var(--color-secondary)"
        bgcolor3="var(--color-accent)"
        text={project.name}
      />
      <h2>The worlds most powerful construction management software.</h2>

      <div className="newsletter">
        <NewsLetterSignUp />
      </div>

      <div>
        <Button> Test </Button>
        <TextInput isMobile={false} />
      </div>
    </Container>
  );
};
