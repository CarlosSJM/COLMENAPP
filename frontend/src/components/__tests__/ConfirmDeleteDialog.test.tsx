import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog'

describe('ConfirmDeleteDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Eliminar apiario',
    description: '¿Estás seguro de que deseas eliminar este apiario?',
  }

  it('renders title and description when open', () => {
    render(<ConfirmDeleteDialog {...defaultProps} />)
    expect(screen.getByText('Eliminar apiario')).toBeInTheDocument()
    expect(screen.getByText('¿Estás seguro de que deseas eliminar este apiario?')).toBeInTheDocument()
  })

  it('renders warning text when provided', () => {
    render(<ConfirmDeleteDialog {...defaultProps} warning="Se eliminarán 8 colmenas" />)
    expect(screen.getByText('Se eliminarán 8 colmenas')).toBeInTheDocument()
  })

  it('does not render warning when not provided', () => {
    render(<ConfirmDeleteDialog {...defaultProps} />)
    expect(screen.queryByText('Se eliminarán')).not.toBeInTheDocument()
  })

  it('calls onConfirm when Eliminar button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDeleteDialog {...defaultProps} onConfirm={onConfirm} />)

    await userEvent.click(screen.getByText('Eliminar'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Cancelar button is clicked', async () => {
    const onClose = vi.fn()
    render(<ConfirmDeleteDialog {...defaultProps} onClose={onClose} />)

    await userEvent.click(screen.getByText('Cancelar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isLoading is true', () => {
    render(<ConfirmDeleteDialog {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Eliminando...')).toBeInTheDocument()
  })

  it('disables buttons when isLoading is true', () => {
    render(<ConfirmDeleteDialog {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Cancelar')).toBeDisabled()
    expect(screen.getByText('Eliminando...')).toBeDisabled()
  })

  it('does not render content when isOpen is false', () => {
    render(<ConfirmDeleteDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Eliminar apiario')).not.toBeInTheDocument()
  })
})
