---
title: "My React Native Architecture Decisions"
description: "A deep dive into the technical architecture choices for Brew Loyalty, including state management, navigation, and project structure."
pubDate: 2026-01-10
tags: ["React Native", "Architecture", "TypeScript"]
author: "Derek Jensen"
draft: false
---

When starting a new React Native project, the number of architectural decisions can be overwhelming. State management alone has dozens of options. In this post, I'll share the choices I made for Brew Loyalty and the reasoning behind each one.

## Project Structure

I've landed on a feature-based structure rather than a type-based one:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   └── services/
│   ├── loyalty/
│   ├── profile/
│   └── shops/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── navigation/
```

### Why Feature-Based?

The traditional approach groups files by type: all components in one folder, all hooks in another, etc. This works fine for small projects, but as the app grows, you end up jumping between folders constantly.

With a feature-based structure:

- **Related code lives together.** Everything about authentication is in one place.
- **Easier to understand.** New developers can focus on one feature at a time.
- **Simpler deletions.** Need to remove a feature? Delete one folder.

## State Management

After evaluating Redux, MobX, Zustand, and Jotai, I chose **Zustand** for global state.

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Why Zustand?

- **Minimal boilerplate.** No providers, no reducers, no actions.
- **TypeScript-first.** Excellent type inference out of the box.
- **Small bundle size.** ~1KB gzipped.
- **Flexible.** Works with or without React, supports middleware.

For server state (API data), I use **TanStack Query** (React Query). The separation is important: Zustand for UI state, TanStack Query for server state.

## Navigation

React Navigation is the standard choice, and for good reason. Here's my setup:

```typescript
// navigation/RootNavigator.tsx
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
```

### Type-Safe Navigation

One thing I insist on is type-safe navigation. No more typos in route names or missing parameters:

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ShopDetail: { shopId: string };
  RewardDetail: { rewardId: string; shopId: string };
};

// Usage - TypeScript will catch errors!
navigation.navigate('ShopDetail', { shopId: '123' }); // ✓
navigation.navigate('ShopDetial', { shopId: '123' }); // ✗ Typo caught!
navigation.navigate('ShopDetail', {}); // ✗ Missing shopId!
```

## API Layer

I use a simple service layer pattern with Axios:

```typescript
// services/api.ts
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
});

// Interceptor for auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Combined with TanStack Query:

```typescript
// features/shops/hooks/useShops.ts
export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: () => shopService.getShops(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Error Handling

Global error boundaries catch unexpected crashes:

```typescript
// shared/components/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    errorService.capture(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
```

For API errors, TanStack Query's error handling is excellent:

```typescript
const { data, error, isLoading } = useShops();

if (error) {
  return <ErrorMessage message={error.message} />;
}
```

## Testing Strategy

I follow the testing trophy approach:

1. **Static analysis** (TypeScript, ESLint) - catches most bugs
2. **Integration tests** - test features end-to-end
3. **Unit tests** - for complex business logic only
4. **E2E tests** - critical user flows with Detox

```typescript
// features/loyalty/hooks/__tests__/useLoyaltyCard.test.ts
describe('useLoyaltyCard', () => {
  it('calculates progress correctly', () => {
    const { result } = renderHook(() =>
      useLoyaltyCard({ punches: 7, required: 10 })
    );

    expect(result.current.progress).toBe(0.7);
    expect(result.current.remaining).toBe(3);
  });
});
```

## Key Takeaways

1. **Start simple.** You can always add complexity later.
2. **Type everything.** TypeScript catches bugs before users do.
3. **Separate concerns.** UI state vs server state, features vs shared code.
4. **Optimize for change.** Requirements will evolve; your architecture should accommodate that.

In the next post, I'll dive into the specific UI patterns I'm using for Brew Loyalty, including the design system and component library.

---

*Have questions about any of these decisions? [Reach out](/about) - I'm always happy to discuss architecture.*
