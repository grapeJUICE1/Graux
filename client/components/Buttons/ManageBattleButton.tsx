import { Button, ButtonProps } from "@chakra-ui/react"
import Link from "next/link"

function ManageBattleButton({
  battleId,
  buttonProps,
}: {
  battleId: string
  buttonProps?: ButtonProps
}) {
  return (
    <>
      <Link href={`/battles/${battleId}/manage`}>
        <Button {...buttonProps}>Manage Battle</Button>
      </Link>
    </>
  )
}
export default ManageBattleButton
