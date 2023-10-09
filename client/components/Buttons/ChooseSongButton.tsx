import { Button, ButtonProps } from "@chakra-ui/react"
import Link from "next/link"

function CreateBattleButton({
  battleId,
  buttonProps,
}: {
  battleId: string
  buttonProps?: ButtonProps
}) {
  return (
    <>
      <Link href={`/battles/${battleId}/choose`}>
        <Button {...buttonProps}>Choose Song</Button>
      </Link>
    </>
  )
}
export default CreateBattleButton
