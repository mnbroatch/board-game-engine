export default class Serializable {
  constructor () {
    // arguments must be simple objects, duck type gamestate object out
    this.args = [...arguments].filter(arg => !arg || arg.status === undefined)
    this.id = `${Math.random()}`
  }

  toJSON () {
    const obj = { ...this, constructorName: this.constructor.name }
    delete obj.game;
    return obj
  }
}
