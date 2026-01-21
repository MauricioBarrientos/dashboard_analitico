// src/tests/atoms/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/atoms/Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });

  test('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-xs');

    rerender(<Button size="lg">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-base');
  });

  test('shows loading state', () => {
    render(<Button isLoading={true}>Test</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Test</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});