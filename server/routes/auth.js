const express = require('express');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('../middlewares/auth');
const db = require('../db');
const passport = require('../config/passport');

const router = express.Router();

// 회원가입
router.post('/SignUp', async (req, res) => {
  try {
    console.log('✅ /SignUp 요청 도착, body:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: '아이디랑 비밀번호 둘 다 보내줘야 함' });
    }

    const userCollection = db.collection('user');

    const existUser = await userCollection.findOne({ username });
    console.log('기존 유저:', existUser);

    if (existUser) {
      return res.status(409).json({ msg: '이미 가입된 아이디임' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await userCollection.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log('📥 insert 결과:', insertResult.insertedId);

    res.json({ msg: '회원가입 완료!' });
  } catch (err) {
    console.error('❌ /SignUp 에러:', err);
    res.status(500).json({ msg: '서버 에러' });
  }
});

// 로그인
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ msg: '서버 에러 발생' });
    }

    if (!user) {
      return res.status(401).json({ msg: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      const safeUser = {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
      };

      return res.json({
        msg: '로그인 성공',
        user: safeUser,
      });
    });
  })(req, res, next);
});

// 내 정보
router.get('/me', isLoggedIn, (req, res) => {
  console.log('현재 로그인 유저:', req.user);
  res.json({ user: req.user });
});

// 로그아웃
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid', {
        httpOnly: true,
        sameSite: 'none', // 배포 환경 맞춰 조정 가능
        secure: true,
      });

      return res.json({ msg: '로그아웃 완료' });
    });
  });
});

module.exports = router;
