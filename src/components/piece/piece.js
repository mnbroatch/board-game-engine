import React from 'react'
import Blah from './blah-piece'

export default function Piece (props) {
  if (true) {
    return (
      <Blah
        {...props} 
      />
    )
  } else {
    return null
  }
}
