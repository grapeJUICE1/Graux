import { Avatar, Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import DeleteButton from '../../../../components/DeleteButton/DeleteButton'
import { useDeleteUserMutation, User } from '../../../../gql/graphql'

interface UserCardProps {
  user: User
  me: User | null | undefined
}
function UserCard({ user, me }: UserCardProps) {
  const [deleteUser] = useDeleteUserMutation()
  return (
    <Box
      maxW={'320px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow={'2xl'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}
    >
      <Avatar
        size={'xl'}
        src={'/images/defaultProfile.png'}
        mb={4}
        pos={'relative'}
      />
      <Heading fontSize={'2xl'} fontFamily={'body'}>
        {user?.username}
      </Heading>
      <Text fontWeight={600} color={'gray.500'} mb={4}>
        {user?.email}
      </Text>
      <Text
        textAlign={'center'}
        color={useColorModeValue('gray.700', 'gray.400')}
        px={3}
      >
        TODO
      </Text>
      {user?.id && me?.id && user?.id === me?.id && (
        <DeleteButton
          modalHeader='Delete Account'
          buttonProps={{ mt: '5' }}
          modalBody='Are you sure you want to delete your account? All your battles , comments , votes etc will be deleted as well.'
          mutationFunc={() => deleteUser()}
        />
      )}
    </Box>
  )
}

export default UserCard
