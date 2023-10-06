import { Box, Button, Text, useToast } from "@chakra-ui/react"
import DeleteButton from "../../../../components/Buttons/DeleteButton"
import {
  BattleRequest,
  useRemoveBattleRequestMutation,
} from "../../../../gql/graphql"

interface BattleRequestCardProps {
  battleRequest: BattleRequest
}
function BattleRequestCard({ battleRequest }: BattleRequestCardProps) {
  const [removeBattleRequest] = useRemoveBattleRequestMutation()
  const toast = useToast()
  function copyLinkButtonOnClick(requestId: number) {
    navigator.clipboard.writeText(
      window.location.origin + `/users/approveBattleRequest/${requestId}`
    )
    toast({
      title: "Copied Link To Clipboard",
      status: "success",
      duration: 2000,
    })
  }
  return (
    <Box
      key={battleRequest.id}
      bgColor="gray.700"
      py="10"
      pl="10"
      width="100%"
      my="5"
    >
      <Box fontSize="xl">
        <Text display="inline" fontWeight="medium">
          username:{" "}
        </Text>
        {battleRequest?.user?.username}
      </Box>

      <Box fontSize="xl">
        <Text display="inline" fontWeight="medium">
          request validated:{" "}
        </Text>
        {battleRequest?.validated?.toString() || ""}
      </Box>
      <Button
        onClick={() => copyLinkButtonOnClick(+battleRequest?.id)}
        colorScheme="cyan"
        mr="5"
        mt="5"
      >
        Copy Link To Approve Request
      </Button>
      <DeleteButton
        modalHeader="Remove Battle Request"
        modalBody="Are you sure you want to remove this battle request?"
        mutationFunc={() =>
          removeBattleRequest({
            variables: { battleRequestId: +battleRequest?.id },
          })
        }
        buttonProps={{ mt: 5 }}
      />
    </Box>
  )
}
export default BattleRequestCard
