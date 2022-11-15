import { gql } from '@apollo/client'
import client from '../apollo-client'

export default function Home({ battles }: any) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return (
    <>
      {battles.map((battle: any) => {
        return (
          <div key={battle.id} style={{ padding: 20 }}>
            <p>title: {battle.title}</p>
            <p> status: {battle.status} </p>
            <p>likes: {battle.likeDislikeCount}</p>
            <p>
              {' '}
              expires at:{' '}
              {battle.expires
                ? new Date(+battle.expires).toLocaleString(undefined, options)
                : 'expiry date not set yet'}
            </p>
            <br />
          </div>
        )
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
          }
        }
      }
    `,
  })

  console.log(data)
  return {
    props: {
      battles: data.getBattles,
    },
  }
}
