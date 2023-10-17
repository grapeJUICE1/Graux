import { Button, ButtonProps } from "@chakra-ui/react"
import Link from "next/link"

function ChooseSongButton({
  battleId,
  battleStatus,
  buttonProps,
}: {
  battleId: string
  buttonProps?: ButtonProps
  battleStatus: string
}) {
  return (
    <>
      {battleStatus === "creation" && (
        <>
          <Link href={`/battles/${battleId}/choose`}>
            <Button {...buttonProps}>Choose Song</Button>
          </Link>
        </>
      )}
    </>
  )
}
export default ChooseSongButton
