import { describe, it, expect } from 'vitest'
import type { Hive, Inspection, Production, Task } from '../../types'
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

// Helper: partial objects cast to full types (tests only need adapter-relevant fields)
const hive = (partial: Partial<Hive>) => partial as Hive
const inspection = (partial: Partial<Inspection>) => partial as Inspection
const production = (partial: Partial<Production>) => partial as Production
const task = (partial: Partial<Task>) => partial as Task

describe('adaptHive', () => {
  it('extracts apiary_name from nested apiary object', () => {
    const result = adaptHive(hive({ id: '1', name: 'Colmena 1', apiary: { name: 'Apiario Norte' } }))
    expect(result.apiary_name).toBe('Apiario Norte')
    expect(result.id).toBe('1')
    expect(result.name).toBe('Colmena 1')
  })

  it('returns empty string when apiary is null', () => {
    const result = adaptHive(hive({ id: '1', name: 'Colmena 1', apiary: null as unknown as Hive['apiary'] }))
    expect(result.apiary_name).toBe('')
  })

  it('returns empty string when apiary is undefined', () => {
    const result = adaptHive(hive({ id: '1', name: 'Colmena 1' }))
    expect(result.apiary_name).toBe('')
  })

  it('preserves all original fields', () => {
    const result = adaptHive(hive({ id: '1', code: 'H001', status: 'active', apiary: { name: 'Test' } }))
    expect(result.id).toBe('1')
    expect(result.code).toBe('H001')
    expect(result.status).toBe('active')
  })
})

describe('adaptHives', () => {
  it('adapts an array of hives', () => {
    const hives = [
      hive({ id: '1', apiary: { name: 'A' } }),
      hive({ id: '2', apiary: { name: 'B' } }),
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
    const result = adaptInspection(inspection({ id: '1', hive: { name: 'Colmena 1' }, date: '2026-03-15' }))
    expect(result.hive_name).toBe('Colmena 1')
  })

  it('returns empty string when hive is null', () => {
    const result = adaptInspection(inspection({ id: '1', hive: null as unknown as Inspection['hive'] }))
    expect(result.hive_name).toBe('')
  })
})

describe('adaptInspections', () => {
  it('adapts an array of inspections', () => {
    const inspections = [
      inspection({ id: '1', hive: { name: 'H1' } }),
      inspection({ id: '2', hive: { name: 'H2' } }),
    ]
    const result = adaptInspections(inspections)
    expect(result).toHaveLength(2)
    expect(result[0].hive_name).toBe('H1')
    expect(result[1].hive_name).toBe('H2')
  })
})

describe('adaptProduction', () => {
  it('extracts hive_name from nested hive object', () => {
    const result = adaptProduction(production({ id: '1', hive: { name: 'Colmena 3' }, honey_kg: 5.2 }))
    expect(result.hive_name).toBe('Colmena 3')
    expect(result.honey_kg).toBe(5.2)
  })

  it('returns empty string when hive is null', () => {
    const result = adaptProduction(production({ id: '1', hive: null as unknown as Production['hive'] }))
    expect(result.hive_name).toBe('')
  })
})

describe('adaptProductions', () => {
  it('adapts an array of productions', () => {
    const prods = [production({ id: '1', hive: { name: 'H1' } })]
    expect(adaptProductions(prods)[0].hive_name).toBe('H1')
  })
})

describe('adaptTask', () => {
  it('extracts hive_name from nested hive object', () => {
    const result = adaptTask(task({ id: '1', title: 'Revisar', hive: { name: 'Colmena 1' } }))
    expect(result.hive_name).toBe('Colmena 1')
  })

  it('returns undefined when hive is null (general task)', () => {
    const result = adaptTask(task({ id: '1', title: 'Comprar cera', hive: null }))
    expect(result.hive_name).toBeUndefined()
  })

  it('returns undefined when hive is missing', () => {
    const result = adaptTask(task({ id: '1', title: 'Comprar cera' }))
    expect(result.hive_name).toBeUndefined()
  })
})

describe('adaptTasks', () => {
  it('adapts mixed tasks (with and without hive)', () => {
    const tasks = [
      task({ id: '1', hive: { name: 'H1' } }),
      task({ id: '2', hive: null }),
    ]
    const result = adaptTasks(tasks)
    expect(result[0].hive_name).toBe('H1')
    expect(result[1].hive_name).toBeUndefined()
  })
})
