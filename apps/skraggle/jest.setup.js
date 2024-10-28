import "jest-canvas-mock"
import "cross-fetch/polyfill"

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
