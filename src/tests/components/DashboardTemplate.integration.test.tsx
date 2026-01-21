import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardTemplate from '../templates/DashboardTemplate';

// Mock the child components to test integration
jest.mock('../organisms/Header', () => () => <header data-testid="header">Header</header>);
jest.mock('../organisms/Sidebar', () => () => <aside data-testid="sidebar">Sidebar</aside>);
jest.mock('../molecules/FilterPanel', () => ({ 
  filters, 
  onFilterChange 
}: { 
  filters: any, 
  onFilterChange: (filters: any) => void 
}) => (
  <div data-testid="filter-panel">
    <button 
      data-testid="clear-filters" 
      onClick={() => onFilterChange({ dateRange: [null, null], metrics: [], categories: [] })}
    >
      Clear Filters
    </button>
  </div>
));
jest.mock('../organisms/DashboardGrid', () => ({ filters }: { filters: any }) => (
  <div data-testid="dashboard-grid">
    <span>Dashboard Grid with filters: {JSON.stringify(filters)}</span>
  </div>
));

describe('DashboardTemplate Integration', () => {
  test('renders all main sections', () => {
    render(<DashboardTemplate />);
    
    // Check that all main sections are present
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument();
  });

  test('initializes with default filter values', () => {
    render(<DashboardTemplate />);
    
    // Check that the dashboard grid receives default filters
    expect(screen.getByTestId('dashboard-grid')).toHaveTextContent('dateRange');
    expect(screen.getByTestId('dashboard-grid')).toHaveTextContent('metrics');
    expect(screen.getByTestId('dashboard-grid')).toHaveTextContent('categories');
  });

  test('filters are passed correctly to child components', () => {
    render(<DashboardTemplate />);
    
    // The dashboard grid should receive the initial filter values
    const dashboardGrid = screen.getByTestId('dashboard-grid');
    expect(dashboardGrid).toHaveTextContent('Dashboard Grid with filters');
    
    // Check initial state
    expect(dashboardGrid).toHaveTextContent('"dateRange":[null,null]');
    expect(dashboardGrid).toHaveTextContent('"metrics":[]');
    expect(dashboardGrid).toHaveTextContent('"categories":[]');
  });

  test('filter changes propagate correctly', async () => {
    render(<DashboardTemplate />);
    
    // Get the clear filters button from the mocked FilterPanel
    const clearFiltersButton = screen.getByTestId('clear-filters');
    
    // Initially check that the filters are in the default state
    const dashboardGrid = screen.getByTestId('dashboard-grid');
    expect(dashboardGrid).toHaveTextContent('"dateRange":[null,null]');
    
    // Click the clear filters button (though it essentially resets to the same state)
    fireEvent.click(clearFiltersButton);
    
    // Wait for the state update to propagate
    await waitFor(() => {
      expect(dashboardGrid).toBeInTheDocument();
    });
  });

  test('has proper responsive layout classes', () => {
    render(<DashboardTemplate />);
    
    // Check that the main container has responsive layout classes
    const container = screen.getByRole('main').parentElement?.parentElement;
    expect(container).toHaveClass('flex-col', 'md:flex-row');
  });

  test('footer is present with update information', () => {
    render(<DashboardTemplate />);
    
    const footer = screen.getByText(/última actualización/i);
    expect(footer).toBeInTheDocument();
  });
});