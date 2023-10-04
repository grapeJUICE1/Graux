import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { User as UserType } from "../../gql/graphql"
import { Heading } from "@chakra-ui/react"
import { BattleCard, Battles } from "../../features/battles"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Pagination from "../../components/Pagination"
import { GetServerSidePropsContext } from "next"

const pageSize = 5

export default function AllUsersPage({
  initialUsers, //total,
}: {
  initialUsers: UserType[]
  //total: number
}) {
  const router = useRouter()
  return (
    <>
      {/*<Battles
        allBattles={initialBattles || null}
        pageSize={pageSize}
        initialPage={Number(router.query?.page) || 1}
        initialTotal={total}
      /></>*/}

      {initialUsers?.map((user) => <p>{user?.username}</p>)}
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const skip =
    (query.page ? (Number(query.page) ? Number(query.page) - 1 : 0) : 0 || 0) *
    pageSize

  const take = pageSize

  const { data } = await client.query({
    query: gql`
      query GetUsers {
        getUsers {
          id
          email
          username
          createdAt
        }
      }
    `,
    fetchPolicy: "network-only",
  })
  console.log(data.getUsers)
  return {
    props: {
      initialUsers: data.getUsers || null,
      //total: data.getBattles.total,
    },
  }
}
