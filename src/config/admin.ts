export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL ?? "ifnotgod@ent.com").toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "admin12345",
    name: process.env.ADMIN_NAME ?? "IF NOT GOD ENT Admin",
  };
}
