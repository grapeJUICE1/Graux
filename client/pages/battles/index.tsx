import { gql } from '@apollo/client'
import client from '../../apollo-client'
import { Battle as BattleType, useGetBattlesLazyQuery } from '../../gql/graphql'
import { Heading } from '@chakra-ui/react'
import { BattleCard } from '../../features/battles'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Pagination from '../../components/Pagination'
import { GetServerSidePropsContext } from 'next'

const pageSize = 5;

export default function BattlesPage(
  { initialBattles, total }: { initialBattles: BattleType[], total: number }
) {

  const [battles, setBattles] = useState(initialBattles)
  const router = useRouter();
  const [getBattles] = useGetBattlesLazyQuery();

  const handlePageClick = (data: any) => {
    let selected = data.selected + 1;

    router.push({ pathname: `/battles`, query: { page: selected } });
  };
  const pageCount = Math.ceil(total / pageSize);

  useEffect(() => {
    if (
      Number(router.query?.page)
    ) {
      console.log("akhane esechi ami", router.query?.page)
      getBattles({
        variables:
          //@ts-ignore
          { take: pageSize, skip: (router.query?.page - 1) * pageSize, orderBy: null }
      })
        .then((response) => {
          const battles = response?.data?.getBattles?.battles
          if (battles) {
            setBattles(battles as BattleType[])
          }
        })
        .catch()
    }
  }, [router.query?.page])

  return (
    <>
      <Heading textAlign='center' mt='5'>
        All Battles
      </Heading>
      {battles ? battles.map((battle: BattleType) => {
        return <BattleCard battle={battle} key={battle.id} />
      }) : ""}
      <Pagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        currentPage={Number(router.query?.page) || 1}
      />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  const skip = (query.page ?
    Number(query.page) ? Number(query.page) - 1 : 0 : 0 || 0) * pageSize;

  const take = pageSize;

  const { data } = await client.query({
    query: gql`
      query GetBattles {
        getBattles(take:${take} , skip:${skip} , orderBy:${null}) {
         battles 
          {id
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
        },
          total
        }
      }
    `,
    fetchPolicy: 'network-only',
  })

  return {
    props: {
      initialBattles: data.getBattles.battles,
      total: data.getBattles.total
    },
  }
}
