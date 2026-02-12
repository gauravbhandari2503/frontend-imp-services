# WorkerService

The `WorkerService` allows you to offload heavy computations to a background thread without creating separate worker files. It creates workers dynamically using Blob URLs.

## Overview

Use this service when you have CPU-intensive tasks that would otherwise block the main thread and freeze the UI (e.g., sorting large arrays, image processing, complex filtering).

### Key Features

- **Dynamic Execution**: Pass a function and data, get a Promise back.
- **No Setup**: No need to configure webpack/vite worker loaders for simple tasks.
- **Type Safety**: Generic support for input and output types.

## How to Use

### 1. One-off Execution

Execute a function in a worker and get the result.

**⚠️ IMPORTANT LIMITATION**: The function passed to `execute` MUST be pure and self-contained. It **cannot** access variables from the outer scope (closures) because it is serialized to a string and run in a separate context.

```typescript
import { workerService } from "@/Worker-Service/workerService";

// Example: Sorting a large array
const largeArray = [
  /* ... 100k items ... */
];

const sorted = await workerService.execute((data) => {
  // This code runs in the worker
  return data.sort((a, b) => a - b);
}, largeArray);
```

### 2. Long-lived Worker

If you need a worker that stays alive (e.g., for processing a stream of data), use `createWorker`.

```typescript
const worker = workerService.createWorker(() => {
  self.onmessage = (e) => {
    const result = e.data * 2;
    self.postMessage(result);
  };
});

worker.onmessage = (e) => console.log(e.data);
worker.postMessage(10); // Logs: 20
```

## Best Practices

1.  **Pure Functions**: Ensure your worker function relies _only_ on its arguments.
2.  **Data Transfer**: Data passed to workers is cloned (structured clone algorithm). Avoid passing non-cloneable objects (like DOM elements or functions).
3.  **Error Handling**: The `execute` method wraps errors, so use standard `try/catch`.
