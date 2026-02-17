// Usage
// Connect to PINIA store for permisson
// ROUTE guard to check permissions
// Directives for conditional rendering

import { Role, Permission } from "./permissions";
import { rolePermissions } from "./rolePermissions";

// VUE
// import type { NavigationGuard, RouteLocationNormalized } from 'vue-router';

// REACT
// import type { NavigationGuard, RouteLocationNormalized } from 'react-router';

export class RBACService {
  private get currentRole(): Role {
    // Always get role directly from the store
    // EXAMPLE - Vue
    // const authStore = useAuthStore();
    // return authStore.user.role as Role;
    return Role.STUDENT;
  }

  hasPermission(permission: Permission): boolean {
    return rolePermissions[this.currentRole]?.includes(permission) ?? false;
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  // For routes (VUE)
  //   createPermissionGuard(requiredPermission: Permission): NavigationGuard {
  //     return (
  //       to: RouteLocationNormalized,
  //       from: RouteLocationNormalized,
  //       next: Function,
  //     ) => {
  //       if (this.hasPermission(requiredPermission)) {
  //         next();
  //       } else {
  //         next({ name: "NotFound" }); // Redirect to a 404 or Unauthorized page
  //       }
  //     };
  //   }

  // For routes (REACT)
  //   createPermissionGuard(requiredPermission: Permission): NavigationGuard {
  //     return (
  //       to: RouteLocationNormalized,
  //       from: RouteLocationNormalized,
  //       next: Function,
  //     ) => {
  //       if (this.hasPermission(requiredPermission)) {
  //         next();
  //       } else {
  //         next({ name: "NotFound" }); // Redirect to a 404 or Unauthorized page
  //       }
  //     };
  //   }
}

export const rbacService = new RBACService();
