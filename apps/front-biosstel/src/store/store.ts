/**
 * Simple store for the frontend
 * This can be replaced with any state management solution
 */

interface UserData {
  id: string;
  email: string;
  name: string;
  token?: string;
}

interface StoreState {
  user: UserData | null;
  isAuthenticated: boolean;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

// Simple global store - can be replaced with zustand, redux, etc.
class Store {
  private state: StoreState = {
    user: null,
    isAuthenticated: false,
    setUser: (user) => {
      this.state.user = user;
      this.state.isAuthenticated = !!user;
      this.listeners.forEach((listener) => listener(this.state));
    },
    logout: () => {
      this.state.user = null;
      this.state.isAuthenticated = false;
      this.listeners.forEach((listener) => listener(this.state));
    },
  };

  private listeners: ((state: StoreState) => void)[] = [];

  getState(): StoreState {
    return this.state;
  }

  subscribe(listener: (state: StoreState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const store = new Store();
export const { getState, subscribe } = store;
