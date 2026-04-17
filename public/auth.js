async function requireAuth() {
  var res = await db.auth.getSession();
  if (!res.data.session) {
    window.location.href = 'login.html';
    return null;
  }
  return res.data.session;
}
