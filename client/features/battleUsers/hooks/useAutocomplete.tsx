import { useCallback, useEffect, useState } from 'react'

function useAutocomplete<OptionsType, OptionType>(
  query: (setOptions: any) => void,
  inputValue: string
) {
  const [options, setOptions] = useState<OptionsType[] | null>(null)
  const [option, setOption] = useState<OptionType | null>(null)
  const [optionChoosed, setOptionChoosed] = useState<boolean>(false)

  useEffect(() => {
    if (!optionChoosed && inputValue.length > 0) {
      query(setOptions)
    } else if (optionChoosed) {
      setOptionChoosed(false)
    }
  }, [inputValue])

  const chooseOption = useCallback((option: any) => {
    setOptions([])
    setOption(option)
    setOptionChoosed(true)
  }, [])

  return { options, option, chooseOption }
}
export default useAutocomplete
