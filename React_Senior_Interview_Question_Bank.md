# Senior React Developer Interview Master Question Bank (3+ Years Experience)

---

## 🎯 Overview & Target Level

This guide is designed for developers with **3+ years of experience** preparing for Senior Frontend Engineer, React Architect, and Full-Stack JavaScript technical rounds.

It covers:
- **Core React Internals & Reconciliation**
- **Performance Optimization, Pure Components & Memoization**
- **API Calls, Race Conditions, Cancellation & Caching**
- **Custom Hooks Mastery**
- **Component Design Patterns & UI Architecture**
- **React 18 Concurrent & React 19 Modern Primitives**
- **Security, Error Boundaries & Accessibility (a11y)**
- **45-Minute Live Machine Coding Challenges**

---

## 📊 Summary of Challenges

| Category | Challenges | Topics Covered |
| :--- | :--- | :--- |
| **1. Closures & Internals** | Code 1.1 – 1.2 | Stale Closures, Fiber Diffing, State Batching |
| **2. Performance & Virtualization** | Code 2.1 – 2.3 | `React.memo`, Context Splitting, List Windowing |
| **3. API Calls & Caching** | Code 3.1 – 3.4 | `AbortController`, In-Memory Cache, Exponential Backoff, Smart Polling |
| **4. Essential Custom Hooks** | Code 4.1 – 4.5 | `useDebounce`, `usePrevious`, `useOnClickOutside`, `useLocalStorage`, `useMediaQuery` |
| **5. Component Patterns** | Code 5.1 – 5.3 | Compound Components, Accessible Portals/Modals, Multi-Step Wizards |
| **6. React 19 Modern Primitives** | Code 6.1 – 6.4 | `useActionState`, `useOptimistic`, `use(Promise)` + Suspense, Ref Cleanups |
| **7. Error Handling & a11y** | Code 7.1 | Class Error Boundaries, Retry Logic, Screen Reader Semantics |
| **8. Machine Coding Projects** | Code 8.1 – 8.4 | Typeahead Search, Infinite Scroll, Toast Notifications, Data Table |

---

# 🧩 Category 1: React Internals, Closures & Batching

---

### Challenge 1.1: The Stale Closure Bug in `setInterval`

#### 📌 Problem Statement:
In a counter component with `setInterval`, the counter increments to `1` and then stops updating, remaining stuck at `1` forever. Explain why this happens and provide two separate ways to fix it.

#### ❌ The Buggy Code:
```tsx
function BuggyCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Bug: `count` is captured from the initial render closure (value: 0)
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array captures stale closure

  return <div>Count: {count}</div>;
}
```

#### ✅ Solution 1: Functional State Update (Recommended)
```tsx
function FixedCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Functional updater always receives the fresh, latest state
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Safe empty dependency array

  return <div>Count: {count}</div>;
}
```

#### ✅ Solution 2: Mutable `useRef` Pattern
```tsx
function RefCounter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(countRef.current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>Count: {count}</div>;
}
```

#### 💡 Interview Follow-Up:
- **Q: Why does the functional update `setCount(prev => prev + 1)` work without adding `count` to the dependency array?**
  *A: React queues the updater function to execute against the latest pending state during the render phase, eliminating the need to read from the component render closure.*

---

### Challenge 1.2: State Batching & Execution Ordering

#### 📌 Problem Statement:
Predict the console logs and the rendered UI value when clicking the button below in React 18 / 19:

