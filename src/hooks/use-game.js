import React, { useState, useEffect } from 'react'
import useForceUpdate from './use-force-update'
import Game from '../engine/game/game'

export default function useGame (gameRules) {
  const forceUpdate = useForceUpdate()
  const [ game, setGame ] = useState(() => new Game(gameRules))

  const doAction = (action) => {
    game.doAction(action)
    forceUpdate()
  }

  useEffect(() => {
    setGame(new Game(gameRules))
  }, [gameRules])

  return [game, doAction]
}
