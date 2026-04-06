import { describe, it, expect } from 'vitest'
import {
  hiveStatusLabels,
  queenOriginLabels,
  broodPatternLabels,
  temperamentLabels,
  activityLevelLabels,
  healthStatusLabels,
  priorityLabels,
  hiveStatusColors,
  healthStatusColors,
  priorityColors,
} from '../enums'

describe('enums - label mappings', () => {
  it('maps all hive statuses to Spanish labels', () => {
    expect(hiveStatusLabels['active']).toBe('Activa')
    expect(hiveStatusLabels['inactive']).toBe('Inactiva')
    expect(hiveStatusLabels['quarantine']).toBe('Cuarentena')
    expect(hiveStatusLabels['lost']).toBe('Perdida')
  })

  it('maps all queen origins to Spanish labels', () => {
    expect(queenOriginLabels['purchased']).toBe('Comprada')
    expect(queenOriginLabels['raised']).toBe('Criada')
    expect(queenOriginLabels['swarm']).toBe('Enjambre')
    expect(queenOriginLabels['unknown']).toBe('Desconocida')
  })

  it('maps all brood patterns to Spanish labels', () => {
    expect(broodPatternLabels['excellent']).toBe('Excelente')
    expect(broodPatternLabels['good']).toBe('Bueno')
    expect(broodPatternLabels['fair']).toBe('Regular')
    expect(broodPatternLabels['poor']).toBe('Pobre')
  })

  it('maps all temperaments to Spanish labels', () => {
    expect(temperamentLabels['calm']).toBe('Calmada')
    expect(temperamentLabels['normal']).toBe('Normal')
    expect(temperamentLabels['aggressive']).toBe('Agresiva')
  })

  it('maps all activity levels to Spanish labels', () => {
    expect(activityLevelLabels['low']).toBe('Baja')
    expect(activityLevelLabels['medium']).toBe('Media')
    expect(activityLevelLabels['high']).toBe('Alta')
  })

  it('maps all health statuses to Spanish labels', () => {
    expect(healthStatusLabels['healthy']).toBe('Saludable')
    expect(healthStatusLabels['weak']).toBe('Débil')
    expect(healthStatusLabels['sick']).toBe('Enferma')
    expect(healthStatusLabels['critical']).toBe('Crítica')
  })

  it('maps all priorities to Spanish labels', () => {
    expect(priorityLabels['low']).toBe('Baja')
    expect(priorityLabels['medium']).toBe('Media')
    expect(priorityLabels['high']).toBe('Alta')
  })

  it('returns undefined for unknown enum values', () => {
    expect(hiveStatusLabels['nonexistent']).toBeUndefined()
    expect(priorityLabels['urgent']).toBeUndefined()
  })
})

describe('enums - color mappings', () => {
  it('provides CSS classes for all hive statuses', () => {
    expect(hiveStatusColors['active']).toContain('bg-green')
    expect(hiveStatusColors['inactive']).toContain('bg-gray')
    expect(hiveStatusColors['quarantine']).toContain('bg-orange')
    expect(hiveStatusColors['lost']).toContain('bg-red')
  })

  it('provides CSS classes for all health statuses', () => {
    expect(healthStatusColors['healthy']).toContain('bg-green')
    expect(healthStatusColors['weak']).toContain('bg-yellow')
    expect(healthStatusColors['sick']).toContain('bg-orange')
    expect(healthStatusColors['critical']).toContain('bg-red')
  })

  it('provides CSS classes for all priorities', () => {
    expect(priorityColors['low']).toContain('bg-green')
    expect(priorityColors['medium']).toContain('bg-yellow')
    expect(priorityColors['high']).toContain('bg-red')
  })

  it('colors follow severity pattern (green=ok, red=critical)', () => {
    // Green for healthy/ok states
    expect(hiveStatusColors['active']).toContain('green')
    expect(healthStatusColors['healthy']).toContain('green')
    expect(priorityColors['low']).toContain('green')

    // Red for critical/urgent states
    expect(hiveStatusColors['lost']).toContain('red')
    expect(healthStatusColors['critical']).toContain('red')
    expect(priorityColors['high']).toContain('red')
  })
})
