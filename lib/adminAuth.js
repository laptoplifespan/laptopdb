// Verifies that an incoming admin API request carries the correct password.
// The admin panel sends it in the `x-admin-password` header on every write.
export function isAdminRequest(request) {
  const provided = request.headers.get('x-admin-password')
  const expected = process.env.ADMIN_PASSWORD
  return Boolean(expected) && provided === expected
}
