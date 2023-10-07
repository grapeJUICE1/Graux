import { Select } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { BaseSyntheticEvent, useState } from "react"

function SortButton({
  sortOptions,
  onOrderByChange,
}: {
  sortOptions: {}
  onOrderByChange: (orderBy: string) => void
}) {
  const router = useRouter()
  const [value, setValue] = useState("createdAt")
  const handleChange = (e: BaseSyntheticEvent) => {
    console.log(e?.target?.value)
    setValue(e?.target?.value)
    onOrderByChange(e?.target?.value)
    router.push({ query: { ...router.query, page: 1, sort: e?.target?.value } })
  }
  return (
    <>
      <Select onChange={handleChange} value={value}>
        {Object.entries(sortOptions)?.map(([key, value], i) => (
          <option key={i} value={key}>
            {String(value)}
          </option>
        ))}
      </Select>
    </>
  )
}

export default SortButton
