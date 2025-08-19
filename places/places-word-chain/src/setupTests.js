// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    // We don't need to do anything here for the tests
  }
  unobserve(target) {
    // We don't need to do anything here for the tests
  }
  disconnect() {
    // We don't need to do anything here for the tests
  }
};