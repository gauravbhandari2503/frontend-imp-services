export enum Role {
  ADMIN = "super-admin",
  STUDENT = "student",
  TEACHER = "teacher",
  PARENT = "parent",
  SCHOOL_ADMIN = "school-admin",
}

export enum Permission {
  // Permission related to pages
  VIEW_DASHBOARD_PAGE = "view_dashboard_page",
  VIEW_STUDENT_PAGE = "view_student_page",
  VIEW_TEACHER_PAGE = "view_teacher_page",
  VIEW_PARENT_PAGE = "view_parent_page",
  VIEW_SCHOOL_ADMIN_PAGE = "view_school_admin_page",
}