```tsx
function BatchingDemo() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount((prev) => prev + 2);
    setCount(count + 1);
    console.log('Inside click handler:', count);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

#### 🔍 Explanation & Output:
- **Console Log Output**: `Inside click handler: 0` (State updates are asynchronous; `count` in the current execution frame is still `0`).
- **Final Rendered Value**: `1`.
- **Step-by-Step Reason**:
  1. `setCount(count + 1)` queues `0 + 1 = 1`.
  2. `setCount(count + 1)` overwrites queue with `0 + 1 = 1`.
  3. `setCount(prev => prev + 2)` takes previous queued value (`1`) and updates to `1 + 2 = 3`.
  4. `setCount(count + 1)` uses the closure value `count` (`0`) and overwrites the queue with `0 + 1 = 1`!

---

# ⚡ Category 2: Performance Optimization & Pure Components

---

### Challenge 2.1: Custom Comparison in `React.memo`

#### 📌 Problem Statement:
You have a complex user list item component that receives deep nested objects. Prevent re-renders unless the `user.id` or `user.lastActiveTimestamp` changes.

#### ✅ Solution Code:
```tsx
import React from 'react';

interface UserItemProps {
  user: {
    id: string;
    name: string;
    details: {
      role: string;
      lastActiveTimestamp: number;
    };
  };
  onSelect: (id: string) => void;
}

const UserItemComponent: React.FC<UserItemProps> = ({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user.id)}>
      <h4>{user.name}</h4>
      <span>{user.details.role}</span>
    </div>
  );
};

// Custom comparison function
// Return TRUE if props are EQUAL (prevents re-render)
// Return FALSE if props are DIFFERENT (triggers re-render)
function arePropsEqual(prevProps: UserItemProps, nextProps: UserItemProps): boolean {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.details.lastActiveTimestamp === nextProps.user.details.lastActiveTimestamp &&
    prevProps.onSelect === nextProps.onSelect
  );
}

export const MemoizedUserItem = React.memo(UserItemComponent, arePropsEqual);
```

---

### Challenge 2.2: The Context Splitting Pattern

#### 📌 Problem Statement:
A global application theme & user state triggers unnecessary re-renders in components that only dispatch actions. Split the Context into **State Context** and **Dispatch Context**.

#### ✅ Solution Code:
```tsx
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

type State = { theme: 'dark' | 'light'; user: string | null };
type Action = { type: 'TOGGLE_THEME' } | { type: 'SET_USER'; payload: string };

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, { theme: 'dark', user: null });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Custom consumption hooks
export function useAppState() {
  const context = useContext(StateContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}

export function useAppDispatch() {
  const context = useContext(DispatchContext);
  if (!context) throw new Error('useAppDispatch must be used within AppProvider');
  return context;
}
```

---

### Challenge 2.3: Lightweight List Virtualization

#### 📌 Problem Statement:
Write a lightweight virtualization component that renders 10,000 items with constant DOM node count (~15 nodes).

#### ✅ Solution Code:
```tsx
import React, { useState } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  viewportHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({
  items,
  itemHeight,
  viewportHeight,
  renderItem,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + 4;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: viewportHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, width: '100%', position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', width: '100%' }}>
          {visibleItems.map((item, idx) => renderItem(item, startIndex + idx))}
        </div>
      </div>
    </div>
  );
}
```

---

# 🌐 Category 3: API Calls, Race Conditions & Caching

---

### Challenge 3.1: Race-Condition-Free `useFetch` with `AbortController`

#### 📌 Problem Statement:
Build a `useFetch<T>(url)` hook that cancels in-flight requests when the `url` parameter changes or when the component unmounts.

#### ✅ Solution Code:
```tsx
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function executeFetch() {
      setState({ data: null, isLoading: true, error: null });

      try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const json = (await response.json()) as T;
        setState({ data: json, isLoading: false, error: null });
      } catch (err: unknown) {
        // Ignore deliberate cancellations
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Unknown network error'),
        });
      }
    }

    executeFetch();

    // Cancellation cleanup callback on unmount or URL change
    return () => {
      controller.abort();
    };
  }, [url]);

  return state;
}
```

---

### Challenge 3.2: In-Memory API Cache Hook (`useCacheFetch`) with TTL

#### 📌 Problem Statement:
Implement a client-side caching hook that stores API responses in an in-memory `Map` with a 60-second Time-To-Live (TTL).

#### ✅ Solution Code:
```tsx
import { useState, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const globalCache = new Map<string, CacheEntry<unknown>>();

export function useCacheFetch<T>(url: string, ttlMs = 60000) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = Date.now();
    const cached = globalCache.get(url) as CacheEntry<T> | undefined;

    if (cached && now - cached.timestamp < ttlMs) {
      setData(cached.data);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((result: T) => {
        if (isMounted) {
          globalCache.set(url, { data: result, timestamp: Date.now() });
          setData(result);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url, ttlMs]);

  return { data, isLoading };
}
```

---

### Challenge 3.3: Exponential Backoff Retry Function

#### 📌 Problem Statement:
Write a reusable utility `fetchWithRetry(url, maxRetries, baseDelay)` that retries failed requests with exponential backoff.

#### ✅ Solution Code:
```tsx
export async function fetchWithRetry<T>(
  url: string,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${(err as Error).message}`);
      }
      // Exponential delay: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unexpected retry loop termination.');
}
```

---

# 🛠️ Category 4: Essential Custom Hooks

---

### Challenge 4.1: The `useDebounce<T>` Custom Hook

#### 📌 Problem Statement:
Write a generic `useDebounce<T>(value: T, delay: number): T` hook with timeout cleanup.

#### ✅ Solution Code:
```tsx
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

### Challenge 4.2: The `usePrevious<T>` Hook

#### 📌 Problem Statement:
Write a hook that tracks and returns the value of a prop or state from the previous render using `useRef`.

#### ✅ Solution Code:
```tsx
import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    // Updates AFTER component render commits to the DOM
    ref.current = value;
  }, [value]);

  // Returns previous value captured during previous render
  return ref.current;
}
```

---

### Challenge 4.3: The `useOnClickOutside` Hook

#### 📌 Problem Statement:
Write a hook that triggers a callback whenever the user clicks outside the referenced element.

#### ✅ Solution Code:
```tsx
import { useEffect, RefObject } from 'react';

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

