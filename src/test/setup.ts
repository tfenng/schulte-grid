import "@testing-library/jest-dom/vitest";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

Object.defineProperty(window, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
});

// Mock AudioContext for jsdom environment
class MockAudioContext {
  createOscillator() {
    return {
      connect: () => {},
      disconnect: () => {},
      type: "",
      frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      start: () => {},
      stop: () => {},
    };
  }
  createGain() {
    const gainNode = {
      connect: () => {},
      disconnect: () => {},
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
    };
    return {
      ...gainNode,
      exponentialRampToValueAtTime: gainNode.gain.exponentialRampToValueAtTime,
    };
  }
  get currentTime() {
    return 0;
  }
  close() {}
}

Object.defineProperty(window, "AudioContext", {
  value: MockAudioContext,
  configurable: true,
});