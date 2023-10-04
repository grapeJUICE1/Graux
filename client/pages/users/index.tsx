import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { User as UserType } from "../../gql/graphql"
import { Heading } from "@chakra-ui/react"
import { BattleCard, Battles } from "../../features/battles"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Pagination from "../../components/Pagination"
import { GetServerSidePropsContext } from "next"
import { Users } from "../../features/users"

const pageSize = 5

export default function AllUsersPage({
  initialUsers,
  total,
}: {
  initialUsers: UserType[]
  total: number
}) {
  const router = useRouter()
  return (
    <>
      <Users
        initialUsers={initialUsers}
        initialTotal={total}
        pageSize={pageSize}
      />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const skip =
    (query.page ? (Number(query.page) ? Number(query.page) - 1 : 0) : 0 || 0) *
    pageSize

  const take = pageSize
  const search = query?.search || null
  const { data } = await client.query({
    query: gql`
      query GetUsers{
        getUsers(take: ${take}, skip: ${skip}, orderBy: ${null}, search: ${search}) {
          users {
            id
            email
            username
            createdAt
          }
          total
        }
      }
    `,
    fetchPolicy: "network-only",
  })
  return {
    props: {
      initialUsers: data?.getUsers?.users || null,
      total: data?.getUsers?.total,
    },
  }
}
