// src/tests/contexts/ThemeContext.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

// Mock component to test the context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('Theme Context', () => {
  test('provides default theme as dark', () => {
    localStorage.clear();
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByText('dark')).toBeInTheDocument();
  });

  test('toggles theme from dark to light', () => {
    localStorage.clear();
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(getByText('dark')).toBeInTheDocument();
    
    act(() => {
      getByText('Toggle Theme').click();
    });
    
    expect(getByText('light')).toBeInTheDocument();
  });

  test('toggles theme from light to dark', () => {
    localStorage.clear();
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // First toggle to light
    act(() => {
      getByText('Toggle Theme').click();
    });
    
    expect(getByText('light')).toBeInTheDocument();
    
    // Then toggle back to dark
    act(() => {
      getByText('Toggle Theme').click();
    });
    
    expect(getByText('dark')).toBeInTheDocument();
  });

  test('persists theme in localStorage', () => {
    localStorage.clear();
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Toggle to light
    act(() => {
      getByText('Toggle Theme').click();
    });
    
    expect(localStorage.getItem('theme')).toBe('light');
    
    // Toggle back to dark
    act(() => {
      getByText('Toggle Theme').click();
    });
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});