class Player {
  constructor (rules, index, rotation) {
    if (rules) {
      this.rules = rules
    }
    this.id = Math.random()
    this.index = index
    this.rotation = rotation
  }
}

export default Player
