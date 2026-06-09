import type { Role, User } from "@/types/auth";

const adminRoles: Role[] = ["ADMIN", "SUPERADMIN"];

export function isAdminUser(user: User | null | undefined) {
  return Boolean(user?.roles.some((role) => adminRoles.includes(role)));
}