---

# 🏗️ Category 5: Component Design Patterns & UI Architecture

---

### Challenge 5.1: Accessible Compound `<Tabs>` Component

#### 📌 Problem Statement:
Build a flexible compound tabs component communicating via Context with full keyboard and screen reader accessibility.

#### ✅ Solution Code:
```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-root">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div role="tablist" className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Tab must be used within <Tabs>');

  const isActive = context.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab-btn ${isActive ? 'active' : ''}`}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Panel must be used within <Tabs>');

  if (context.activeTab !== value) return null;

  return <div role="tabpanel" className="tab-panel">{children}</div>;
};
```

---

# 🔮 Category 6: React 19 Modern Primitives

---

### Challenge 6.1: React 19 `useActionState` + Form Validation

#### 📌 Problem Statement:
Implement a profile form using React 19 `useActionState` that extracts native `FormData` and displays inline field errors.

#### ✅ Solution Code:
```tsx
import React, { useActionState } from 'react';

interface ActionState {
  success: boolean;
  error?: string;
  fieldErrors?: { name?: string };
}

async function updateNameAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get('name') ?? '').trim();

  if (!name) {
    return { success: false, fieldErrors: { name: 'Name cannot be empty.' } };
  }

  // Simulated API mutation
  await new Promise((res) => setTimeout(res, 500));
  return { success: true };
}

