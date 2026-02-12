# RBACService

The `RBACService` (Role-Based Access Control) is a centralized service for managing user permissions and access control within the application. It acts as the single source of truth for determining what actions a user can perform based on their assigned role.

## Overview

The `RBACService` provides a simplified interface for checking permissions, abstracting away the complexity of role-to-permission mappings. It ensures:

- **Centralized Logic**: Permission checks are consistent across the entire application (components, routes, directives).
- **Type Safety**: Utilizes TypeScript enums (`Role`, `Permission`) to prevent typo-related bugs.
- **Extensibility**: Easily add new roles and permissions without modifying the core logic.

## Core Concepts

### 1. Roles & Permissions

Defined in `permissions.ts`, these enums are the building blocks of the authorization system.

- **Role**: Defines the user types (e.g., `ADMIN`, `STUDENT`, `TEACHER`).
- **Permission**: Granular actions a user can perform (e.g., `VIEW_DASHBOARD_PAGE`, `EDIT_USER`).

### 2. Role Mappings

Defined in `rolePermissions.ts`, this object maps each `Role` to a specific list of `Permission`s.

```typescript
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [...adminPermissions],
  [Role.STUDENT]: [], // Add student permissions here
  // ...
};
```

## How to Use

The `RBACService` is a singleton and can be imported directly into your application.

### Checking Permissions

Use `hasPermission` to check if the current user has a specific permission.

```typescript
import { rbacService } from "@/Authorization-Service/rbacService";
import { Permission } from "@/Authorization-Service/permissions";

if (rbacService.hasPermission(Permission.VIEW_DASHBOARD_PAGE)) {
  // Show dashboard link or allow access
}
```

### Checking Multiple Permissions

Use `hasAnyPermission` to check if the user has _at least one_ of the provided permissions.

```typescript
if (
  rbacService.hasAnyPermission([
    Permission.VIEW_TEACHER_PAGE,
    Permission.VIEW_STUDENT_PAGE,
  ])
) {
  // Show generic "People" menu item
}
```

### Route Guards

The service provides a factory method `createPermissionGuard` to generate route guards for your router (Vue Router or React Router).

**Vue Example:**

```typescript
// router/index.ts
import { rbacService } from "@/Authorization-Service/rbacService";

const routes = [
  {
    path: "/admin",
    component: AdminDashboard,
    beforeEnter: rbacService.createPermissionGuard(Permission.VIEW_DASHBOARD),
  },
];
```

**Note**: The implementation of `createPermissionGuard` inside `rbacService.ts` may need to be uncommented or adjusted based on your specific framework (Vue vs React).

## Extending the System

### Adding a New Permission

1.  Add the new permission string to the `Permission` enum in `permissions.ts`.
2.  Add the permission to the appropriate role list in `rolePermissions.ts` (or specific permission files like `userPermissions/adminPermissions.ts`).

### Adding a New Role

1.  Add the new role string to the `Role` enum in `permissions.ts`.
2.  Add a new entry for the role in `rolePermissions.ts` with an array of their permissions.

## Integration with Auth Store

The `RBACService` needs to know the current user's role. Currently, `currentRole` is hardcoded or needs to be connected to your application's state management (Pinia, Redux, Context).

In `rbacService.ts`:

```typescript
private get currentRole(): Role {
  // Connect to your store here
  // const authStore = useAuthStore();
  // return authStore.user.role;
  return Role.STUDENT; // Temporary default
}
```
