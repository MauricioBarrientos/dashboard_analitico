// src/tests/setupTests.ts
import '@testing-library/jest-dom';
import '@testing-library/react';
import { vi } from 'vitest';

// Mock para localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock para matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para WebSocket
global.WebSocket = vi.fn().mockImplementation(() => {
  return {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    close: vi.fn(),
    send: vi.fn(),
    onopen: vi.fn(),
    onmessage: vi.fn(),
    onerror: vi.fn(),
    onclose: vi.fn(),
    readyState: 1,
  };
});