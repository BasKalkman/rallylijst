function requireAdmin(req, res, next) {
  if (res.locals.user.role === 'Admin') {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = requireAdmin;
