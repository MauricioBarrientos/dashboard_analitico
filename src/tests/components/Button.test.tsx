import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../atoms/Button';

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('applies primary variant by default', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toHaveClass('bg-blue-600');
  });

  test('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    const button = screen.getByRole('button', { name: /test/i });
    
    expect(button).toHaveClass('bg-blue-600');
    
    rerender(<Button variant="secondary">Test</Button>);
    expect(button).toHaveClass('bg-gray-200');
    
    rerender(<Button variant="outline">Test</Button>);
    expect(button).toHaveClass('border');
    
    rerender(<Button variant="ghost">Test</Button>);
    expect(button).not.toHaveClass('bg-blue-600', 'bg-gray-200', 'border');
  });

  test('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Test</Button>);
    const button = screen.getByRole('button', { name: /test/i });
    
    expect(button).toHaveClass('text-xs');
    
    rerender(<Button size="md">Test</Button>);
    expect(button).toHaveClass('text-sm');
    
    rerender(<Button size="lg">Test</Button>);
    expect(button).toHaveClass('text-base');
  });

  test('shows loading state with spinner', () => {
    render(<Button isLoading={true}>Submit</Button>);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument(); // The spinner has aria-busy
  });

  test('is disabled when isLoading is true', () => {
    render(<Button isLoading={true}>Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    
    expect(button).toBeDisabled();
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    
    expect(button).toBeDisabled();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button', { name: /test/i });
    
    expect(button).toHaveClass('custom-class');
  });
});