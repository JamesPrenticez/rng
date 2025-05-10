import { Button } from "@shared/ui/components/buttons"
import { Path } from "../../models"
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate(Path.HOME)}>
          Back to Home
      </Button >

      <h1>
        LoginPage
      </h1>

    </div>
  )
}
