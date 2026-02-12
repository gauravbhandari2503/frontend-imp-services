import { Permission } from "../permissions";

const adminViews: Permission[] = [
  Permission.VIEW_DASHBOARD_PAGE,
  Permission.VIEW_STUDENT_PAGE,
  Permission.VIEW_TEACHER_PAGE,
  Permission.VIEW_PARENT_PAGE,
  Permission.VIEW_SCHOOL_ADMIN_PAGE,
];

const adminPermissions = [...adminViews];

export default adminPermissions;
