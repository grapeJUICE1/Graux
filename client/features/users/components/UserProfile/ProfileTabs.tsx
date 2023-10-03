import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { User } from '../../../../gql/graphql'
import { BattleRequests } from '../../../battleRequests'
import { Battles } from '../../../battles'
import { Comments } from '../../../comments'

interface ProfileTabsProps {
  user: User
  me: User | null | undefined
}

function ProfileTabs({ user, me }: ProfileTabsProps) {
  const router = useRouter()
  return (
    <Tabs
      onChange={(_) => {
        router.push({query: { ...router.query ,page: 1  } });
      }}
      defaultIndex={
        router?.query?.tab
          ? router?.query?.tab === 'battlesPartOf'
            ? 1
            : router?.query?.tab === 'battlesWon'
              ? 2
              : router?.query?.tab === 'comments'
                ? 3
                : router?.query?.tab === 'battleRequests'
                  ? 4
                  : 0
          : 0
      }
      isFitted
      isLazy
      mt='10'
    >
      <TabList>
        <Tab>Battles Created</Tab>
        <Tab>Battles Part of</Tab>
        <Tab>Battles Won</Tab>
        <Tab>Comments</Tab>
        {me?.id ? <Tab>Battle Requests</Tab> : ''}
      </TabList>

      <TabPanels>
        <TabPanel>
          <Battles
            userBattles={
              { userId: +user?.id, battlesCreated: true }
            }
            pageSize={5}
            initialTotal={0}
            initialPage={1}
          />
        </TabPanel>
        <TabPanel>
          <p>
            <Battles
              userBattles={
                { userId: +user?.id, battlesPartOf: true }
              }
              pageSize={5}
              initialTotal={0}
              initialPage={1}
            />
          </p>
        </TabPanel>
        <TabPanel>
          <Battles
            userBattles={
              { userId: +user?.id, battlesWon: true }
            }
            pageSize={5}
            initialTotal={0}
            initialPage={1}
          />
        </TabPanel>
        <TabPanel>
          <Comments userId={+user?.id} />
        </TabPanel>

        {me?.id ? (
          <TabPanel>
            <BattleRequests />
          </TabPanel>
        ) : (
          ''
        )}
      </TabPanels>
    </Tabs>
  )
}

export default ProfileTabs
