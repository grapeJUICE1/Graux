import { gql } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import client from '../../../apollo-client'
import Battle from '../../../components/Battle/Battle'
import { Battle as BattleType } from '../../../gql/graphql'

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  if (params?.id) {
    const { data } = await client.query({
      query: gql`
query GetBattle {
  getBattle(battleId: ${params.id}, manage: false) {
    id
    uuid
    title
    status
    likeDislikeCount
    expires
    createdAt
    battleUsers {
      battleCreator
      createdAt
      id
      songArtist
      songAlbum
      isWinner
      songImage
      songLink
      songName
      user {
        id
        email
        username
      }
      voteCount
    }
    battleRequests {
      id
      validated
      user {
        id
        email
        username
        createdAt
      }
    }
  }
}
`,

      fetchPolicy: 'network-only',
    })

    return {
      props: {
        battle: data.getBattle,
      },
    }
  }
  return {
    props: {
      battle: undefined,
    },
  }
}
function BattlePage({ battle }: { battle: BattleType }) {
  return <Battle initialBattle={battle} />
}

export default BattlePage
