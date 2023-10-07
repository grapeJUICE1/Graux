import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { User as UserType } from "../../gql/graphql"
import { GetServerSidePropsContext } from "next"
import { Users } from "../../features/users"

const pageSize = 10

export default function AllUsersPage({
  initialUsers,
  total,
}: {
  initialUsers: UserType[]
  total: number
}) {
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
  if (!Number(query?.page)) {
    query.page = "1"
  }
  const skip = (Number(query?.page) - 1) * pageSize
  const take = pageSize

  if (!query?.sort) {
    query.sort = "createdAt"
  }
  const orderBy = query.sort

  const search = query?.search || null

  const { data } = await client.query({
    query: gql`
      query GetUsers(
        $take: Int
        $skip: Int
        $orderBy: String
        $search: String
        $avoidClientSideError: Boolean
      ) {
        getUsers(
          take: $take
          skip: $skip
          orderBy: $orderBy
          search: $search
          avoidClientSideError: $avoidClientSideError
        ) {
          total
          users {
            id
            email
            username
            createdAt
          }
        }
      }
    `,
    fetchPolicy: "network-only",
    variables: {
      take: take,
      skip: skip,
      orderBy: orderBy,
      search: search ? "a" + search : null,
      avoidClientSideError: true,
    },
  })

  return {
    props: {
      initialUsers: data?.getUsers?.users || null,
      total: data?.getUsers?.total,
    },
  }
}
