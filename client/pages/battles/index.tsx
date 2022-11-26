import { gql } from '@apollo/client'
import client from '../../apollo-client'
import { Battle as BattleType } from '../../gql/graphql'
import BattleCard from '../../components/Battle/BattleCard'

export default function BattlesPage({ battles }: { battles: BattleType[] }) {
  return (
    <>
      {battles.map((battle: BattleType) => {
        return <BattleCard battle={battle} />
      })}
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query GetBattles {
        getBattles {
          id
          uuid
          title
          status
          likeDislikeCount
          expires
          createdAt
          battleUsers {
            user {
              id
              email
              createdAt
              username
            }
            songName
            songArtist
            songAlbum
            songImage
            songLink
            battleCreator
            isWinner
          }
        }
      }
    `,
    fetchPolicy: 'network-only',
  })
  return {
    props: {
      battles: data.getBattles,
    },
  }
}
