import { gql } from "@apollo/client"
import { GetServerSidePropsContext } from "next"
import client from "../../../apollo-client"
import { IndividualBattle } from "../../../features/battles"
import { Battle as BattleType } from "../../../gql/graphql"

export async function getServerSideProps({
  params,
  req,
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
    userLikeDislike
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
      userVote
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

      fetchPolicy: "network-only",
      context: {
        headers: {
          authorization: req?.cookies?.jid ? req?.cookies?.jid : undefined,
        },
      },
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
  return <IndividualBattle initialBattle={battle} />
}

export default BattlePage
