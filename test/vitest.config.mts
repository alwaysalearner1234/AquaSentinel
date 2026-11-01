// Vitest configuration - removed top-level import to allow auto-global provision
import * as fs from 'fs'
import * as path from 'path'

// Helper to read the application source
function readSource() {
  const src = fs.readFileSync(
    path.resolve('/Users/test/nilgiris-source.html'),
    'utf8'
  )
  return src
}

// Mock DOM for testing non-DOM functions
globalThis.window = globalThis
globalThis.document = {
  createElement: () => ({
    id: '',
    className: '',
    textContent: '',
    setAttribute: () => {},
    remove: () => {},
    appendChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    focus: () => {},
    blur: () => {},
    click: () => {},
    removeAttribute: () => {},
    scrollIntoView: () => {},
    datasets: {},
    style: {},
    innerHTML: '',
    textContent: '',
    // Add needed properties
    dir: 'ltr',
    lang: 'en',
    title: '',
    alt: '',
    value: '',
    checked: false,
    disabled: false,
    required: false,
    form: null,
    formAction: '',
    formMethod: '',
    formEnctype: '',
    formTarget: '',
    // needed for event dispatch
    __eventListeners: {},
    addEventListener(type, handler) {
      if (!this.__eventListeners[type]) this.__eventListeners[type] = []
      this.__eventListeners[type].push(handler)
    },
    removeEventListener(type, handler) {
      if (this.__eventListeners[type]) {
        this.__eventListeners[type] = this.__eventListeners[type].filter(
          (h) => h !== handler
        )
      }
    },
    dispatchEvent(event) {
      const handlers = this.__eventListeners[event.type] || []
      for (const h of handlers) h(event)
      return true
    },
  }),
  body: document.createElement('body'),
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  getElementsByClassName: () => [],
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
}

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}

globalThis.fetch = async (url) => {
  throw new Error(`fetch not mocked: ${url}`)
}