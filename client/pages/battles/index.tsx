import { gql } from '@apollo/client'
import client from '../../apollo-client'
import { Battle as BattleType } from '../../gql/graphql'
import Battle from '../../components/Battle/Battle'

export default function BattlesPage({ battles }: any) {
  return (
    <>
      {battles.map((battle: BattleType) => {
        return <Battle battle={battle} />
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
  console.log(data.getBattles)
  return {
    props: {
      battles: data.getBattles,
    },
  }
}
