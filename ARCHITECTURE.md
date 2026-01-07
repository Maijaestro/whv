## WHV - WebSocket-Based Subscription Architecture

### Architecture Overview

The application has been fully refactored to use a **centralized, Pinia-based subscription management system** with **WebSocket (iobroker.ws) for real-time state synchronization**.

### Key Components

#### 1. **iobrokerService** (`src/services/iobrokerService.ts`)
- **Purpose:** Low-level WebSocket client to iobroker.ws adapter
- **Key Methods:**
  - `connect()` - Establishes WebSocket to ws://localhost:8084
  - `subscribeState(id)` - Subscribe to state changes
  - `unsubscribeState(id)` - Unsubscribe from state changes
  - `setState(id, value)` - Write state value
  - `getState(id)` - Read current state
  - `onStateChange(cb)` - Register callback for ALL state changes
- **Features:**
  - Auto-reconnect with 3s delay on disconnect
  - Request/response correlation via messageId tracking
  - No external dependencies (native WebSocket API)

#### 2. **Subscription Store** (`src/store/subscriptions.ts`)
- **Purpose:** Pinia store managing centralized subscription lifecycle and state caching
- **State:**
  - `states: Map<id, {value, refCount}>` - Cache of datapoint values with subscription count
  - `connected: boolean` - Connection status
- **Key Actions:**
  - `subscribe(datapoint)` - Auto-fetch initial value, subscribe, return reactive ref
  - `unsubscribe(datapoint)` - Decrement refCount, cleanup when 0
  - `writeState(datapoint, value)` - Write via iobrokerService
  - `getValue(id)` - Get current cached value
- **Lifecycle:**
  - Lazily connects on first subscription
  - Registers global state change handler to update cached values
  - Reference counting prevents duplicate subscriptions

#### 3. **useDataPoint Composable** (`src/composables/useDataPoint.ts`)
- **Purpose:** Encapsulate subscription lifecycle for components
- **Usage:** `const value = useDataPoint(DATAPOINT_OBJECT)`
- **Behavior:**
  - Automatically subscribes on `onMounted()`
  - Automatically unsubscribes on `onBeforeUnmount()`
  - Returns computed ref to current value
- **Eliminates boilerplate:** Views no longer need manual subscribe/unsubscribe code

#### 4. **DataPoint Interface** (`src/types/datapoint.ts`)
- **Purpose:** Standardized description of any controllable/readable datapoint
```typescript
type DataPointType = 'switch' | 'dimmer' | 'number' | 'string' | 'sensor'
interface DataPoint {
  name: string
  id: string        // ioBroker state ID
  type: DataPointType
  writable: boolean
}
```

### Data Flow

```
View Component
    ↓ (defines DataPoint objects)
useDataPoint Composable
    ↓ (mount/unmount lifecycle)
Subscription Store (Pinia)
    ↓ (manages subscriptions, caches state)
iobrokerService (WebSocket)
    ↓ (real-time protocol)
iobroker.ws adapter
    ↓ (WebSocket events)
```

### View Pattern (Simplified)

**OLD (with boilerplate):**
```typescript
const wickellichtOn = ref(false)
onMounted(() => iobrokerService.subscribe(WICKELLICHT.id, onUpdate))
onBeforeUnmount(() => iobrokerService.unsubscribe(WICKELLICHT.id, onUpdate))
```

**NEW (clean):**
```typescript
const wickellichtOn = useDataPoint(WICKELLICHT)
```

Everything else (subscription, unsubscription, state updates) happens automatically via the composable and Pinia store.

### Initialization

- `main.ts` calls `iobrokerService.connect()` on app creation
- Pinia is initialized in `createApp()`
- First view that uses `useDataPoint()` triggers store initialization

### View Updates

**UpperFloor.vue** (`src/views/UpperFloor.vue`)
- Refactored to use `useDataPoint(WICKELLICHT)`
- No manual subscription boilerplate
- Writes via `subscriptionStore.writeState()`
- Clean, declarative pattern

**SettingsView.vue** (`src/views/SettingsView.vue`)
- Updated to work with WebSocket URLs instead of REST
- `testApi()` now creates test WebSocket connection
- Configured via `iobrokerService.setWsUrl()`

**FloorView.vue** (`src/views/FloorView.vue`)
- Legacy view updated to new pattern
- Uses `useDataPoint()` composable

### Key Benefits

1. **No Subscription Boilerplate** - Views define only `DataPoint` objects
2. **Centralized State** - All cached values in Pinia store
3. **Auto Lifecycle** - Subscribe on mount, unsubscribe on unmount (automatic)
4. **Reactive by Default** - Composable returns computed refs
5. **Real-Time Updates** - WebSocket push via iobroker.ws adapter
6. **Efficient** - Reference counting prevents duplicate subscriptions
7. **Scalable** - Easy to add new datapoints, new views, new control types
8. **Type-Safe** - Full TypeScript support with DataPoint interface

### Environment Configuration

Set `VITE_IOBROKER_WS_URL` environment variable to override default ws://localhost:8084:

```bash
VITE_IOBROKER_WS_URL=ws://192.168.1.100:8084 npm run dev
```

Or update in SettingsView.vue at runtime (in-memory, not persisted).

---

**Status:** ✅ Complete. All components integrated and type-checked. No compilation errors.
