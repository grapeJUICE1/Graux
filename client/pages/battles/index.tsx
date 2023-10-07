import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { Battle as BattleType, useGetBattlesLazyQuery } from "../../gql/graphql"
import { Battles } from "../../features/battles"
import { useRouter } from "next/router"
import { GetServerSidePropsContext } from "next"
import { useEffect } from "react"

const pageSize = 5

export default function BattlesPage({
  initialBattles,
  total,
}: {
  initialBattles: BattleType[]
  total: number
}) {
  const router = useRouter()
  const [getBattles] = useGetBattlesLazyQuery()

  useEffect(() => {
    getBattles({ variables: { orderBy: "createdAt" } }).then((data) => {
      console.log(data)
    })
  }, [])
  return (
    <>
      <Battles
        allBattles={initialBattles || null}
        pageSize={pageSize}
        initialPage={Number(router.query?.page) || 1}
        initialTotal={total}
      />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context

  if (!Number(query?.page)) {
    query.page = "1"
  }
  const skip = (Number(query?.page) - 1) * pageSize
  const take = pageSize

  if (!query?.sort) {
    query.sort = "createdAt"
  }
  const orderBy = query.sort
  const { data } = await client.query({
    query: gql`
      query GetBattles(
        $take: Int
        $skip: Int
        $orderBy: String #$search: String
      ) {
        getBattles(
          take: $take
          skip: $skip
          orderBy: $orderBy # search: $search
        ) {
          battles {
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
          total
        }
      }
    `,
    fetchPolicy: "network-only",
    variables: {
      take: take,
      skip: skip,
      orderBy: orderBy,
      // search: "a" + search,
    },
  })
  console.log(data.getBattles.battles)
  return {
    props: {
      initialBattles: data.getBattles.battles,
      total: data.getBattles.total,
    },
  }
}
