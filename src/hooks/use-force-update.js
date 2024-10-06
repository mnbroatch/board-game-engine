import React, { useState } from 'react'

export default function useForceUpdate () {
  const [value, setValue] = useState(false)
  return () => setValue(value => !value)
}
