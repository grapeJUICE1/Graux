import { Button, ButtonProps } from "@chakra-ui/react"
import Link from "next/link"

function CreateBattleButton({
  userIsAuthenticated,
  buttonProps,
}: {
  userIsAuthenticated: boolean
  buttonProps?: ButtonProps
}) {
  return (
    <>
      <Link href={userIsAuthenticated ? "/battles/create" : "/auth/register"}>
        <Button {...buttonProps}>
          {userIsAuthenticated
            ? "Create Battle"
            : "Sign up to Join the aux battle"}
        </Button>
      </Link>
    </>
  )
}
export default CreateBattleButton
