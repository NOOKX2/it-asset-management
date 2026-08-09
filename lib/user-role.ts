export const USER_ROLES = ["editor", "viewer"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function parseUserRole(value: string | null | undefined): UserRole {
  if (value === "editor" || value === "viewer") {
    return value;
  }
  return "viewer";
}

export function canEdit(role: UserRole): boolean {
  return role === "editor";
}