export function ProfileNameForm() {
  const [state, formAction, isPending] = useActionState(updateNameAction, { success: false });

  return (
    <form action={formAction}>
      <label htmlFor="name">Full Name</label>
      <input id="name" name="name" disabled={isPending} aria-invalid={!!state.fieldErrors?.name} />
      {state.fieldErrors?.name && <span role="alert">{state.fieldErrors.name}</span>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>

      {state.success && <p>✓ Updated successfully!</p>}
    </form>
  );
}
```

---

### Challenge 6.2: React 19 `useOptimistic` Instant Like Button

#### 📌 Problem Statement:
Build a zero-latency "Like Button" that increments immediately (0ms) and automatically rolls back if the server throws an error.

#### ✅ Solution Code:
```tsx
import React, { useOptimistic, useTransition } from 'react';

interface LikeButtonProps {
  initialLikes: number;
  onSendLikeToApi: (count: number) => Promise<void>;
}

export function LikeButton({ initialLikes, onSendLikeToApi }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic state
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    initialLikes,
    (current, amount: number) => current + amount
  );

  const handleLike = () => {
    startTransition(async () => {
      // 1. Instant 0ms UI update
      setOptimisticLikes(1);

      try {
        // 2. Server API request
        await onSendLikeToApi(optimisticLikes + 1);
      } catch {
        // 3. Automatic rollback managed by React Transition!
        alert('Failed to save like on server. Reverting.');
      }
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {optimisticLikes} {isPending ? '(Syncing...)' : ''}
    </button>
  );
}
```

---

### Challenge 6.3: React 19 Ref Callback with Returned Cleanup

#### 📌 Problem Statement:
Attach a `ResizeObserver` in a ref callback that returns its cleanup function directly to prevent memory leaks on unmount.

#### ✅ Solution Code:
```tsx
import React, { useState } from 'react';

export function ResizeCard() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  return (
    <div
      ref={(node: HTMLDivElement | null) => {
        if (!node) return;

        // 1. Setup Observer
        const observer = new ResizeObserver(([entry]) => {
          setDimensions({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        });

        observer.observe(node);

        // 2. React 19 Ref Cleanup Function (Runs on unmount!)
        return () => {
          observer.disconnect();
        };
      }}
    >
      <h3>Card Size</h3>
      <p>{dimensions.width}px × {dimensions.height}px</p>
    </div>
  );
}
```

---

# 🛡️ Category 7: Error Boundaries & Resilience

---

### Challenge 7.1: Typed Error Boundary with Retry Handler

#### 📌 Problem Statement:
Build a class-based Error Boundary that catches runtime errors and suspended `use(Promise)` rejections, rendering an error card with a retry button.

#### ✅ Solution Code:
```tsx
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary captured:', error, info);
  }

  handleRetry = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div role="alert" className="error-card">
          <h3>Something went wrong</h3>
          <p>{this.state.error.message}</p>
          <button onClick={this.handleRetry}>Retry Component</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

# 💻 Category 8: 45-Minute Live Machine Coding Challenges

---

### Project 8.1: Autocomplete / Typeahead Search Bar
- **Debounced input**: Prevents high-frequency requests (`useDebounce`).
- **Request Cancellation**: Aborts previous in-flight search via `AbortController`.
- **Keyboard Navigation**: Arrow up/down (`↑`/`↓`) to navigate suggestions, `Enter` to select, `Escape` to close.
- **Cache**: In-memory cache for recent queries.

### Project 8.2: Infinite Scroll Image Feed
- **IntersectionObserver**: Sentinel element at the bottom of the feed triggers page fetch.
- **State Management**: Appending new page results without mutating existing array.
- **Loading & End of Feed**: Skeletons during fetch and terminal message when no more pages remain.

### Project 8.3: Global Toast Notification System
- **Imperative Dispatch**: `toast.success("Saved!")` accessible anywhere.
- **Queue & Dismissal**: Configurable TTL auto-dismiss timer and pause-on-hover.
- **Portal Rendering**: Rendered at `document.body` via `createPortal`.

### Project 8.4: Interactive Sortable & Filterable Data Table
- **Sorting**: Multi-column ascending/descending comparator.
- **Global Filter**: Multi-field search match.
- **Pagination**: Calculated page slice, jump-to-page controls, and rows-per-page selector.

---

## 🏁 Summary Checklist Before Your Interview

- [x] Can you explain the difference between **Render Phase** and **Commit Phase**?
- [x] Can you fix **Stale Closures** without looking at notes?
- [x] Can you explain when **`useCallback`** is a performance regression?
- [x] Can you write an **`AbortController`** cancellation hook from memory?
- [x] Can you build a **`useActionState`** or **`useOptimistic`** React 19 flow?
- [x] Can you build an accessible **Compound Component**?
