// 로그인 처리 + 세션 관리 (사용자 인증 과정 담당)
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const db = require('../db');

// Login API (passport)
passport.use(
  new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    try {
      const result = await db
        .collection('user')
        .findOne({ username: 입력한아이디 });

      if (!result) {
        return cb(null, false, { message: '아이디 DB에 없음' });
      }

      const isMatch = await bcrypt.compare(입력한비번, result.password);
      if (!isMatch) {
        return cb(null, false, { message: '비번불일치' });
      }

      return cb(null, result);
    } catch (err) {
      cb(err);
    }
  })
);

// Login 시 session 만들기

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user._id.toString())    // 이런내용의 session 기록함
  })
})

// 쿠키 분석 (쿠키는 유저가 요청을 날릴때마다 같이 날라감)
// req.user 사용하면 현재 로그인된 유저출력

passport.deserializeUser(async (id, done) => {   
  try {
    console.log('deserializeUser id:', id);

    const result = await db
      .collection('user')
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return done(null, false);  // 유저 못 찾으면
    }

    delete result.password;

    process.nextTick(() => {
      done(null, result);        // req.user에 들어갈 것
    });
  } catch (err) {
    done(err);
  }
});

module.exports = passport;