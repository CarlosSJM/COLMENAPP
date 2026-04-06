import { describe, it, expect } from 'vitest'
import {
  adaptHive,
  adaptHives,
  adaptInspection,
  adaptInspections,
  adaptProduction,
  adaptProductions,
  adaptTask,
  adaptTasks,
} from '../adapters'

describe('adaptHive', () => {
  it('extracts apiary_name from nested apiary object', () => {
    const hive = { id: '1', name: 'Colmena 1', apiary: { name: 'Apiario Norte' } }
    const result = adaptHive(hive)
    expect(result.apiary_name).toBe('Apiario Norte')
    expect(result.id).toBe('1')
    expect(result.name).toBe('Colmena 1')
  })

  it('returns empty string when apiary is null', () => {
    const hive = { id: '1', name: 'Colmena 1', apiary: null }
    const result = adaptHive(hive)
    expect(result.apiary_name).toBe('')
  })

  it('returns empty string when apiary is undefined', () => {
    const hive = { id: '1', name: 'Colmena 1' }
    const result = adaptHive(hive)
    expect(result.apiary_name).toBe('')
  })

  it('preserves all original fields', () => {
    const hive = { id: '1', code: 'H001', status: 'active', apiary: { name: 'Test' } }
    const result = adaptHive(hive)
    expect(result.id).toBe('1')
    expect(result.code).toBe('H001')
    expect(result.status).toBe('active')
  })
})

describe('adaptHives', () => {
  it('adapts an array of hives', () => {
    const hives = [
      { id: '1', apiary: { name: 'A' } },
      { id: '2', apiary: { name: 'B' } },
    ]
    const result = adaptHives(hives)
    expect(result).toHaveLength(2)
    expect(result[0].apiary_name).toBe('A')
    expect(result[1].apiary_name).toBe('B')
  })

  it('handles empty array', () => {
    expect(adaptHives([])).toEqual([])
  })
})

describe('adaptInspection', () => {
  it('extracts hive_name from nested hive object', () => {
    const inspection = { id: '1', hive: { name: 'Colmena 1' }, date: '2026-03-15' }
    const result = adaptInspection(inspection)
    expect(result.hive_name).toBe('Colmena 1')
  })

  it('returns empty string when hive is null', () => {
    const inspection = { id: '1', hive: null }
    const result = adaptInspection(inspection)
    expect(result.hive_name).toBe('')
  })
})

describe('adaptInspections', () => {
  it('adapts an array of inspections', () => {
    const inspections = [
      { id: '1', hive: { name: 'H1' } },
      { id: '2', hive: { name: 'H2' } },
    ]
    const result = adaptInspections(inspections)
    expect(result).toHaveLength(2)
    expect(result[0].hive_name).toBe('H1')
    expect(result[1].hive_name).toBe('H2')
  })
})

describe('adaptProduction', () => {
  it('extracts hive_name from nested hive object', () => {
    const production = { id: '1', hive: { name: 'Colmena 3' }, honey_kg: 5.2 }
    const result = adaptProduction(production)
    expect(result.hive_name).toBe('Colmena 3')
    expect(result.honey_kg).toBe(5.2)
  })

  it('returns empty string when hive is null', () => {
    const production = { id: '1', hive: null }
    const result = adaptProduction(production)
    expect(result.hive_name).toBe('')
  })
})

describe('adaptProductions', () => {
  it('adapts an array of productions', () => {
    const prods = [{ id: '1', hive: { name: 'H1' } }]
    expect(adaptProductions(prods)[0].hive_name).toBe('H1')
  })
})

describe('adaptTask', () => {
  it('extracts hive_name from nested hive object', () => {
    const task = { id: '1', title: 'Revisar', hive: { name: 'Colmena 1' } }
    const result = adaptTask(task)
    expect(result.hive_name).toBe('Colmena 1')
  })

  it('returns undefined when hive is null (general task)', () => {
    const task = { id: '1', title: 'Comprar cera', hive: null }
    const result = adaptTask(task)
    expect(result.hive_name).toBeUndefined()
  })

  it('returns undefined when hive is missing', () => {
    const task = { id: '1', title: 'Comprar cera' }
    const result = adaptTask(task)
    expect(result.hive_name).toBeUndefined()
  })
})

describe('adaptTasks', () => {
  it('adapts mixed tasks (with and without hive)', () => {
    const tasks = [
      { id: '1', hive: { name: 'H1' } },
      { id: '2', hive: null },
    ]
    const result = adaptTasks(tasks)
    expect(result[0].hive_name).toBe('H1')
    expect(result[1].hive_name).toBeUndefined()
  })
})
