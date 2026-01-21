import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../atoms/Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Nombre" />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  test('renders input without label when not provided', () => {
    render(<Input placeholder="Enter name" />);
    expect(screen.queryByText('Nombre')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  test('applies error styling when error is provided', () => {
    render(<Input error="Campo requerido" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('border-red-300');
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  test('does not show error message when no error is provided', () => {
    render(<Input label="Nombre" />);
    expect(screen.queryByText(/campo requerido/i)).not.toBeInTheDocument();
  });

  test('accepts and displays value', () => {
    render(<Input value="John Doe" />);
    const input = screen.getByDisplayValue('John Doe');
    
    expect(input).toBeInTheDocument();
  });

  test('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'New value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('custom-class');
  });

  test('renders with additional attributes', () => {
    render(<Input type="email" placeholder="Email" />);
    const input = screen.getByPlaceholderText('Email');
    
    expect(input).toHaveAttribute('type', 'email');
  });
});