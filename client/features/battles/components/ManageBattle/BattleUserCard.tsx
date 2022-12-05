import { Box, Text } from '@chakra-ui/react'
import DeleteButton from '../../../../components/DeleteButton/DeleteButton'
import {
  BattleUser,
  User,
  useRemoveBattleUserMutation,
} from '../../../../gql/graphql'

interface BattleUserCardProps {
  battleUser: BattleUser
  battleCreator: BattleUser
}
function BattleUserCard({ battleUser, battleCreator }: BattleUserCardProps) {
  const [removeBattleUser] = useRemoveBattleUserMutation()

  let battleUserPropertiesToDisplay = {
    username: 'Username',
    email: 'Email',
  }

  let battleUserSongPropertiesToDisplay = {
    songName: 'Song Name',
    songArtist: 'Song Artist',
    songAlbum: 'Song Album',
    songLink: 'Song Link',
    songImage: 'Song Image',
  }

  return (
    <Box
      key={battleUser.id}
      bgColor='gray.700'
      py='10'
      pl='10'
      width='100%'
      my='5'
    >
      {Object.keys(battleUserPropertiesToDisplay).map((property) => {
        return (
          //@ts-ignore
          <Box fontSize='1.2rem'>
            <Text display='inline' fontWeight='medium'>
              {
                battleUserPropertiesToDisplay[
                  property as keyof typeof battleUserPropertiesToDisplay
                ]
              }
              :{' '}
            </Text>
            {battleUser?.user && battleUser.user[property as keyof User]}
          </Box>
        )
      })}
      {battleUser?.songName ? (
        <Box border='1px' borderColor='cyan.500' width='90%' mt='5' p='5'>
          {Object.keys(battleUserSongPropertiesToDisplay).map((property) => {
            return (
              //@ts-ignore
              <Box fontSize='1rem'>
                <Text display='inline' fontWeight='medium'>
                  {
                    battleUserSongPropertiesToDisplay[
                      property as keyof typeof battleUserSongPropertiesToDisplay
                    ]
                  }
                  :{' '}
                </Text>
                {property === 'songImage' ? (
                  <img
                    style={{ width: '8rem' }}
                    alt='song image'
                    src={`${battleUser?.songImage}`}
                  />
                ) : (
                  battleUser[property as keyof BattleUser]
                )}
              </Box>
            )
          })}
        </Box>
      ) : (
        <Text>Song not chosen yet</Text>
      )}
      <br />
      {battleCreator?.user?.username !== battleUser?.user?.username && (
        <DeleteButton
          modalHeader='Remove Battle User'
          modalBody='Are you sure you want to remove this battle user?'
          mutationFunc={() =>
            removeBattleUser({
              variables: { battleUserId: +battleUser?.id },
            })
          }
        />
      )}
    </Box>
  )
}

export default BattleUserCard
