// Mock authentication and permission
export async function getCurrentUser() {
  return { id: "u1", role: "admin" };
}

export function hasPermission(user: { id: string; role: string }) {
  return user.role === "admin";
}
