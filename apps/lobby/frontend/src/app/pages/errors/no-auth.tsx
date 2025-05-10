import styled from "@emotion/styled";
import { Button } from "@shared/ui/components/buttons";
import { useNavigate } from "react-router-dom";
import { Path } from "../../models";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
`

export const NoAuth = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <SentimentVeryDissatisfiedIcon />
      <h1>
        401 - Unauthorized
      </h1>
      <p>
        You need to login to veiw this page.
      </p>
      <div>
        <Button onClick={() => navigate(Path.HOME)}>
          Back to Home
        </Button>
      </div>
      <div>
        <Button onClick={() => navigate(Path.LOGIN)}>
          Login
        </Button >
      </div>
    </Container>
  );
};

const SentimentVeryDissatisfiedIcon = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <circle cx="15.5" cy="9.5" r="1.5"/>
        <circle cx="8.5" cy="9.5" r="1.5"/>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"/>
    </svg>
  )
}