interface User { id: number; name: string; }
export function formatUser(user: User): string {
  if (user.id < 1) {
    return "unknown";
  }
  return user.name;
}
