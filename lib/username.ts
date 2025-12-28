export function generateUsernameFromEmail(email: string) {
  const base = email.split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 15);

  return base || "user";
}
