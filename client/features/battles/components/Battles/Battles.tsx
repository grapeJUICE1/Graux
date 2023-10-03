import { Heading, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Pagination from '../../../../components/Pagination'
import {
  Battle as BattleType,
  useGetUserBattlesLazyQuery,
} from '../../../../gql/graphql'
import BattleCard from '../BattleCard/BattleCard'

type BattlesProps = {
 userBattles?: {
  battlesWon?: boolean
  battlesCreated?: boolean
  battlesPartOf?: boolean
  userId: number
} ,
allBattles: BattleType[] | null,
pageSize:number,
initialPage: number
initialTotal:number
}
function Battles({userBattles , allBattles, pageSize , initialTotal}: BattlesProps) {
  const [battles, setBattles] = useState<{ battle: BattleType }[] |BattleType[] |null>(allBattles)
  const [total , setTotal] = useState(initialTotal||0)
  const [getUserBattles] = useGetUserBattlesLazyQuery()

  const router = useRouter();

  const handlePageClick = (data: any) => {
    let selected = data.selected + 1;

    router.push({query: { page: selected  } });
  };

  const pageCount = Math.ceil(total / pageSize);

useEffect(()=>{
    console.log(allBattles)
    if(!Number(router.query?.page))
	router.push({query: { page: 1} });
},[])

  useEffect(() => {
if(userBattles?.userId){
    getUserBattles({
      variables: {
        userId: userBattles?.userId,
        battlesCreated: userBattles?.battlesCreated ? true : false,
        battlesWon: userBattles?.battlesWon ? true : false
      },
    }).then(({ data }) => {
      setBattles((data?.getUserBattles as { battle: BattleType }[]) || null)
    })
	}
  }, [router.query?.page])



  return (
    <>
      <Heading textAlign='center' mt='5'>
        {userBattles?
	userBattles?.battlesCreated
          ? 'All Battles Created By User'
          : userBattles?.battlesWon
          ? 'All Battles Won By User'
          : 'All Battles User Is Part Of'
	  : 'All Battles'}
      </Heading>
      {(userBattles)?(
	//@ts-ignore
        battles.map(({ battle }: { battle: BattleType }) => {
          return <BattleCard key={battle?.id} battle={battle} />
        })
      ):''}

      {allBattles?(
	allBattles?.map((battle: BattleType) => {
        return <BattleCard battle={battle} key={battle.id} />
	})):{}}

      <Pagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        currentPage={Number(router.query?.page) || 1}
      />
    </>
  )
}
export default Battles
