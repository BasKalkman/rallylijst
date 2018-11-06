function requireAdmin(req, res, next) {
  console.log(res.locals.localsuser);
  if (res.locals.user.role === 'Admin') {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = requireAdmin;
