// src/tests/molecules/FilterPanel.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel from '../../components/molecules/FilterPanel';

describe('FilterPanel Component', () => {
  const mockFilters = {
    dateRange: [null, null] as [Date | null, Date | null],
    metrics: [] as string[],
    categories: [] as string[],
  };

  const mockOnFilterChange = vi.fn();

  test('renders filter panel with title', () => {
    render(<FilterPanel filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByText('Filtros de Datos')).toBeInTheDocument();
  });

  test('renders date range inputs', () => {
    render(<FilterPanel filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const dateInputs = screen.getAllByRole('textbox');
    expect(dateInputs).toHaveLength(2); // start and end date inputs
  });

  test('renders metric and category select elements', () => {
    render(<FilterPanel filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const selects = screen.getAllByRole('listbox');
    expect(selects).toHaveLength(2); // metrics and categories
  });

  test('triggers onFilterChange when date range changes', async () => {
    render(<FilterPanel filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const dateInputs = screen.getAllByRole('textbox');
    fireEvent.change(dateInputs[0], { target: { value: '2023-01-01' } });
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...mockFilters,
        dateRange: [new Date('2023-01-01'), null]
      });
    });
  });

  test('triggers onFilterChange when metrics are selected', async () => {
    render(<FilterPanel filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const metricsSelect = screen.getAllByRole('listbox')[0];
    fireEvent.change(metricsSelect, { target: { value: ['revenue'] } });
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...mockFilters,
        metrics: ['revenue']
      });
    });
  });
});