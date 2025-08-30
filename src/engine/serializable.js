export default class Serializable {
  constructor () {
    // arguments must be simple objects
    this.args = JSON.parse(JSON.stringify([...arguments]))
  }

  toJSON () {
    return { ...this, constructorName: this.constructor.name }
  }
}
