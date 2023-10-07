import { Select } from "@chakra-ui/react"
import { BaseSyntheticEvent, useState } from "react"

function SortButton({
  sortOptions,
  onOrderByChange,
}: {
  sortOptions: {}
  onOrderByChange: (orderBy: string) => void
}) {
  const [value, setValue] = useState("createdAt")
  const handleChange = (e: BaseSyntheticEvent) => {
    setValue(e?.target?.value)
    onOrderByChange(e?.target?.value)
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
