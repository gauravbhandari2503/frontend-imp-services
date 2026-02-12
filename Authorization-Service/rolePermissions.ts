import { Permission, Role } from "./permissions";
import adminPermissions from "./userPermissions/adminPermissions";

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [...adminPermissions],
  [Role.STUDENT]: [],
  [Role.TEACHER]: [],
  [Role.PARENT]: [],
  [Role.SCHOOL_ADMIN]: [],
};
