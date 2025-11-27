// 로그인 되었는지 체크하는 미들웨어 (특정 API에 접근하기 전에 접근 권한 검사)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ msg: '로그인 필요함' });
}

module.exports = { isLoggedIn };