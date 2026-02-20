import find from 'lodash/find.js'
import filter from 'lodash/filter.js'
import checkConditions from '../../utils/check-conditions.js'
import { registry } from '../../registry.js'
import BankSlot from './bank-slot.js'

class Bank {
  constructor (entityRules) {
    this.currentEntityId = 0
    this.tracker = {}
    this.slots = entityRules.map(rule => new BankSlot(rule, this))
  }

  createEntity (definition = {}, options) {
    const entity = new (registry[definition.type || 'Entity'])(
      {
        bank: this,
        fromBank: true,
        ...options
      },
      definition,
      this.currentEntityId++
    )
    this.track(entity)
    return entity
  }

  track (entity) {
    this.tracker[entity.entityId] = entity
  }
 
  locate (entityId) {
    return this.tracker[entityId]
  }

  findAll (bgioArguments, rule, context) {
    if (!rule.conditions) {
      throw new Error (`Cannot find entity with no conditions. Rule: ${JSON.stringify(rule)}`)
    }
    return filter(
      Object.values(this.tracker),
      entity => checkConditions(
        bgioArguments,
        rule,
        { target: entity },
        context
      ).conditionsAreMet
    )
  }

  findOne (bgioArguments, rule, context) {
    return this.findAll(bgioArguments, rule, context)[0]
  }

  find (bgioArguments, rule, context) {
    return rule.matchMultiple
      ? this.findAll(bgioArguments, rule, context)
      : this.findOne(bgioArguments, rule, context)
  }

  findParent (entity) {
    return find(this.tracker, ent =>
      ent.entities?.includes(entity)
        || ent.spaces?.includes(entity)
    )
  }
 
  getOne (bgioArguments, rule, context) {
    const slot = this.getSlot(bgioArguments, rule, context)
    if (!slot) {
      console.error(`No matching slot for ${JSON.stringify(rule)}`)
    }
    return slot.getOne(bgioArguments, { state: rule.state }, context)
  }

  getMultiple (bgioArguments, rule, count, context) {
    const slots = this.getSlots(bgioArguments, rule, context)
    if (!slots.length) {
      console.error(`No matching slots for ${JSON.stringify(rule)}`)
    }
    return slots.reduce((acc, slot) => [
      ...acc,
      ...slot.getMultiple(bgioArguments, count, { state: rule.state })
    ], [])
  }

  getSlot (bgioArguments, rule, context) {
    return this.slots.find(slot => checkConditions(
        bgioArguments,
        rule,
        { target: slot },
        context
      ).conditionsAreMet
    )
  }

  getSlots (bgioArguments, rule, context) {
    return this.slots.filter(slot => checkConditions(
        bgioArguments,
        rule,
        { target: slot },
        context
      ).conditionsAreMet
    )
  }

  returnToBank (bgioArguments, entity) {
    this.findParent(entity).remove(entity)
    this.getSlot(bgioArguments, entity.rule).returnToBank(entity)
    delete this.tracker[entity.entityId]
  }
}

export default Bank
