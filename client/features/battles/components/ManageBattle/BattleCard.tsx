import { Box, Center, Divider, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import DeleteButton from '../../../../components/DeleteButton/DeleteButton'
import EditTitleButton from '../../../../components/EditTitleButton'
import { Battle, useDeleteBattleMutation } from '../../../../gql/graphql'
import formatDate from '../../../../utils/formatDate'
import StartBattleButton from './StartBattleButton'

interface BattleCardProps {
  battle: Battle
}
function BattleCard({ battle }: BattleCardProps) {
  const [deleteBattle] = useDeleteBattleMutation()

  const isBattleStartable = useMemo(() => {
    if (battle?.status !== 'creation') return false
    let battleHasEnoughUsers = battle?.battleUsers?.length === 2
    let battleUsersHaveNotChosenSong = battle?.battleUsers?.find(
      (battleUser) => {
        return !battleUser?.songName
      }
    )

    return battleHasEnoughUsers && !battleUsersHaveNotChosenSong
  }, [battle])

  let battlePropertiesToDisplay = {
    title: 'Title',
    createdAt: 'Battle Created At',
    expires: 'Battle Ends At',
    status: 'Battle Status',
  }
  return (
    <Box width='70%' mx='auto' bgColor='gray.700' py='10'>
      {Object.keys(battlePropertiesToDisplay).map((property: string) => {
        return (
          <>
            {/*@ts-ignore*/}
            <Box
              style={{ wordWrap: 'break-word' }}
              fontSize='xl'
              textAlign='center'
              py='2'
            >
              <Text display='inline' fontWeight='medium'>
                {
                  battlePropertiesToDisplay[
                    property as keyof typeof battlePropertiesToDisplay
                  ]
                }
                :{' '}
              </Text>
              {battle[property as keyof Battle] &&
              (property === 'createdAt' || property === 'expires')
                ? formatDate(+battle[property as keyof Battle]!)
                : battle[property as keyof Battle]}
            </Box>
            <Divider />
          </>
        )
      })}
      <Center>
        <Box>
          {battle?.id && (
            <EditTitleButton
              buttonProps={{ colorScheme: 'cyan', mt: '5', mx: '3' }}
              battleId={+battle?.id}
            />
          )}
          {battle && isBattleStartable && (
            <StartBattleButton battleId={+battle?.id} />
          )}
          {battle && (
            <DeleteButton
              modalHeader='Delete Battle'
              modalBody='Are you sure you want to remove this battle??'
              mutationFunc={() =>
                deleteBattle({
                  variables: { battleId: +battle?.id },
                })
              }
              buttonProps={{ mt: '5', mx: '3' }}
            />
          )}
        </Box>
      </Center>
    </Box>
  )
}

export default BattleCard
