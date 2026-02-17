# DateService

The `DateService` provides a consistent way to format, parse, and manipulate dates across the application using `date-fns`.

## Overview

Handling dates in JavaScript can be tricky due to browser inconsistencies and timezone issues. `DateService` centralizes this logic.

### Key Features

- **Consistent Formatting**: Uses `date-fns` format tokens (e.g., `yyyy-MM-dd`).
- **Relative Time**: Easily display "5 minutes ago" or "in 2 days".
- **Timezone Aware**: Can format dates in specific timezones (e.g., user's preference).
- **Singleton**: Ensures one configuration (like default timezone) is used everywhere.

## How to Use

### 1. Formatting Dates

```typescript
import { dateService } from "@/Date-Service/dateService";

const date = new Date();
const formatted = dateService.format(date, "MMM do, yyyy"); // "Oct 25th, 2023"
```

### 2. Relative Time

Great for activity feeds or comments.

```typescript
const timeAgo = dateService.formatRelative("2023-10-25T10:00:00Z");
// "2 hours ago" (depending on current time)
```

### 3. Timezone Handling

Convert UTC dates to a specific timezone.

```typescript
const nyTime = dateService.formatInTimezone(
  utcDate,
  "yyyy-MM-dd HH:mm:ss",
  "America/New_York",
);
```

### Setting User Timezone

If your user has a preferred timezone setting, update the service on login:

```typescript
// In your auth store/service
dateService.setTimezone(user.preferences.timezone);
```

## Why date-fns?

We use `date-fns` instead of Moment.js because:

- **Modular**: We only import what we need, keeping bundle size small.
- **Immutable**: Functions don't mutate the date objects.
- **Native Dates**: Uses standard JS `Date` objects.
