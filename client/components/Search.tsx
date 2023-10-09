import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { BaseSyntheticEvent } from "react"

function Search({
  onSearch,
  placeholder,
}: {
  onSearch: (searchTerm: string | null) => void
  placeholder: string
}) {
  const onSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault()
    onSearch(event?.target[0]?.value || null)
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <InputGroup size="md">
          <Input pr="4.5rem" placeholder={placeholder} />
          <InputRightElement width="4.5rem">
            <Button h="1.85rem" size="sm" type="submit">
              Search
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </>
  )
}

export default Search
