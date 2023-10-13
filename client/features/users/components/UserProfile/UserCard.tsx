import { Avatar, Box, Heading, Text, useColorModeValue } from "@chakra-ui/react"
import { useRouter } from "next/router"
import DeleteButton from "../../../../components/Buttons/DeleteButton"
import { useDeleteUserMutation, User } from "../../../../gql/graphql"

interface UserCardProps {
  user: User
  me?: User | null | undefined
}
function UserCard({ user, me }: UserCardProps) {
  const [deleteUser] = useDeleteUserMutation()
  const router = useRouter()
  console.log(user)
  return (
    <Box
      maxW={"320px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"lg"}
      p={6}
      textAlign={"center"}
      _hover={{ background: "gray.700" }}
      onClick={() => {
        router.push(`/users/${user?.id}`)
      }}
    >
      <Avatar
        size={"xl"}
        src={"/images/defaultProfile.png"}
        mb={4}
        pos={"relative"}
      />
      <Heading fontSize={"2xl"} fontFamily={"body"}>
        {user?.username}
      </Heading>
      <Text fontWeight={600} color={"gray.500"} mb={4}>
        {user?.email}
      </Text>
      <Text fontWeight={600} color={"gray.500"} mb={4}>
        Battles Winned : {user.battlesWon || 0}
      </Text>
      {user?.id && me?.id && user?.id === me?.id && (
        <DeleteButton
          modalHeader="Delete Account"
          buttonProps={{ mt: "5" }}
          modalBody="Are you sure you want to delete your account? All your battles , comments , votes etc will be deleted as well."
          mutationFunc={() => deleteUser()}
        />
      )}
    </Box>
  )
}

export default UserCard
