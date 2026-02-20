import resolveProperties from '../../utils/resolve-properties.js'

// lazily create entities as needed, and also function as an index of entities created
class BankSlot {
  constructor (rule, bank) {
    this.bank = bank
    this.rule = rule
    this.pool = []
    this.remaining = +rule.count || 1
  }

  getOne (bgioArguments, options, context) {
    return this.getMultiple(bgioArguments, 1, options, context)[0]
  }

  getMultiple (bgioArguments, count = Infinity, options = {}, context) {
    const toReturn = []
    
    if (this.remaining === Infinity && count === Infinity) {
      throw new Error(`Cannot get infinite pieces from slot with infinite remaining: ${this.rule.name}`)
    }
    
    if (count !== Infinity && count > this.remaining) {
      throw new Error(`Requested ${count} pieces but only ${this.remaining} available in slot: ${this.rule.name}`)
    }
    
    // Determine actual count to fetch
    const actualCount = count === Infinity ? this.remaining : count
    
    if (this.remaining !== Infinity) {
      this.remaining -= actualCount
    }
    
    const fromPool = Math.min(actualCount, this.pool.length)
    toReturn.push(...this.pool.splice(0, fromPool))
    
    const remainder = actualCount - fromPool
    if (remainder > 0) {
      toReturn.push(
        ...Array.from(new Array(remainder)).map(() =>
          this.bank.createEntity(this.rule)
        )
      )
    }
    
    if (options.state) {
      const newState = resolveProperties(bgioArguments, options.state, context)
      toReturn.forEach(entity => {
        entity.state = { ...entity.state, ...newState }
      })
    }
    
    return toReturn
  }

  returnToBank (entity) {
    if (entity.rule.state) {
      entity.state = entity.rule.state
    } else {
      delete entity.state
    }
    if (this.remaining !== undefined) {
      this.remaining += 1
    }
    this.pool.push(entity)
  }
}

export default BankSlot
