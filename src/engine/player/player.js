class Player {
  constructor (rules, index) {
    if (rules) {
      this.rules = rules
    }
    this.id = Math.random()
    this.index = index
  }
}

export default Player
